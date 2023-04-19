/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import  Interaction, { IInteraction } from 'utils/models/athena-browser-writely';
import cors from 'nextjs-cors';


const mongo_url: any = process.env.MONGO_URL;

if (mongoose.connection.readyState === 0) {
  mongoose
    .connect(`${mongo_url}`)
    .catch((error) => console.error('Error connecting to MongoDB:', error));
}


if (mongoose.connection.readyState === 0) {
  mongoose
    .connect(`${mongo_url}`)
    .catch((error) => console.error('Error connecting to MongoDB:', error));
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res, {
    methods: ['POST'],
    origin: '*', // Update this to restrict the allowed origins
    optionsSuccessStatus: 200,
  });

  if (req.method === 'POST') {
    try {
      const interactionData: IInteraction = new Interaction(req.body);
      await interactionData.save();
      res.status(200).json({ message: 'Interaction data saved successfully' });
    } catch (error: any) {
      console.error('Request body:', req.body);
      console.error('Error saving interaction data:', error);
      console.error('Error stack trace:', error.stack);
      res.status(500).json({ message: 'Error saving interaction data', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
    res.status(405).json({ message: 'Method not allowed' });

  }
};