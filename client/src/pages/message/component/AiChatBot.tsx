import { RefObject, useEffect, useRef, useState } from 'react'
import { ChatInput } from './ChatArea'
import { useGeminiAiResponseMutation } from '../../../state/api/generic';
import { useAppSelector } from '../../../state/hook';

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


  async function onSend(contents:string){

    if(isLoading) return;
    setIsLoadingAi(true)
    const userMsg: AiMessageProps = {
        sender: "user",
        senderId: user?.id as string,
        contents: contents,
    }
    setMessage(prev => [...prev, userMsg]);
    await getGeminiResponse({contents });
    setIsLoadingAi(false)
  }

  console.log("ai response",aiMessageResponse)

  useEffect(() => {
    if (aiMessageResponse) {
      const aiMsg: AiMessageProps = {
        sender: "ai",
        senderId: "gemini-1234",
        // @ts-ignore
        answer: aiMessageResponse.answer || ""
      };
      
      setMessage(prev => [...prev, aiMsg]);
    }

    if (error) {
        console.error("AI Response Error:", error);
        const errorMsg: AiMessageProps = {
            sender: "ai",
            senderId: "gemini-ai-id",
            answer: "Error: Could not get a response from the AI service.",
            contents: "Error: Could not get a response from the AI service.",
        };
        setMessage(prev => [...prev, errorMsg]);
    }
  }, [aiMessageResponse, error]);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }, [aiMessageResponse]);
  
  return (
      <div className="flex flex-col h-full w-full border rounded-lg overflow-hidden bg-white dark:bg-gray-800">
          <div className="flex-grow overflow-y-auto">
            <ChatAiMessages messages={message} isLoadingAi={isLoadingAi} scrollRef={scrollRef} />
          </div>
          <div className="p-2 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <ChatInput onSend={onSend} isAiChat={true} />
          </div>
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
     {messages.length === 0 && (
    <div className="flex flex-col items-center justify-center h-full w-full text-center p-8">
        
        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-4">
            Hello! I'm IntelliHire.
        </h2>
        
        <div className="text-lg text-gray-600 dark:text-gray-400 max-w-sm mb-6">
            How can I help you with your interview preparation. Ask anything you want
        </div>
        
    </div>
)}
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
