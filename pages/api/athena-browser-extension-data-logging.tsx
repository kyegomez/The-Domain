/* eslint-disable import/no-anonymous-default-export */
// import { NextApiRequest, NextApiResponse } from "next";
// import { PineconeClient } from "@pinecone-database/pinecone";
// import { OpenAIEmbeddings } from 'langchain/embeddings';
// import { PineconeStore } from 'langchain/vectorstores';
// // import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';
// // import { makeChain } from '@/utils/makechain';

// import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
// // import { OpenAIEmbeddings } from 'langchain/embeddings';
// // import { PineconeStore } from 'langchain/vectorstores';
// // import { pinecone } from '@/utils/pinecone-client';
// // import { CustomPDFLoader } from '@/utils/customPDFLoader';
// import { UnstructuredLoader } from "langchain/document_loaders";


// //loads the json
// import { JSONLoader } from "langchain/document_loaders";

// const loader = new JSONLoader("src/document_loaders/example_data/example.json");



// // import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';
// import { DirectoryLoader } from 'langchain/document_loaders';

// /* Name of directory to retrieve your files from */
// const filePath = 'docs';

// export const run = async () => {
//   try {
//     /*load raw docs from the all files in the directory */
//     const directoryLoader = new DirectoryLoader(filePath, {
//       '.pdf': (path) => new loader(path),
//     });

//     // const loader = new PDFLoader(filePath);
//     const rawDocs = await directoryLoader.load();

//     /* Split text into chunks */
//     const textSplitter = new RecursiveCharacterTextSplitter({
//       chunkSize: 1000,
//       chunkOverlap: 200,
//     });

//     const docs = await textSplitter.splitDocuments(rawDocs);
//     console.log('split docs', docs);

//     console.log('creating vector store...');
//     /*create and store the embeddings in the vectorStore*/
//     const embeddings = new OpenAIEmbeddings();
//     const index = pinecone.Index(PINECONE_INDEX_NAME); //change to your own index name

//     //embed the PDF documents
//     await PineconeStore.fromDocuments(docs, embeddings, {
//       pineconeIndex: index,
//       namespace: PINECONE_NAME_SPACE,
//       textKey: 'text',
//     });
//   } catch (error) {
//     console.log('error', error);
//     throw new Error('Failed to ingest your data');
//   }
// };

// (async () => {
//   await run();
//   console.log('ingestion complete');
// })();

// import { OpenAIChat } from 'langchain/llms';
// import { LLMChain, ChatVectorDBQAChain, loadQAChain } from 'langchain/chains';
// import { PromptTemplate } from 'langchain/prompts';
// import { CallbackManager } from 'langchain/callbacks';

// const CONDENSE_PROMPT =
//   PromptTemplate.fromTemplate(`Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.
// Chat History:
// {chat_history}
// Follow Up Input: {question}
// Standalone question:`);

// const QA_PROMPT = PromptTemplate.fromTemplate(
//   `You are an AI assistant providing helpful advice. You are given the following extracted parts of a long document and a question. Provide a conversational answer based on the context provided.
// You should only provide hyperlinks that reference the context below. Do NOT make up hyperlinks.
// If you can't find the answer in the context below, just say "Hmm, I'm not sure." Don't try to make up an answer.
// If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.
// Question: {question}
// =========
// {context}
// =========
// Answer in Markdown:`,
// );

// export const makeChain = (
//   vectorstore: PineconeStore,
//   onTokenStream?: (token: string) => void,
// ) => {
//   const questionGenerator = new LLMChain({
//     llm: new OpenAIChat({ temperature: 0 }),
//     prompt: CONDENSE_PROMPT,
//   });
//   const docChain = loadQAChain(
//     new OpenAIChat({
//       temperature: 0,
//       modelName: 'gpt-4', //change this to older versions (e.g. gpt-3.5-turbo) if you don't have access to gpt-4
//       streaming: Boolean(onTokenStream),
//       callbackManager: onTokenStream
//         ? CallbackManager.fromHandlers({
//             async handleLLMNewToken(token) {
//               onTokenStream(token);
//               console.log(token);
//             },
//           })
//         : undefined,
//     }),
//     { prompt: QA_PROMPT },
//   );

//   return new ChatVectorDBQAChain({
//     vectorstore,
//     combineDocumentsChain: docChain,
//     questionGeneratorChain: questionGenerator,
//     returnSourceDocuments: true,
//     k: 2, //number of source documents to return
//   });
// };


// if (!process.env.PINECONE_INDEX_NAME) {
//   throw new Error('Missing Pinecone index name in .env file');
// }

// const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME ?? '';

// const PINECONE_NAME_SPACE = 'athena-browser'; //namespace is optional for your vectors


// const PINECONE_API_KEY = process.env.PINECONE_API_KEY;

// const pinecone = new PineconeClient();
// await pinecone.init({
//   environment: "YOUR_ENVIRONMENT",
//   apiKey: "YOUR_API_KEY",
// });

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   const { question, history } = req.body;

//   if (!question) {
//     return res.status(400).json({ message: 'No question in the request' });
//   }
//   // OpenAI recommends replacing newlines with spaces for best results
//   const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

//   const index = pinecone.Index(PINECONE_INDEX_NAME);

//   /* create vectorstore*/
//   const vectorStore = await PineconeStore.fromExistingIndex(
//     new OpenAIEmbeddings({}),
//     {
//       pineconeIndex: index,
//       textKey: 'text',
//       namespace: PINECONE_NAME_SPACE,
//     },
//   );

//   res.writeHead(200, {
//     'Content-Type': 'text/event-stream',
//     'Cache-Control': 'no-cache, no-transform',
//     Connection: 'keep-alive',
//   });

//   const sendData = (data: string) => {
//     res.write(`data: ${data}\n\n`);
//   };

//   sendData(JSON.stringify({ data: '' }));

//   //create chain
//   const chain = makeChain(vectorStore, (token: string) => {
//     sendData(JSON.stringify({ data: token }));
//   });

//   try {
//     //Ask a question
//     const response = await chain.call({
//       question: sanitizedQuestion,
//       chat_history: history || [],
//     });

//     console.log('response', response);
//     sendData(JSON.stringify({ sourceDocs: response.sourceDocuments }));
//   } catch (error) {
//     console.log('error', error);
//   } finally {
//     sendData('[DONE]');
//     res.end();
//   }
// }




import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { Completion, ICompletion } from 'utils/models/athena-browser';

// import Completion, { ICompletion } from "../../models/Completion";
// Connect to MongoDB if not already connected
const mongo_url: any = process.env.MONGO_URL;

if (mongoose.connection.readyState === 0) {
  mongoose
    .connect(`${mongo_url}/athena-browser-extension`)
    .catch((error) => console.error("Error connecting to MongoDB:", error));
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const completionData: ICompletion = new Completion(req.body);
      await completionData.save();
      res.status(200).json({ message: "Completion data saved successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error saving completion data", error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};