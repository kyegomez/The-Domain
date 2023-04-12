import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { PineconeStore } from "langchain/vectorstores";
import { PineconeClient } from "@pinecone-database/pinecone";
import { OpenAIChat } from 'langchain/llms';
import { LLMChain, ChatVectorDBQAChain, loadQAChain } from 'langchain/chains';
// import { PineconeStore } from 'langchain/vectorstores';
import { PromptTemplate } from 'langchain/prompts';
import { CallbackManager } from 'langchain/callbacks';

const CONDENSE_PROMPT =
  PromptTemplate.fromTemplate(`Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.
Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`);

const QA_PROMPT = PromptTemplate.fromTemplate(
  `You are an Athena AI assistant providing helpful advice. You are given the following extracted parts of a long document and a question. Provide a conversational answer based on the context provided.
You should only provide hyperlinks that reference the context below. Do NOT make up hyperlinks.
If you can't find the answer in the context below, just say "Hmm, I'm not sure." Don't try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.
Question: {question}
=========
{context}
=========
Answer in Markdown:`,
);


export const makeChain = (
    vectorstore: PineconeStore,
    onTokenStream?: (token: string) => void,
  ) => {
    const questionGenerator = new LLMChain({
      llm: new OpenAIChat({ temperature: 0 }),
      prompt: CONDENSE_PROMPT,
    });
    const docChain = loadQAChain(
      new OpenAIChat({
        temperature: 0,
        modelName: 'gpt-4', //change this to older versions (e.g. gpt-3.5-turbo) if you don't have access to gpt-4
        streaming: Boolean(onTokenStream),
        callbackManager: onTokenStream
          ? CallbackManager.fromHandlers({
              async handleLLMNewToken(token) {
                onTokenStream(token);
                console.log(token);
              },
            })
          : undefined,
      }),
      { prompt: QA_PROMPT },
    );
  
    return new ChatVectorDBQAChain({
      vectorstore,
      combineDocumentsChain: docChain,
      questionGeneratorChain: questionGenerator,
      returnSourceDocuments: true,
      k: 2, //number of source documents to return
    });
};

if (!process.env.PINECONE_ENVIRONMENT || !process.env.PINECONE_API_KEY) {
    throw new Error('Pinecone environment or api key missing')
}

const environment: string = process.env.PINECONE_ENVIRONMENT;
const apiKey: string = process.env.PINECONE_API_KEY;

export async function initPinecone() {
    try {
      const pinecone = new PineconeClient();
  
      await pinecone.init({
        environment: process.env.PINECONE_ENVIRONMENT ?? '',
        apiKey: process.env.PINECONE_API_KEY ?? '',
      });
  
      console.log("Pinecone client initialized successfully");
      return pinecone;
    } catch (error: any) {
      console.log("Error initializing Pinecone client:", error);
      console.error("Error during Pinecone query:", error);
      console.error("Error details:", error.details);
      // ...rest of the error handling code
      throw new Error("Failed to initialize Pinecone client");
    }
  }

export const pinecone = await initPinecone()


const pineconePromise = (async () => {
    try {
      return await initPinecone();
    } catch (error) {
      console.error("Failed to initialize Pinecone:", error);
      throw error;
    }
})();


if (!process.env.PINECONE_INDEX_NAME) {
    throw new Error("Missing pinecone index name");
}

const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME;


const PINECONE_NAME_SPACE = 'athena';


// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse,
// ) {
//     const {question, history } = req.body;

//     if(!question) {
//         return res.status(400).json({ message: "No question in the request"});
//     }

//     //openai recommedns replacing newlines with spaces for best results
//     const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

//     const pineconeInstance = await pineconePromise;

//     const index = pineconeInstance.Index(PINECONE_INDEX_NAME);


//     //create vector storge
//     const vectorStore = await PineconeStore.fromExistingIndex(
//         new OpenAIEmbeddings({}),
//         {
//             pineconeIndex: index,
//             textKey: 'text',
//             namespace: PINECONE_NAME_SPACE
//         }, 
//     );

//     res.writeHead(200, {
//         'Content-Type': 'text/event-stream',
//         'Cache-Control': 'no-cache, no-transform',
//         Connection: 'keep-alive',
//     });

//     const sendData = (data: string) => {
//         res.write(`data: ${data}\n\n`)
//     }

//     sendData(JSON.stringify({ data: ''}));

//     //create chain
//     const chain = makeChain(vectorStore, (token: string) => {
//         sendData(JSON.stringify({ data: token}));
//     });

//     try {
//         //ask a question
//         console.log("Executing Pinecone query with question:", sanitizedQuestion);
//         const response = await chain.call({
//             question: sanitizedQuestion,
//             chat_history: history || [],
//         });

//         console.log(`response ${response}`)
//         // sendData(JSON.stringify({ sourceDoc}))
//         sendData(JSON.stringify({ sourceDocs: response.sourceDocuments }));
//     } catch (error: any) {
//         console.log(`Error ${error}`);
//         sendData(JSON.stringify({ error: "An error occurred during the Pinecone query." }));
//     } finally {
//         sendData('[DONE]');
//         res.end();

//     }
// }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    const { question, history } = req.body;
  
    if (!question) {
      return res.status(400).json({ message: 'No question in the request' });
    }
    // OpenAI recommends replacing newlines with spaces for best results
    const sanitizedQuestion = question.trim().replaceAll('\n', ' ');
  
    const index = pinecone.Index(PINECONE_INDEX_NAME);
  
    /* create vectorstore*/
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({}),
      {
        pineconeIndex: index,
        textKey: 'text',
        namespace: PINECONE_NAME_SPACE,
      },
    );
  
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    });
  
    const sendData = (data: string) => {
      res.write(`data: ${data}\n\n`);
    };
  
    sendData(JSON.stringify({ data: '' }));
  
    //create chain
    const chain = makeChain(vectorStore, (token: string) => {
      sendData(JSON.stringify({ data: token }));
    });
  
    try {
      //Ask a question
      const response = await chain.call({
        question: sanitizedQuestion,
        chat_history: history || [],
      });
  
      console.log('response', response);
      sendData(JSON.stringify({ sourceDocs: response.sourceDocuments }));
    } catch (error) {
      console.log('error', error);
    } finally {
      sendData('[DONE]');
      res.end();
    }
}