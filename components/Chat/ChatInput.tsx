import { ChatBody, Conversation, KeyValuePair, Message, OpenAIModel, OpenAIModelID, OpenAIModels } from "types/index";
import { IconPlayerStop, IconSend } from "@tabler/icons-react";
import { FC, KeyboardEvent, MutableRefObject, useEffect, useRef, useState } from "react";
import { ImageIcon } from "@radix-ui/react-icons";
import { motion } from 'framer-motion';
import Image from "next/image";

interface Props {
  messageIsStreaming: boolean;
  onSend: (message: Message) => void;
  model: OpenAIModel;
  stopConversationRef: MutableRefObject<boolean>;
}

export const ChatInput: FC<Props> = ({ onSend, messageIsStreaming, model, stopConversationRef }) => {
  const [content, setContent] = useState<string>();
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const maxLength = model.id === OpenAIModelID.GPT_3_5 ? 12000 : 24000;

    if (value.length > maxLength) {
      alert(`Message limit is ${maxLength} characters`);
      return;
    }

    setContent(value);
  };

  const handleSend = () => {
    if (messageIsStreaming) {
      return;
    }

    if (!content && !image) {
      alert("Please enter a message or select an image");
      return;
    }

    const message: Message = {
      role: 'user',
      content: ""
    };

    if (content) {
      message.content = content;
      setContent("");
    }

    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        message.image = reader.result as string;
        setImage(null);
        setImagePreview(null);
      };
      reader.readAsDataURL(image);
    }

    onSend(message);

    if (window.innerWidth < 640 && textareaRef && textareaRef.current) {
      textareaRef.current.blur();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const RemoveImage = () => {
    setImage(null);
    setImagePreview(null);

  };


  const isMobile = () => {
    const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    return mobileRegex.test(userAgent);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isTyping) {
      if (e.key === "Enter" && !e.shiftKey && !isMobile()) {
        e.preventDefault();
        handleSend();
      }
    }
  };

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
      textareaRef.current.style.overflow = `${textareaRef?.current?.scrollHeight > 400 ? "auto" : "hidden"}`;
    }
  }, [content]);

  function handleStopConversation() {
    stopConversationRef.current = true;
    setTimeout(() => {
      stopConversationRef.current = false;
    }, 1000);
  }
  return (
    <div className="absolute bottom-0 left-0 w-full border-transparent dark:border-white/20 bg-gradient-to-rdark:bg-transparent dark:bg-vert-dark-gradient pt-6 md:pt-2">
      <div className="stretch mx-2 md:mt-[52px] mt-4 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-3xl">
        {messageIsStreaming && (
          <button
            className="absolute -top-2 md:top-0 left-0 right-0 mx-auto bg-gray-500 border w-fit border-gray-500 py-2 px-4 rounded text-white hover:bg-purple-600 hover:text-white"
            onClick={handleStopConversation}
          >
            <IconPlayerStop
              size={16}
              className="inline-block mb-[2px]"
            />{" "}
            Stop Generating
          </button>
        )}
        <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-gray-900 dark:border-gray-900/50 dark:text-white bg-gradient-to-r bg-[#141519] rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
          {imagePreview && (
            <div className="flex justify-between items-center mb-2">
              <Image src={imagePreview} alt="Preview" width={40} height={40} className="rounded" />
              <button onClick={RemoveImage} className="bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                x
              </button>
            </div>
          )}
          <textarea
            ref={textareaRef}
            className="text-black dark:text-white m-0 w-full resize-none outline-none border-0 bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-2 md:pl-0"
            style={{
              resize: "none",
              bottom: `${textareaRef?.current?.scrollHeight}px`,
              maxHeight: "400px",
              overflow: `${textareaRef.current && textareaRef.current.scrollHeight > 400 ? "auto" : "hidden"}`
            }}
            placeholder="Type a message..."
            value={content}
            rows={1}
            onCompositionStart={() => setIsTyping(true)}
            onCompositionEnd={() => setIsTyping(false)}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />

          <div className="absolute right-2 flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="focus:outline-none text-white bg-white hover:text-violet-900 dark:text-white dark:hover:text-cyan-700 dark:bg-violet-500 hover:bg-sky-600 p-1 rounded-sm"
            >
              <ImageIcon
                className="h-5 w-5 bg-"
              />
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer bg-white"
                onChange={handleImageChange}
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="focus:outline-none text-white hover:text-purple-600 dark:text-white dark:hover:text-violet-700 dark:bg-sky-400 hover:bg-violet-700 p-1 rounded-sm"
              onClick={handleSend}
            >
              <IconSend
                size={16}
                className=""
              />
            </motion.button>
          </div>
        </div>
      </div>
      <div className="px-3 pt-2 pb-3 text-center text-xs text-black/50 dark:text-grau/600 md:px-4 md:pt-3 md:pb-6">
        <span className="text-blue-600">Thanks for becoming an alpha build user, email kye@apac.ai with all complaints</span>
      </div>
    </div>
  );
};