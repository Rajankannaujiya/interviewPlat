
import { toast } from 'react-toastify';
import { ExistingChat, User } from '../../../types/user';
import { NormalAvatar, ProfileAvatar } from '../../../components/Navbar';
import { MessageSquareMore } from 'lucide-react';
import { useEffect } from 'react';
import Loading from '../../../components/Loading';
import { useGetChattedUsersWithLastMessageQuery } from '../../../state/api/generic';
import { useAppDispatch, useAppSelector } from '../../../state/hook';
import { setSelectedUser } from '../../../state/slices/chatSlice';
import { useNavigate } from 'react-router-dom';

const SideContent = () => {
  const user = useAppSelector(state=>state.auth.user);
  const { data:chatsWithUsers, isError:isChatsWithUserError, isLoading:isChatsWithUserLoading } = useGetChattedUsersWithLastMessageQuery({userId:user?.id!});

  useEffect(()=>{
    if (isChatsWithUserError ) {
    toast.error("Error fetching users");
  }
  },[isChatsWithUserError])

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full flex flex-row items-center cursor-pointer font-bold p-3 mb-2 gap-3 bg-light-background dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded shadow">
        <MessageSquareMore className="dark:text-light-background" />
        Chat With AI
      </div>
     {isChatsWithUserLoading ? (
  <div className="flex justify-center items-center w-full h-full">
    <Loading />
  </div>
) : (
  <Candidates chatsWithUsers={chatsWithUsers || []} />
)}

    </div>
  )
}

export default SideContent

const Candidates = ({ chatsWithUsers }: { chatsWithUsers: any| [] }) => {
  const dispatch = useAppDispatch();
const navigate = useNavigate();
  return chatsWithUsers.length > 0 ? (
  <ul className="divide-y">
    {chatsWithUsers.map((chat: any) => (
      <li
        key={chat.user.id}
        className="flex items-center gap-3 p-3 bg-light-background hover:bg-gray-100 dark:hover:bg-gray-700 text-base dark:text-white dark:bg-gray-800 rounded-lg transition m-2 cursor-pointer"
        onClick={() => {
          dispatch(setSelectedUser(chat.user));
          navigate(`/chat/${chat?.chatId}`)
        }}
      >
        {chat.user.profileUrl ? (
          <ProfileAvatar
            isnavbar={false} 
            className="w-12 h-12"
            imgUrl={chat.user.profileUrl}
          />
        ) : (
          <NormalAvatar isnavbar={false} className="w-12 h-12" />
        )}

        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Username */}
          <span className="font-medium truncate">{chat.user.username}</span>

          {/* Last message */}
          <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <span className="truncate max-w-[180px]">
              {chat.message?.content || "Say hi 👋"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 whitespace-nowrap">
              {chat.message?.createdAt
                ? new Date(chat.message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </span>
          </div>
        </div>
      </li>
    ))}
  </ul>
) : (
  <div className="flex justify-center items-center h-60 text-xl text-gray-500 dark:text-gray-300">
    You don't have any chats yet.
  </div>
);

};