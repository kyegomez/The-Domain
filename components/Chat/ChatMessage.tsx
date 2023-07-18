/* eslint-disable @next/next/no-img-element */
import { ChatBody, Conversation, KeyValuePair, Message, OpenAIModel, OpenAIModelID, OpenAIModels } from "types/index";

import { FC } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "../Markdown/CodeBlock";

interface Props {
  message: Message;
  lightMode: "light" | "dark";
  imageUrl?: string;
}

export const ChatMessage: FC<Props> = ({ message, lightMode, imageUrl }) => {
  return (
    <div
      className={`group ${message.role === "assistant" ? "text-gray-800 dark:text-gray-900 border-black-200 dark:border-gray-400 bg-gradient-to-r  bg-[#F7F7F8]" : "text-gray-800 dark:text-gray-800 border-b border-black-100 dark:border-black-300 bg-[#FAFBFF]"}`}
      style={{ overflowWrap: "anywhere" }}
    >
      <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto">
        <div className="font-bold min-w-[40px]">{message.role === "assistant" ? "Athena:" : "You:"}</div>

        <div className="prose dark:prose-invert mt-[-2px] text-gray-800">
          {message.role === "user" ? (
            <div className="text-gray-900 prose dark:prose-invert whitespace-pre-wrap">{message.content}</div>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <CodeBlock
                      key={Math.random()}
                      language={match[1]}
                      value={String(children).replace(/\n$/, "")}
                      lightMode={lightMode}
                      {...props}
                    />
                  ) : (
                    <code
                      className={className}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                table({ children }) {
                  return <table className="border-collapse border border-black dark:border-black-400 py-1 px-3">{children}</table>;
                },
                th({ children }) {
                  return <th className="border border-black dark:border-white break-words py-1 px-3 bg-gray-500 text-gray-800">{children}</th>;
                },
                td({ children }) {
                  return <td className="border border-black dark:border-white break-words py-1 px-3">{children}</td>;
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
          {message.image && <img src={message.image} alt="Uploaded image" className="mt-4" />}
        </div>
      </div>
    </div>
  );
};