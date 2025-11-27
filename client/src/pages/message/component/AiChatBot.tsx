import { RefObject, useEffect, useRef, useState } from 'react'
import { ChatInput } from './ChatArea'
import { Message } from '../../../types/user';
import { useGeminiAiResponseMutation } from '../../../state/api/generic';
import { useAppSelector } from '../../../state/hook';
import { WsInstance } from '../../../ws/websocket';
import { aiResponseType } from '../../../types/message';
import Loading from '../../../components/Loading';


type AiMessageProps={
  sender: "ai" | "user";
  senderId: string;
  answer?: string;
  contents?:string;

}

const AiChatBot = () => {
  const [message, setMessage] = useState<AiMessageProps []>([]);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [getGeminiResponse, { data: aiMessageResponse, error, isLoading }] = useGeminiAiResponseMutation();
  const user = useAppSelector(state => state.auth.user);



 useEffect(() => {
  WsInstance.connectWs("ws://localhost:3000", user?.id!); // example

  const registerHandler = () => {
    WsInstance.onMessage((message) => {

      switch (message.type) {
        case "ai_msg":
          handleAiResponse(message);
          break;
          
        default:
          console.warn("⚠️ Unhandled message type:", message.type);
      }
    });
  };

  // Delay handler registration until connected
  const checkReady = setInterval(() => {
    if (WsInstance['socket']?.readyState === WebSocket.OPEN) {
      registerHandler();
      clearInterval(checkReady);
    }
  }, 100);

  return () => {
    clearInterval(checkReady);
    WsInstance.clearOnMessage(user?.id!);
  };
}, []);

function handleAiResponse(data:aiResponseType){
  setMessage(prev => [...prev,data.payload] );
  setIsLoadingAi(false);
}
  
  function onSend(contents:string){
    const data:aiResponseType = {
      type:"ai_msg",
      payload:{
        sender: "user",
        senderId: user?.id as string,
        contents
      }
    }

    setMessage(prev => [...prev, data.payload]);
    setIsLoadingAi(true);

    WsInstance.send(data)
    
    
  }
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }, [aiMessageResponse]);
  
  return (
      <div className="flex flex-col h-[90vh] w-full border rounded-lg overflow-hidden">
          {<ChatAiMessages messages={message} isLoadingAi={isLoadingAi} scrollRef={scrollRef} />}
          <ChatInput onSend={onSend} isAiChat={true}/>
        </div>
  )
}

export default AiChatBot


type ChatMessageProps = {
  messages: AiMessageProps[];
  isLoadingAi:Boolean;
  scrollRef: RefObject<HTMLDivElement | null>;
};

const ChatAiMessages = ({ messages, isLoadingAi, scrollRef }: ChatMessageProps) => {
  return (
    <div
      ref={scrollRef}
      className="flex flex-col flex-grow p-4 space-y-3 overflow-y-auto bg-gray-50 dark:bg-gray-800 scrollbar-hide"
    >
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[70%] px-4 py-2 rounded-2xl shadow text-sm ${
              msg.sender === 'user'
                ? 'bg-blue-600 dark:bg-blue-700 text-white rounded-br-none'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded-bl-none'
            }`} 
          >
            
            {msg.answer ?? msg.contents }
          </div>
        </div>
      ))}

       {isLoadingAi && (
        <div className="flex justify-start">
          <div className="px-4 py-2 rounded-2xl shadow text-sm bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded-bl-none animate-pulse">
            AI is typing...
          </div>
        </div>
      )}
    </div>
  );
};
