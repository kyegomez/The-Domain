import { OpenAI } from 'langchain/llms'
import { OpenAIChat } from "langchain/llms";
import { LLMChain, ChatVectorDBQAChain, loadQAChain } from 'langchain/chains';
import { PineconeStore } from "langchain/vectorstores";
import { PromptTemplate } from 'langchain/prompts';
import { CallbackManager } from "langchain/callbacks";

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
import { BufferMemory } from "langchain/memory";

import type { LLMResult } from "langchain/schema";
import { FewShotPromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { Document } from 'langchain/document';

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
    inputVariables: [ "task", "history", "context" ],
    partialVariables: { format_instructions: formatInstructions },
});

const fewShotPrompt = new FewShotPromptTemplate({
    examplePrompt: prompt,
    prefix: "When prompted click or type on the most likely div element related to the user's goal",
    suffix: "Begin! Remember to generate the javascript needed to manipulate the DOM page by first analyzing the page's current DOM div elements and then manipulating them",
    inputVariables: [ "javascript", "task", "history", "context" ],
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
    allowedTools: ["Javascript injector", "Zapier"],
});

// const agentExecutor = new AgentExecutor(zeroShotAgent);

export const agentExecutor = AgentExecutor.fromAgentAndTools({
    agent: zeroShotAgent,
    tools: tools,
});

console.log("loaded agent");




//========================================> this is where the request is parsed for dom, task, history 
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    // const { indexor, dom, task, history } = req.body;

    const {task} = req.body;
    

    console.log(`request bodyyy: ${req.body}`);

    if (!task) {
        return res.status(400).json({ message: 'no question in the request' });
    }

    // OpenAI recommends replacing newlines with spaces for best results
    const sanitizedTask = task.trim().replaceAll('\n', '');
    console.log(`sanitized task: ${sanitizedTask}`);

    // Pass the extracted data to the agentExecutor and retrieve the response
    const agentResponse = await agentExecutor.call({sanitizedTask});

    console.log(`agent response: ${agentResponse}`);

    // Return the agent's response as the Next.js response
    return res.status(200).json(agentResponse);
}