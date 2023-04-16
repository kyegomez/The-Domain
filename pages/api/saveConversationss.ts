import type { NextApiRequest, NextApiResponse } from 'next';
import ConversationModel from 'utils/models/converstion';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const conversations = req.body.conversations;

    try {
      await Promise.all(
        conversations.map((conversation: any) =>
          ConversationModel.create({
            conversationData: conversation,
          })
        )
      );
      res.status(200).json({ message: 'Conversations saved successfully' });
    } catch (error) {
      console.error('Error saving conversations:', error);
      res.status(500).json({ message: 'Error saving conversations' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}