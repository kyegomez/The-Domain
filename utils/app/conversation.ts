import { Conversation } from "types/index";
// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient();

import {prisma} from 'lib/prisma'


export const updateConversation = (updatedConversation: Conversation, allConversations: Conversation[]) => {
  const updatedConversations = allConversations.map((c) => {
    if (c.id === updatedConversation.id) {
      return updatedConversation;
    }

    return c;
  });

  try {
    saveConversation(updatedConversation);
    saveConversations(updatedConversations);
  } catch (error) {
    console.log(`ERRORRRR ${error}`)
  }


  return {
    single: updatedConversation,
    all: updatedConversations
  };
};

export const saveConversation = async (conversation: Conversation) => {
  localStorage.setItem("selectedConversation", JSON.stringify(conversation));


  try {
    await prisma.conversation.create({
      data: {
        userId,
        name: conversation.name,
        messages: conversation.messages,
        modelId: conversation.model.id,
        prompt: conversation.prompt
      }
    });
  } catch (error) {
    console.error('Error saving conversation:', error);
    // th
  }


};

export const saveConversations = async (conversations: Conversation[]) => {
  localStorage.setItem("conversationHistory", JSON.stringify(conversations));

  try {
    // Save all conversations to the database
    await prisma.conversation.createMany({
      data: conversations.map((conversation) => ({
        userId,
        name: conversation.name,
        messages: conversation.messages,
        modelId: conversation.model.id,
        prompt: conversation.prompt
      }))
    });
  } catch (error) {
    console.error('Error saving conversations:', error);
    throw error;
  }

  // prisma.conversations.create({
  //   data: {
  //     time: new Date(),
  //     data: JSON.stringify(conversations),
  //     critical: true
  //   }
  // })
};


