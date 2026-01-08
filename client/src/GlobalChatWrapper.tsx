import React from 'react';
import { MessageSquare } from 'lucide-react'; 
import { useAppDispatch, useAppSelector } from './state/hook';
import { toggleOpenChatBot } from './state/slices/genericSlice';
import AiChatBot from './pages/message/component/AiChatBot';

const GlobalChatWrapper: React.FC = () => {
  const isOpen = useAppSelector(state => state.generic.isChatBotOpen);
  const dispatch = useAppDispatch();

  const chatContainerClasses = `
    fixed bottom-4 right-4 z-[1000] transition-all duration-300 shadow-2xl m-8
    ${isOpen 
      ? 'w-[400px] h-[600px] rounded-lg' 
      : 'w-14 h-14' 
    }
  `;
  
  return (
    <div className={chatContainerClasses}>
 
      {isOpen && (
        <div className="h-full w-full">
          <AiChatBot /> 
        </div>
      )}

      <button
        onClick={() => dispatch(toggleOpenChatBot())}
        className={`
          absolute text-white rounded-full transition-all duration-300 shadow-xl
          
          ${isOpen 
            ? 'bottom-[604px] right-2 p-4 bg-red-600 hover:bg-red-700'
            : 'bottom-0 right-0 m-0 pr-5 p-4 bg-bahia-600 hover:bg-bahia-700 w-14 h-14'
          }
        `}
        aria-label={isOpen ? "Close Chat" : "Open Chat"}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        ) : (
          <MessageSquare className='w-6 h-6' /> 
        )}
      </button>
    </div>
  );
};

export default GlobalChatWrapper;