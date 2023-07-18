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
    role: string;
    content: string;
    image?: string;
  }
  
  export type Role = "assistant" | "user";
  
  export interface Conversation {
    id: number;
    // user_id: string;
    name: string;
    messages: Message[];
    model: OpenAIModel;
    prompt: string;
    // create_time: number;
    // update_time: number;
    // mapping: Record<string, Mapping>;
    // moderation_results: any[];
    // current_node: string;
    // plugin_ids: any;
    // title: string | null;
  }

  // export interface Mapping {
  //   id: string;
  //   message: MessageNode;
  //   parent: string | null;
  //   children: string[];
  // }

  // export interface MessageNode {
  //   id: string;
  //   author: { role: string; name: string | null; metadata: any };
  //   create_time: number;
  //   update_time: number | null;
  //   content: { content_type: string; parts: string[]; sentiment: string; request_type: string };
  //   status: string;
  //   end_turn: boolean;
  //   weight: number;
  //   metadata: any;
  //   recipient: string;
  //   confidence: number;
  // }

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