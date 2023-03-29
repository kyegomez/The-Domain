import { Conversation } from "types/index";
// import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient();


export const updateConversation = (updatedConversation: Conversation, allConversations: Conversation[]) => {
  const updatedConversations = allConversations.map((c) => {
    if (c.id === updatedConversation.id) {
      return updatedConversation;
    }

    return c;
  });

  saveConversation(updatedConversation);
  saveConversations(updatedConversations);

  return {
    single: updatedConversation,
    all: updatedConversations
  };
};

export const saveConversation = (conversation: Conversation) => {
  localStorage.setItem("selectedConversation", JSON.stringify(conversation));

};

export const saveConversations = (conversations: Conversation[]) => {
  localStorage.setItem("conversationHistory", JSON.stringify(conversations));
  // prisma.conversations.create({
  //   data: {
  //     time: new Date(),
  //     data: JSON.stringify(conversations),
  //     critical: true
  //   }
  // })
};


