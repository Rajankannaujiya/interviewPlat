import React, { RefObject, useRef, useState } from 'react'
import { ChatInput } from './ChatArea'

type Props = {
  messages: Message[];
};

type Message = {
  id: string;
  text: string;
  user: 'sender' | 'receiver';
};

const AiChatBot = ({messages}: Props) => {
  const[input, setInput] = useState("")

  function handleSubmit(){

  }

  function onSend(){
    console.log("sent from ai bot")
  }
    const scrollRef = useRef<HTMLDivElement>(null);
  
  return (
      <div className="flex flex-col h-[90vh] w-full border rounded-lg overflow-hidden">
          <ChatAiMessages messages={messages} scrollRef={scrollRef} />
          <ChatInput onSend={onSend} isAiChat={true}/>
        </div>
  )
}

export default AiChatBot


type ChatMessageProps = {
  messages: Message[];
  scrollRef: RefObject<HTMLDivElement | null>;
};

const ChatAiMessages = ({ messages, scrollRef }: ChatMessageProps) => {
  return (
    <div
      ref={scrollRef}
      className="flex flex-col flex-grow p-4 space-y-3 overflow-y-auto bg-gray-50 dark:bg-gray-800 scrollbar-hide"
    >
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.user === 'sender' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[70%] px-4 py-2 rounded-2xl shadow text-sm ${
              msg.user === 'sender'
                ? 'bg-blue-600 dark:bg-blue-700 text-white rounded-br-none'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded-bl-none'
            }`} 
          >
            {msg.text}
          </div>
        </div>
      ))}
    </div>
  );
};