import { RefObject, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../state/hook';
import AllUserComp from '../../../components/AllUserComp';
import { useFindChatByChatIdQuery } from '../../../state/api/generic';
import { Message, User } from '../../../types/user';
import { newMessageType } from '../../../types/message';
import { WsInstance } from '../../../ws/websocket';

const ChatArea = () => {

  const [messages, setMessages] = useState<Message[]>([]);


  const user = useAppSelector(state => state.auth.user);
  const { chatId } = useParams();
  const selectedUser = useAppSelector(state => state.chat.selectedUser);
  const { data: initialMessages, isLoading } = useFindChatByChatIdQuery({ chatId:chatId! });


  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  if (initialMessages) {
    setMessages(initialMessages);
  }
}, [initialMessages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);


 useEffect(() => {
  WsInstance.connectWs("ws://localhost:3000", user?.id!); // example

  const registerHandler = () => {
    WsInstance.onMessage((message) => {
      console.log(message && message.type)
      switch (message.type) {
        case "new_message":
          console.log("inside newMassage")
          handleNewMessage(message);
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



function handleNewMessage(message:newMessageType){
  console.log("inside handleNewMessage")
  setMessages((prev) => [...prev, message.payload]);
}

  function onSend(content:string) {
    const data = {
      type: "chat_message",
      payload:{
        chatId,
        content,
        senderId: user?.id as string,
        receiverId: selectedUser?.id as string
      }
    }

    WsInstance.send(data)
  }

  if (!chatId) {
    return <AllUserComp />;
  }

  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center">Loading messages...</div>;
  }


  return (
    <div className='flex flex-col h-[90vh] w-full border rounded-lg overflow-hidden'>
      {messages && messages.length === 0 ? <div className=" flex  justify-center h-full p-4 text-center -gray-400">No messages yet. Say hello 👋</div> : <ChatMessages messages={messages || []} scrollRef={scrollRef} user={user}/>}      
      <ChatInput onSend={onSend} isAiChat={false} />
    </div>
  );
};

export default ChatArea; 



type ChatMessageProps = {
  messages: Message[] ;
  scrollRef: RefObject<HTMLDivElement | null>;
  user:User | null
};

export const ChatMessages = ({ messages, scrollRef, user }: ChatMessageProps) => {
  return (
  <div
    ref={scrollRef}
    className="flex flex-col flex-grow px-4 py-6 space-y-4 rounded overflow-y-auto bg-gray-100 dark:bg-gray-900 scrollbar-hide"
  >
    {messages.map((msg) => {
      const isSentByCurrentUser = msg?.senderId === user?.id;
      const time = msg?.createdAt && new Date(msg?.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      return (
        <div
          key={msg?.id || Math.random()*10000}
          className={`flex ${isSentByCurrentUser ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`relative max-w-[75%] px-4 py-2 rounded-xl shadow-md text-sm sm:text-base leading-relaxed
              ${isSentByCurrentUser
                ? 'bg-bahia-600 text-white rounded-br-none'
                : 'bg-white text-gray-900 dark:bg-gray-700 dark:text-white rounded-bl-none'}
            `}
          >
            {msg?.content}

            {/* Timestamp */}
            <span
              className={`absolute bottom-0 right-2 text-[10px] text-gray-300 dark:text-gray-400 mt-1`}
            >
              {time}
            </span>
          </div>
        </div>
      );
    })}
  </div>
);

};



type ChatInputProps = {
  onSend: (text: string) => void;
  isAiChat:boolean;
};

export const ChatInput = ({ onSend, isAiChat }: ChatInputProps) => {
  const [input, setInput] = useState('');

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const trimmedInput = input.trim();
  if (trimmedInput) {
    onSend(trimmedInput);
    setInput('');
  }
};




  return (
    <form
  onSubmit={handleSubmit}
  className={`flex ${isAiChat ? "flex-col gap-2 xl:flex-row xl:gap-0" : ""} items-center p-3 bg-white dark:bg-gray-900 border-t space-x-2`}>
  <input
    type="text"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder="Type a message..."
    className="flex-grow min-w-0 px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700 dark:text-white"
  />
  <button
    type="submit"
    className={`w-[80px] sm:w-[100px] py-2 ${
      isAiChat ? 'bg-blue-700' : 'bg-bahia-600'
    } text-white text-sm sm:text-base rounded-full hover:bg-bahia-900 focus:outline-none`}
  >
    {isAiChat ? 'Ask' : 'Send'}
  </button>
</form>

  );
};


