

import { useState, useRef, useEffect, useMemo } from 'react'
import Head from 'next/head'
import styles from '../styles/home.module.css';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { CircularProgress } from '@mui/material';
import { fetchEventSource } from '@microsoft/fetch-event-source';

type Message = {
  type: "apiMessage" | "userMessage";
  message: string;
  isStreaming?: boolean;
}

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageState, setMessageState] = useState<{ messages: Message[], pending?: string, history: [string, string][] }>({
    messages: [{
      "message": "Hi there! How can I help?",
      "type": "apiMessage"
    }],
    history: []
  });
  const { messages, pending, history } = messageState;

  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    const messageList = messageListRef.current;
    if (messageList) {
      messageList.scrollTop = messageList.scrollHeight;
    }
  }, [messages]);

  // Focus on text field on load
  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const question = userInput.trim();
    if (question === "") {
      return;
    }

    setMessageState(state => ({
      ...state,
      messages: [...state.messages, {
        type: "userMessage",
        message: question
      }],
      pending: undefined
    }));

    setLoading(true);
    setUserInput("");
    setMessageState(state => ({ ...state, pending: "" }));

    const ctrl = new AbortController();

    fetchEventSource('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        history
      }),
      signal: ctrl.signal,
      onmessage: (event) => {
        if (event.data === "[DONE]") {
          setMessageState(state => ({
            history: [...state.history, [question, state.pending ?? ""]],
            messages: [...state.messages, {
              type: "apiMessage",
              message: state.pending ?? "",
            }],
            pending: undefined
          }));
          setLoading(false);
          ctrl.abort();
        } else {
          const data = JSON.parse(event.data);
          setMessageState(state => ({
            ...state,
            pending: (state.pending ?? "") + data.data,
          }));
        }
      }
    });
  }

  // Prevent blank submissions and allow for multiline input
  const handleEnter = (e: any) => {
    if (e.key === "Enter" && userInput) {
      if(!e.shiftKey && userInput) {
        handleSubmit(e);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const chatMessages = useMemo(() => {
    return [...messages, ...(pending ? [{ type: "apiMessage", message: pending }] : [])];
  }, [messages, pending]);

  return (
    <>
      <Head>
        <title>LangChain Chat</title>
        <meta name="description" content="LangChain documentation chatbot" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.cloud}>
          <div ref={messageListRef} className={styles.messagelist}>
            {chatMessages.map((message, index) => {
              let icon;
              let className;

              if (message.type === "apiMessage") {
                icon = <Image src="/parroticon.png" alt="AI" width="30" height="30" className={styles.boticon} priority />;
                className = styles.apimessage;
              } else {
                icon = <Image src="/usericon.png" alt="Me" width="30" height="30" className={styles.usericon} priority />

                // The latest message sent by the user will be animated while waiting for a response
                className = loading && index === chatMessages.length - 1
                  ? styles.usermessagewaiting
                  : styles.usermessage;
              }
              return (
                  <div key={index} className={className}>
                    {icon}
                    <div className = {styles.markdownanswer}>
                      <ReactMarkdown linkTarget="_blank">{message.message}</ReactMarkdown>
                    </div>
                  </div>
              )
            })}
          </div>
        </div>
        <div className={styles.center}>
          <div className={styles.cloudform}>
            <form onSubmit={handleSubmit}>
              <textarea 
                disabled={loading}
                onKeyDown={handleEnter}
                ref={textAreaRef}
                autoFocus={false}
                rows={1}
                maxLength={512}
                id="userInput" 
                name="userInput" 
                placeholder={loading? "Waiting for response..." : "Type your question..."}  
                value={userInput} 
                onChange={e => setUserInput(e.target.value)} 
                className={styles.textarea}
              />
              <button 
                type="submit" 
                disabled = {loading}
                className = {styles.generatebutton}
              >
                {loading ? (
                  <div className={styles.loadingwheel}>
                    <CircularProgress color="inherit" size={20}/>
                  </div>
                ) : (
                  // Send icon SVG in input field
                  <svg viewBox='0 0 20 20' className={styles.svgicon} xmlns='http://www.w3.org/2000/svg'>
                    <path d='M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z'></path>
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  )
}







// return (
//     <>
//       <Head>
//         <title>LangChain Chat</title>
//         <meta name="description" content="LangChain documentation chatbot" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//       <div className="bg-gray-900 border-b border-gray-700 flex items-center justify-between p-4">
//         <div className="font-semibold ml-4">
//           <Link href="/">LangChain</Link>
//         </div>
//         <div className="w-80 flex items-center justify-evenly">
//           <a
//             href="https://langchain.readthedocs.io/en/latest/"
//             target="_blank"
//             rel="noreferrer"
//           >
//             Docs
//           </a>
//           <a
//             href="https://github.com/zahidkhawaja/langchain-chat-nextjs"
//             target="_blank"
//             rel="noreferrer"
//           >
//             GitHub
//           </a>
//         </div>
//       </div>
//       <main className="flex flex-col items-center justify-between p-8">
//         <div className="w-3/4 h-5/6 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center">
//           <div ref={messageListRef} className="w-full h-full overflow-y-scroll rounded-lg">
//             {chatMessages.map((message, index) => {
//               let icon;
//               let className;
  
//               if (message.type === "apiMessage") {
//                 icon = <Image src="/parroticon.png" alt="AI" width="30" height="30" className="mr-4 rounded-sm" priority />;
//                 className = "bg-gray-900 p-6 text-white flex";
//               } else {
//                 icon = <Image src="/usericon.png" alt="Me" width="30" height="30" className="mr-4 rounded-sm" priority />
  
//                 // The latest message sent by the user will be animated while waiting for a response
//                 className = loading && index === chatMessages.length - 1
//                   ? "p-6 text-white bg-gradient-to-l from-gray-800 via-gray-900 to-gray-800 bg-200% animate-loading-gradient flex"
//                   : "bg-gray-800 p-6 text-white flex";
//               }
//               return (
//                   <div key={index} className={className}>
//                     {icon}
//                     <div className="line-height[1.75]">
//                       <ReactMarkdown linkTarget="_blank">{message.message}</ReactMarkdown>
//                     </div>
//                   </div>
//               )
//             })}
//           </div>
//         </div>
//         <div className="flex items-center justify-center relative p-8 flex-col">
//           <div className="relative">
//             <form onSubmit={handleSubmit}>
//               <textarea 
//                 disabled={loading}
//                 onKeyDown={handleEnter}
//                 ref={textAreaRef}
//                 autoFocus={false}
//                 rows={1}
//                 maxLength={512}
//                 id="userInput" 
//                 name="userInput" 
//                 placeholder={loading? "Waiting for response..." : "Type your question..."}  
//                 value={userInput} 
//                 onChange={e => setUserInput(e.target.value)} 
//                 className="relative resize-none text-lg p-4 w-3/4 rounded-lg border border-gray-700 bg-gray-900 text









///v2 

// return (
//     <>
//       <Head>
//         <title>LangChain Chat</title>
//         <meta name="description" content="LangChain documentation chatbot" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//       <div className="bg-gray-900 border-b border-gray-700 flex justify-between items-center p-4">
//         <div className="font-medium text-xl ml-4">
//           <Link href="/">LangChain</Link>
//         </div>
//         <div className="w-80 flex justify-evenly items-center">
//           <a
//             href="https://langchain.readthedocs.io/en/latest/"
//             target="_blank"
//             rel="noreferrer"
//             className="font-medium"
//           >
//             Docs
//           </a>
//           <a
//             href="https://github.com/zahidkhawaja/langchain-chat-nextjs"
//             target="_blank"
//             rel="noreferrer"
//             className="font-medium"
//           >
//             GitHub
//           </a>
//         </div>
//       </div>
//       <main className="flex flex-col items-center justify-between p-8">
//         <div className="w-3/4 h-5/6 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center">
//           <div ref={messageListRef} className="w-full h-full overflow-y-scroll rounded-lg">
//             {chatMessages.map((message, index) => {
//               let icon;
//               let className;

//               if (message.type === 'apiMessage') {
//                 icon = (
//                   <Image
//                     src="/parroticon.png"
//                     alt="AI"
//                     width="30"
//                     height="30"
//                     className="mr-4 rounded-sm"
//                     priority
//                   />
//                 );
//                 className = 'bg-gray-900 p-6 text-gray-300 flex animate-fade-in';
//               } else {
//                 icon = (
//                   <Image
//                     src="/usericon.png"
//                     alt="Me"
//                     width="30"
//                     height="30"
//                     className="mr-4 rounded-sm"
//                     priority
//                   />
//                 );

//                 className = loading && index === chatMessages.length - 1
//                   ? 'bg-gradient-to-l from-gray-800 via-gray-900 to-gray-800 p-6 text-gray-300 flex animate-pulse'
//                   : 'bg-gray-800 p-6 text-gray-300 flex';
//               }
//               return (
//                 <div key={index} className={className}>
//                   {icon}
//                   <div className="line-height[1.75]">
//                     <ReactMarkdown linkTarget="_blank">{message.message}</ReactMarkdown>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//         <div className="flex justify-center items-center relative py-8 flex-col">
//           <div>
//             <form onSubmit={handleSubmit}>
//               <textarea
//                 disabled={loading}
//                 onKeyDown={handleEnter}
//                 ref={textAreaRef