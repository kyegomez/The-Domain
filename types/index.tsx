export interface athena {
  id: string;
  name: string;
}
export interface OpenAIModel {
    id: string;
    name: string;
  }
  

export enum OpenAIModelID {
  GPT_3_5 = "gpt-3.5-turbo",
  GPT_4 = "gpt-4",
}

  
  export const OpenAIModels: Record<OpenAIModelID, OpenAIModel> = {
    [OpenAIModelID.GPT_3_5]: {
      id: OpenAIModelID.GPT_3_5,
      name: "Default Athena v1"
    },
    [OpenAIModelID.GPT_4]: {
      id: OpenAIModelID.GPT_4,
      name: "Athena+"
    }
  };
  
  export interface Message {
    role: Role;
    content: string;
  }
  
  export type Role = "assistant" | "user";
  
  export interface Conversation {
    id: number;
    name: string;
    messages: Message[];
    model: OpenAIModel;
    prompt: string;
  }
  
  export interface ChatBody {
    model: OpenAIModel;
    messages: Message[];
    key: string;
    prompt: string;
  }
  
  export interface KeyValuePair {
    key: string;
    value: any;
  }
  
  // keep track of local storage schema
  export interface LocalStorage {
    apiKey: string;
    conversationHistory: Conversation[];
    selectedConversation: Conversation;
    theme: "light" | "dark";
  }
  
  export interface ErrorMessage {
    code: String | null;
    title: String;
    messageLines: String[];
  }
  
  export interface LlamaIndex {
    indexName: string;
  }
  

export interface ChatFolder {
  id: number;
  name: string;
}