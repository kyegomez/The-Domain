import { Chat } from "@/components/Chat/Chat";
import { Navbar } from "@/components/Mobile/Navbar";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { ChatBody, Conversation, KeyValuePair, Message, OpenAIModel, OpenAIModelID, OpenAIModels } from "types/index";
import { cleanConversationHistory, cleanSelectedConversation } from "utils/app/clean";
import { DEFAULT_SYSTEM_PROMPT } from "utils/app/const";
import { saveConversation, saveConversations, updateConversation } from "utils/app/conversation";
import { exportConversations, importConversations } from "utils/app/data";
import { IconArrowBarLeft, IconArrowBarRight } from '@tabler/icons-react';
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { withAuthRequired, User } from '@supabase/supabase-auth-helpers/nextjs';


export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation>();
  const [loading, setLoading] = useState<boolean>(false);
  const [models, setModels] = useState<OpenAIModel[]>([]);
  const [lightMode, setLightMode] = useState<"dark" | "light">("dark");
  const [messageIsStreaming, setMessageIsStreaming] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [apiKey, setApiKey] = useState<string>("");
  const [messageError, setMessageError] = useState<boolean>(false);
  const [modelError, setModelError] = useState<boolean>(false);
  const stopConversationRef = useRef<boolean>(false);
  

  const handleSend = async (message: Message, isResend: boolean) => {
    const saveConversationsToDB = async (mainConversation: Conversation, allConversations: Conversation[]) => {
      try {
        await fetch('/api/saveConversations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mainConversation, allConversations }),
        });
      } catch (error) {
        console.error('Error saving conversations:', error);
      }
    };

    if (selectedConversation) {
      let updatedConversation: Conversation;

      if (isResend) {
        const updatedMessages = [...selectedConversation.messages];
        updatedMessages.pop();

        updatedConversation = {
          ...selectedConversation,
          messages: [...updatedMessages, message]
        };
      } else {
        updatedConversation = {
          ...selectedConversation,
          messages: [...selectedConversation.messages, message]
        };
      }

      setSelectedConversation(updatedConversation);
      setLoading(true);
      setMessageIsStreaming(true);
      setMessageError(false);

      const chatBody: ChatBody = {
        model: updatedConversation.model,
        messages: updatedConversation.messages,
        key: apiKey,
        prompt: updatedConversation.prompt
      };

      

      const controller = new AbortController();
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        signal: controller.signal,
        body: JSON.stringify(chatBody)
      });

      if (!response.ok) {
        setLoading(false);
        setMessageIsStreaming(false);
        setMessageError(true);
        return;
      }

      const data = response.body;

      if (!data) {
        setLoading(false);
        setMessageIsStreaming(false);
        setMessageError(true);

        return;
      }

      setLoading(false);

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let isFirst = true;
      let text = "";

      while (!done) {
        if (stopConversationRef.current === true) {
          controller.abort();
          done = true;
          break;
        }
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);

        text += chunkValue;

        if (isFirst) {
          isFirst = false;
          const updatedMessages: Message[] = [...updatedConversation.messages, { role: "assistant", content: chunkValue }];

          updatedConversation = {
            ...updatedConversation,
            messages: updatedMessages
          };

          setSelectedConversation(updatedConversation);
        } else {
          const updatedMessages: Message[] = updatedConversation.messages.map((message, index) => {
            if (index === updatedConversation.messages.length - 1) {
              return {
                ...message,
                content: text
              };
            }

            return message;
          });

          updatedConversation = {
            ...updatedConversation,
            messages: updatedMessages
          };

          setSelectedConversation(updatedConversation);
        }
      }

      saveConversation(updatedConversation);

      const updatedConversations: Conversation[] = conversations.map((conversation) => {
        if (conversation.id === selectedConversation.id) {
          return updatedConversation;
        }

        return conversation;
      });

      if (updatedConversations.length === 0) {
        updatedConversations.push(updatedConversation);
      }

      setConversations(updatedConversations);

      saveConversations(updatedConversations);

      setMessageIsStreaming(false);

      saveConversationsToDB(updatedConversation, updatedConversations);

    }
  };

  const fetchModels = async (key: string) => {
    const response = await fetch("/api/models", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        key
      })
    });

    if (!response.ok) {
      setModelError(true);
      return;
    }

    const data = await response.json();

    if (!data) {
      setModelError(true);
      return;
    }

    setModels(data);
    setModelError(false);
  };

  const handleLightMode = (mode: "dark" | "light") => {
    setLightMode(mode);
    localStorage.setItem("theme", mode);
  };

  const handleApiKeyChange = (apiKey: string) => {
    setApiKey(apiKey);
    localStorage.setItem("apiKey", apiKey);
  };

  const handleExportConversations = () => {
    exportConversations();
  };

  const handleImportConversations = (conversations: Conversation[]) => {
    importConversations(conversations);
    setConversations(conversations);
    setSelectedConversation(conversations[conversations.length - 1]);
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    saveConversation(conversation);
  };

  const handleNewConversation = () => {
    const lastConversation = conversations[conversations.length - 1];

    const newConversation: Conversation = {
      id: lastConversation ? lastConversation.id + 1 : 1,
      name: `Conversation ${lastConversation ? lastConversation.id + 1 : 1}`,
      messages: [],
      model: OpenAIModels[OpenAIModelID.GPT_3_5],
      prompt: DEFAULT_SYSTEM_PROMPT
    };

    const updatedConversations = [...conversations, newConversation];

    setSelectedConversation(newConversation);
    setConversations(updatedConversations);

    saveConversation(newConversation);
    saveConversations(updatedConversations);

    setLoading(false);
  };

  const handleDeleteConversation = (conversation: Conversation) => {
    const updatedConversations = conversations.filter((c) => c.id !== conversation.id);
    setConversations(updatedConversations);
    saveConversations(updatedConversations);

    if (updatedConversations.length > 0) {
      setSelectedConversation(updatedConversations[updatedConversations.length - 1]);
      saveConversation(updatedConversations[updatedConversations.length - 1]);
    } else {
      setSelectedConversation({
        id: 1,
        name: "New conversation",
        messages: [],
        model: OpenAIModels[OpenAIModelID.GPT_3_5],
        prompt: DEFAULT_SYSTEM_PROMPT
      });
      localStorage.removeItem("selectedConversation");
    }
  };

  const handleUpdateConversation = (conversation: Conversation, data: KeyValuePair) => {
    const updatedConversation = {
      ...conversation,
      [data.key]: data.value
    };

    const { single, all } = updateConversation(updatedConversation, conversations);

    setSelectedConversation(single);
    setConversations(all);
  };

  const handleClearConversations = () => {
    setConversations([]);
    localStorage.removeItem("conversationHistory");

    setSelectedConversation({
      id: 1,
      name: "New conversation",
      messages: [],
      model: OpenAIModels[OpenAIModelID.GPT_3_5],
      prompt: DEFAULT_SYSTEM_PROMPT
    });
    localStorage.removeItem("selectedConversation");
  };

  useEffect(() => {
    if (window.innerWidth < 640) {
      setShowSidebar(false);
    }
  }, [selectedConversation]);

  useEffect(() => {
    fetchModels(apiKey);
  }, [apiKey]);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) {
      setLightMode(theme as "dark" | "light");
    }

    const apiKey = localStorage.getItem("apiKey") || "";
    if (apiKey) {
      setApiKey(apiKey);
    }

    if (window.innerWidth < 640) {
      setShowSidebar(false);
    }

    const conversationHistory = localStorage.getItem("conversationHistory");
    if (conversationHistory) {
      const parsedConversationHistory: Conversation[] = JSON.parse(conversationHistory);
      const cleanedConversationHistory = cleanConversationHistory(parsedConversationHistory);
      setConversations(cleanedConversationHistory);
    }

    const selectedConversation = localStorage.getItem("selectedConversation");
    if (selectedConversation) {
      const parsedSelectedConversation: Conversation = JSON.parse(selectedConversation);
      const cleanedSelectedConversation = cleanSelectedConversation(parsedSelectedConversation);
      setSelectedConversation(cleanedSelectedConversation);
    } else {
      setSelectedConversation({
        id: 1,
        name: "New conversation",
        messages: [],
        model: OpenAIModels[OpenAIModelID.GPT_3_5],
        prompt: DEFAULT_SYSTEM_PROMPT
      });
    }

    fetchModels(apiKey);
  }, []);

  return (
    <>
      <Head>
        <title>Athena</title>
        <meta
          name="description"
          content="An interface for the universe"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>
      {selectedConversation && (
        <div className={`flex flex-col h-screen w-screen text-white dark:text-white text-sm ${lightMode}`}>
          <div className="sm:hidden w-full fixed top-0">
            <Navbar
              selectedConversation={selectedConversation}
              onNewConversation={handleNewConversation}
            />
          </div>

          <div className="flex h-full w-full pt-[48px] sm:pt-0">
            {showSidebar ? (
              <>
                <Sidebar
                  loading={messageIsStreaming}
                  conversations={conversations}
                  lightMode={lightMode}
                  selectedConversation={selectedConversation}
                  apiKey={apiKey}
                  onToggleLightMode={handleLightMode}
                  onNewConversation={handleNewConversation}
                  onSelectConversation={handleSelectConversation}
                  onDeleteConversation={handleDeleteConversation}
                  onToggleSidebar={() => setShowSidebar(!showSidebar)}
                  onUpdateConversation={handleUpdateConversation}
                  onApiKeyChange={handleApiKeyChange}
                  onClearConversations={handleClearConversations}
                  onExportConversations={handleExportConversations}
                  onImportConversations={handleImportConversations}
                />

                <IconArrowBarLeft
                  className="fixed top-2.5 left-4 sm:top-1 sm:left-4 sm:text-neutral-700 dark:text-white cursor-pointer hover:text-gray-400 dark:hover:text-gray-300 h-7 w-7 sm:h-8 sm:w-8 sm:hidden"
                  onClick={() => setShowSidebar(!showSidebar)}
                />
              </>
            ) : (
              <IconArrowBarRight
                className="fixed text-white z-50 top-2.5 left-4 sm:top-1.5 sm:left-4 sm:text-neutral-700 dark:text-white cursor-pointer hover:text-gray-400 dark:hover:text-gray-300 h-7 w-7 sm:h-8 sm:w-8"
                onClick={() => setShowSidebar(!showSidebar)}
              />
            )}

            <Chat
              conversation={selectedConversation}
              messageIsStreaming={messageIsStreaming}
              modelError={modelError}
              messageError={messageError}
              models={models}
              loading={loading}
              lightMode={lightMode}
              onSend={handleSend}
              onUpdateConversation={handleUpdateConversation}
              stopConversationRef={stopConversationRef}
            />
          </div>
        </div>
      )}
    </>
  );
}