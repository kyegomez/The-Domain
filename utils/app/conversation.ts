import { Conversation } from "types/index";


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

};

export const saveConversations = async (conversations: Conversation[]) => {
  localStorage.setItem("conversationHistory", JSON.stringify(conversations));

};
