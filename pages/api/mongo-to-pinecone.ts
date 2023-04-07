import {MongoClient } from 'mongodb';
// import Pinecone from 'pinecone';
import { PineconeClient } from "@pinecone-database/pinecone";
// import * as dotenv from "dotenv";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { PineconeStore } from 'langchain/vectorstores';
import { NextApiRequest, NextApiResponse } from 'next';



const url: any = process.env.MONGO_URL;

const client = new MongoClient(url);

// const pinecone_key = process.env.PINECONE_API_KEY;

// const pinecone = new Pinecone(pinecone_key)

// const pineconeClient: any = new PineconeClient();
// await pineconeClient.init({
//     apiKey: process.env.PINECONE_API_KEY,
//     environment: process.env.PINECONE_ENVIRONMENT,
// });

// const pineconeIndex = pineconeClient.Index(process.env.PINECONE_INDEX);

// const handler = async(req: NextApiRequest, res: NextApiResponse) => {
//     if (req.method !== 'POST') {
//         res.status(405).json({ message: 'Method not allowed'});
//     }

//     try {
//         //conect to mongodb
//         await client.connect()
//         const db = client.db('db');
//         const collection = db.collection('d')

//         //retrieve all entries to mongodb
//         const entries = await collection.find({}).toArray();
//         console.log(`Found documents => ${entries}`);

//         //convert entries to langchain documents
//         // const docs = entries.map(
//         //     (entry) =>
//         //     new Document({
//         //         metadata: entry.metadata,
//         //         pageContent: entry.pageContent,
//         //     })
//         // );

//         const docs = entries.map((entry) => {
//             const metadata = {
//                 timestamp: entry.Timestamp,
//                 previousActions: entry.PreviousActions || [],
//             };

//             const pageContent = `
//                 Task Instructions: ${entry.taskInstructions}
//                 Simplified DOM: ${entry.simplifiedDOM}
//                 Prompt: ${entry.prompt}
//                 Response: ${entry.response}
//             `;

//             return new Document({
//                 metadata: metadata,
//                 pageContent: pageContent,
//             });
//         });

//         //insert entries into pinecone
//         await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
//             pineconeIndex
//         });

//         res.status(200).json({ message: 'Data transformer completed'});
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error'});
//     }
// };


// export default handler;


async function initializePineconeClient() {
    const pineconeClient: any = new PineconeClient();
    await pineconeClient.init({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENVIRONMENT,
    });
    return pineconeClient.Index('athena-browser-workflows');
}
  
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method not allowed' });
        return;
    }

    try {
        // Connect to MongoDB
        await client.connect();
        const db = client.db('test');
        const collection = db.collection('completions');

        // Retrieve all entries from MongoDB
        const entries = await collection.find({}).toArray();
        console.log(`All Entries: ${entries}`);


        // Convert entries to Langchain Documents
        const docs = entries.map((entry) => {
        const metadata = {
            timestamp: entry.Timestamp,
            previousActions: entry.PreviousActions || [],
        };

        const pageContent = `
            Task Instructions: ${entry.taskInstructions}
            Simplified DOM: ${entry.simplifiedDOM}
            Prompt: ${entry.prompt}
            Response: ${entry.response}
        `;

        return new Document({
            metadata: metadata,
            pageContent: pageContent,
        });
        });

        // Initialize Pinecone client
        const pineconeIndex = await initializePineconeClient();

        // Insert entries into Pinecone
        // await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
        // pineconeIndex,
        // });

        // const maxContentLength = 8191;

        for (const doc of docs) {
            console.log(`Doc: ${doc}`)
            await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
                pineconeIndex,
            });
        }



        res.status(200).json({ message: 'Data transfer completed' });
} catch (error: any) {
    console.error(error);
    console.log(`error.response.data: ${JSON.stringify(error.response.data, null, 2)}`);
    res.status(500).json({ message: 'Internal server error' });
}
};

export default handler;