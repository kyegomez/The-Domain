import type { NextApiRequest, NextApiResponse } from 'next';
// import ConversationModel from '../../models/Conversation';
import ConversationModel from 'utils/models/converstion';
import connectDB from '@/lib/mongoose';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  
  if (req.method === 'POST') {
    const { mainConversation, allConversations } = req.body;

    try {
      await ConversationModel.create({
        ...mainConversation,
        allConversations,
      });
      res.status(200).json({ message: 'Conversations saved successfully' });
    } catch (error) {
      console.error('Error saving conversations:', error);
      res.status(500).json({ message: 'Error saving conversations' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}