import { RefObject, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../state/hook';
import AllUserComp from '../../../components/AllUserComp';

type Message = {
  id: string;
  text: string;
  user: 'sender' | 'receiver';
};

type Props = {
  messages: Message[];
};

const ChatArea = ({ messages }: Props) => {

  const {userId} = useParams();
  
  const selectedUser = useAppSelector(state => state.chat.selectedUser);

  // const {data, isError , isLoading} = useMessageQuery()
  const scrollRef = useRef<HTMLDivElement>(null);

  function onSend(){
    console.log("send from chatArea");
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-[90vh] w-full border rounded-lg overflow-hidden">
      {selectedUser? (<><ChatMessages messages={messages} scrollRef={scrollRef} />
      <ChatInput onSend={onSend} isAiChat={false}/></>) : <AllUserComp /> }
    </div>
  );
};

export default ChatArea; 



type ChatMessageProps = {
  messages: Message[];
  scrollRef: RefObject<HTMLDivElement | null>;
};

const ChatMessages = ({ messages, scrollRef }: ChatMessageProps) => {
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
                ? 'bg-bahia-600 dark:bg-bahia-700 text-white rounded-br-none'
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


type ChatInputProps = {
  onSend: (text: string) => void;
  isAiChat:boolean;
};

export const ChatInput = ({ onSend, isAiChat }: ChatInputProps) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input.trim());
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
      isAiChat ? 'bg-blue-700' : 'bg-bahia-700'
    } text-white text-sm sm:text-base rounded-full hover:bg-bahia-900 focus:outline-none`}
  >
    {isAiChat ? 'Ask' : 'Send'}
  </button>
</form>

  );
};


