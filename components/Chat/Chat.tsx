import { Conversation, KeyValuePair, Message, OpenAIModel } from "types/index";
import { FC, MutableRefObject, useEffect, useRef, useState } from "react";
import { ChatInput } from "./ChatInput";
import { ChatLoader } from "./ChatLoader";
import { ChatMessage } from "./ChatMessage";
import { ModelSelect } from "./ModelSelect";
import { Regenerate } from "./Regenerate";
import { SystemPrompt } from "./SystemPrompt";

interface Props {
  conversation: Conversation;
  models: OpenAIModel[];
  messageIsStreaming: boolean;
  modelError: boolean;
  messageError: boolean;
  loading: boolean;
  lightMode: "light" | "dark";
  onSend: (message: Message, isResend: boolean) => void;
  onUpdateConversation: (conversation: Conversation, data: KeyValuePair) => void;
  stopConversationRef: MutableRefObject<boolean>;
  imageUrl?: any;
}

export const Chat: FC<Props> = ({ conversation, models, messageIsStreaming, modelError, messageError, loading, lightMode, onSend, onUpdateConversation, stopConversationRef }) => {
  const [currentMessage, setCurrentMessage] = useState<Message>();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  const isJsonString = (str: string) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  const constructImageUrl = (relativeUrl: string) => {
    const host = "http://ec2-100-25-255-225.compute-1.amazonaws.com:8000";
    return `${host}/image/${relativeUrl}`;
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  return (
    <div className="relative flex-1 overflow-none bg-gradient-to-r bg-[#1C1E24]">
      {modelError ? (
        <div className="flex flex-col justify-center mx-auto h-full w-[300px] sm:w-[500px] space-y-6">
          <div className="text-center text-red-500">Error fetching models.</div>
          <div className="text-center text-red-500">Make sure your Athena API key is set in the bottom left of the sidebar or in a .env.local file and refresh.</div>
          <div className="text-center text-red-500">If you completed this step, OpenAI may be experiencing issues.</div>
        </div>
      ) : (
        <>
          <div className="overflow-scroll max-h-full">
            {conversation.messages.length === 0 ? (
              <>
                <div className="flex flex-col mx-auto pt-12 space-y-10 w-[350px] sm:w-[600px]">
                  <div className="text-4xl font-semibold text-center text-gray-300 dark:text-gray-300">{models.length === 0 ? "Loading..." : "The Domain"}</div>

                  {models.length > 0 && (
                    <div className="flex flex-col h-full space-y-4 border p-4 rounded border-neutral-200">
                      <ModelSelect
                        model={conversation.model}
                        models={models}
                        onModelChange={(model) => onUpdateConversation(conversation, { key: "model", value: model })}
                      />

                      <SystemPrompt
                        conversation={conversation}
                        onChangePrompt={(prompt) => onUpdateConversation(conversation, { key: "prompt", value: prompt })}
                      />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-center py-2 text-neutral-500 bg-[#1C1E24] dark:text-neutral-600 text-sm border border-b-neutral-300 dark:border-none">Model: {conversation.model.name}</div>
                {conversation.messages.map((message, index) => {
                  let imageUrl;
                  if (isJsonString(message.content)) {
                    const parsedMessage = JSON.parse(message.content);
                    if (Array.isArray(parsedMessage.content)) {
                      message.content = parsedMessage.content[0][1];
                    } else {
                      message.content = parsedMessage.content;
                    }
                    imageUrl = parsedMessage.imageUrl;
                  } else {
                    const imageRegex = /(?:Its file name is|png\.)\s*(image\/.+?\.png)/g;
                    const match = imageRegex.exec(message.content);
                    if (match && match[1]) {
                      imageUrl = constructImageUrl(match[1].trim());
                      message.content = message.content.replace(imageRegex, '').trim();
                    }
                  }
                  return (
                    <ChatMessage
                      key={index}
                      message={message}
                      lightMode={"dark"}
                      imageUrl={imageUrl}
                    />
                  );
                })}
                {loading && <ChatLoader />}

                <div
                  className="h-[162px]"
                  ref={messagesEndRef}
                />
              </>
            )}
          </div>

          {messageError ? (
            <Regenerate
              onRegenerate={() => {
                if (currentMessage) {
                  onSend(currentMessage, true);
                }
              }}
            />
          ) : (
            <ChatInput
              stopConversationRef={stopConversationRef}
              messageIsStreaming={messageIsStreaming}
              onSend={(message) => {
                setCurrentMessage(message);
                onSend(message, false);
              }}
              model={conversation.model}
            />
          )}
        </>
      )}
    </div>
  );
};
