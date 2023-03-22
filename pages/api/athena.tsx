import { OpenAI } from 'langchain/llms'
import { OpenAIChat } from "langchain/llms";
import { LLMChain, ChatVectorDBQAChain, loadQAChain } from 'langchain/chains';
import { PineconeStore } from "langchain/vectorstores";
import { PromptTemplate } from "langchain/dist";
import { CallbackManager } from "langchain/dist/callbacks";
// import { PineconeClient } from '@pinecone-database/pinecone';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
    AgentExecutor,
    initializeAgentExecutor,
    ZapierToolKit,
    Agent,
} from "langchain/agents";
import { ConversationChain } from "langchain/chains";
import { ZeroShotAgent } from "langchain/agents";
import { DynamicTool, ZapierNLAWrapper } from "langchain/tools";
import { BufferMemory } from "langchain/dist/memory";

import type { LLMResult } from "langchain/dist/schema";
import { FewShotPromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { Document } from 'langchain/dist/document';

declare const chrome: any;
declare const result: any;


const template = `

You are Athena, A multi-modality AI driving a users browser.
You are given:
[1]: The objective you're trying to achieve
[2]: The url of the current webpage
[3]: The DOM Elements of the current page in this format (Headers, paragraphs, ClickableElements, and Typeable elements)

For every objective analyze the users active DOM to generate javascript DOM code to manipluate the user's browser in order to achieve the users objective


Based on your given objective, issue whatever command you believe will get you closest to achieving your goal.
You always start on Google; you should submit a search query to Google that will take you to the best page for
achieving your objective. And then interact with that page to achieve your objective.

Don't try to interact with elements you cannot see.    


Human: Hey Athena, are you synced up?
Human: Active Browser Element Data URL: 
        \n\nHeaders:\n
        \n\nParagraphs:\n
        \n\nClickable Elements:\n
        \n\nTypeable Elements:\n
\n\nHuman: go to youtube
\n\nAthena: window.location = 'https://youtube.com';
\n\nHuman: {task} Dom data: {dom} 
{chat_history}
{context}
Return in Markdown


`;


const parser = StructuredOutputParser.fromNamesAndDescriptions({
    javascript: "The javascript that will be injected",
    nonJavascript: "Everything else that is not javascript",
});

const formatInstructions = parser.getFormatInstructions();

const prompt = new PromptTemplate({
    template: template,
    inputVariables: ["dom", "javascript",],
    partialVariables: { format_instructions: formatInstructions },
});

const fewShotPrompt = new FewShotPromptTemplate({
    examplePrompt: prompt,
    prefix: "When prompted click or type on the most likely div element related to the user's goal",
    suffix: "Begin! Remember to generate the javascript needed to manipulate the DOM page by first analyzing the page's current DOM div elements and then manipulating them",
    inputVariables: ["dom", "javascript", "indexor", "task", "history", "context" ],
    exampleSeparator: "\n\n",
    templateFormat: "f-string",
});

// const res = prompt.format({ dom: do})

// Create a callback manager
const callbackManager = CallbackManager.fromHandlers({
    handleLLMStart: async (llm: { name: string }, prompts: string[]) => {
        console.log(JSON.stringify(llm, null, 2));
        console.log(JSON.stringify(prompts, null, 2));
    },
    handleLLMEnd: async (output: LLMResult) => {
        console.log(JSON.stringify(output, null, 2));
    },
    handleLLMError: async (err: Error) => {
        console.error(err);
    },
});

const memory = new BufferMemory({ returnMessages: true, memoryKey: "history" });
const history = memory;

const model = new OpenAIChat({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-3.5-turbo",
    temperature: 1,
    verbose: true,
    callbackManager,
});

const chain = new ConversationChain({
    llm: model,
    memory: history,
    prompt: fewShotPrompt,
});

// Define the tools
const tools = [
    new DynamicTool({
        name: "Indexor",
        description:
            "Scrapes all the headers, paragraphs, and text from the current webpage",
        func: async (page: any) => {
            return new Promise<string>((resolve) => {
                // @ts-ignore
                chrome.tabs.executeScript(
                    {
                        code: `
                  const headers = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6")).map((header) => header.textContent);
                  const paragraphs = Array.from(document.querySelectorAll("p")).map((p) => p.textContent);
                  const allText = Array.from(document.querySelectorAll("body *")).map((el) => el.textContent).filter(Boolean).join(" ");
                  ({ headers, paragraphs, allText });
                `,
                    },
                        // @ts-ignore
                    ([result]) => {
                        resolve(JSON.stringify(result));
                    },
                );
            });
        },
    }),
    new DynamicTool({
        name: "Dom Analyzer",
        description:
            "Call this tool to analyze the users active DOM elements so you can then inject javascript using the ID of the elements to manipulate the GUI",
        func: async (page: any) => {
            return new Promise<string>((resolve) => {
                // @ts-ignore
                chrome.tabs.executeScript(
                    {
                        code: `
                            const clickableElements = Array.from(document.querySelectorAll("a, button, input[type='button'], input[type='submit']")).map((element) => element.outerHTML);
                            const typeableElements = Array.from(document.querySelectorAll("input[type='text'], input[type='email'], input[type='password'], input[type='search'], input[type='tel'], input[type='url'], input[type='number'], input[type='date'], input[type='time'], input[type='week'], input[type='month'], input[type='datetime'], input[type='datetime-local'], textarea")).map((element) => element.outerHTML);
                            ({ clickableElements, typeableElements });
                        `,
                    },
                    // @ts-ignore

                    ([result]) => {
                        resolve(JSON.stringify(result));
                    },
                );
            });
        },
    }),
    new DynamicTool({
        name: "InjectScript",
        description:
            "Injects a script with the provided URL into the specified location",
        func: async (dom: any) => {
            const params = JSON.parse(dom);
            return new Promise((resolve, reject) => {
                const elm = document.createElement("script");
                const targetElement = document.body
                    ? document
                    : document.head;
                targetElement.appendChild(elm);
                elm.onload = () => {
                    resolve(`Inject ${params.src} complete!`);
                };
                elm.src = params.src;
            });
        },
    }),

    new DynamicTool({
        name: "3rd Party API Connector / Zapier",
        description: "Call this tool to execute an action over a 3rd party api",
        func: async (task: string): Promise<string> => {
            const zapier = new ZapierNLAWrapper();
        
            const toolkit = ZapierToolKit.fromZapierNLAWrapper(zapier);
            console.log(`${task}`);
          
            // Return a string value (modify this based on your requirements)
            return "Task completed";
        },
    }),
];




// const executor = await initializeAgentExecutor(tools, model, "zero-shot-react-description");
console.log("loaded agent");

// const prefix = `When prompted click or type on the most likely div element related to the user's goal`;
// const suffix = `Begin! Remember to generate the javascript needed to manipulate the DOM page by first analyzing the page's current DOM div elements and then manipulating them`;

export const zeroShotAgent = new ZeroShotAgent({
    llmChain: chain,
    allowedTools: ["Indexor", "Dom Analyzer", "Javascript injector", "Zapier"],
});

// const agentExecutor = new AgentExecutor(zeroShotAgent);

export const agentExecutor = AgentExecutor.fromAgentAndTools({
    agent: zeroShotAgent,
    tools: tools,
});

console.log("loaded agent");


////////////////////////===============+> split 


// export type Message = {
//     type: 'apiMessage' | 'userMessage';
//     message: string;
//     isStreaming?: boolean;
//     sourceDocs?: Document[];
// };

// if (!process.env.OPENAI_API_KEY) {
//     throw new Error('Missing OpenAI credentials');
// }

// export const openai = new OpenAI({
//     temperature: 0
// })


// export const PINECONE_INDEX_NAME = "DOM-data";

// export const PINECONE_NAME_SPACE = "DOM-test";


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
//     vectorstore: PineconeStore,
//     onTokenStream?: (token: string) => void,
//   ) => {
//     const questionGenerator = new LLMChain({
//       llm: new OpenAIChat({ temperature: 0 }),
//       prompt: CONDENSE_PROMPT,
//     });
//     const docChain = loadQAChain(
//       new OpenAIChat({
//         temperature: 0,
//         modelName: 'gpt-4', //change this to older versions (e.g. gpt-3.5-turbo) if you don't have access to gpt-4
//         streaming: Boolean(onTokenStream),
//         callbackManager: onTokenStream
//           ? CallbackManager.fromHandlers({
//               async handleLLMNewToken(token) {
//                 onTokenStream(token);
//                 console.log(token);
//               },
//             })
//           : undefined,
//       }),
//       { prompt: QA_PROMPT },
//     );

//     return new ChatVectorDBQAChain({
//         vectorstore,
//         combineDocumentsChain: docChain,
//         questionGeneratorChain: questionGenerator,
//         returnSourceDocuments: true,
//         k: 2, //number of source documents to return
//       });
//     };


// if (!process.env.PINECONE_ENVIRONMENT || !process.env.PINECONE_API_KEY) {
//     throw new Error('pinecone environment or api key vars missing');
// }

// async function initPinecone() {
//     try {
//         const pinecone = new PineconeClient();

//         await pinecone.init({
//             environment: process.env.PINECONE_ENVIRONMENT ?? '',
//             apiKey: process.env.PINECONE_API_KEY ?? '',
//         });

//         return pinecone;
//     } catch (error) {
//         console.log('error', error);
//         throw new Error('failed to initlize Pinecone Client');
//     }
// }

// export const pinecone = await initPinecone();









//========================================> this is where the request is parsed for dom, task, history 
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { dom, task, history, index } = req.body;

    console.log(`request bodyyy: ${req.body}`);

    if (!task) {
        return res.status(400).json({ message: 'no question in the request' });
    }

    // OpenAI recommends replacing newlines with spaces for best results
    const sanitizedTask = task.trim().replaceAll('\n', '');
    console.log(`sanitized task: ${sanitizedTask}`);

    // Pass the extracted data to the agentExecutor and retrieve the response
    const agentResponse = await agentExecutor.call({task: sanitizedTask, history: history, dom: dom, index: index});

    console.log(`agent response: ${agentResponse}`);

    // Return the agent's response as the Next.js response
    return res.status(200).json(agentResponse);
}