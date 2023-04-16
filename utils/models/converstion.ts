import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: String,
  content: String,
});

const conversationSchema = new mongoose.Schema({
  id: Number,
  name: String,
  messages: [messageSchema],
  model: {
    id: String,
    name: String,
  },
  prompt: String,
  allConversations: [
    {
      id: Number,
      name: String,
      messages: [messageSchema],
      model: {
        id: String,
        name: String,
      },
      prompt: String,
    },
  ],
});

const ConversationModel = mongoose.model('Domain-Conversations', conversationSchema);

export default ConversationModel;