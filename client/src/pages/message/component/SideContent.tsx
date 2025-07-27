
import { toast } from 'react-toastify';
import { User } from '../../../types/user';
import { NormalAvatar, ProfileAvatar } from '../../../components/Navbar';
import { MessageSquareMore } from 'lucide-react';
import { useEffect } from 'react';
import Loading from '../../../components/Loading';
import { useGetChattedUsersWithLastMessageQuery } from '../../../state/api/generic';
import { useAppDispatch, useAppSelector } from '../../../state/hook';
import { setSelectedUser } from '../../../state/slices/chatSlice';

const SideContent = () => {
  const user = useAppSelector(state=>state.auth.user);
  const { data:chatsWithUsers, isError:isChatsWithUserError, isLoading:isChatsWithUserLoading } = useGetChattedUsersWithLastMessageQuery({userId:user?.id!});

  console.log("chatsWithCandidate",chatsWithUsers)

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

const Candidates = ({ chatsWithUsers }: { chatsWithUsers: User[] | [] }) => {
  const dispatch = useAppDispatch();

  return (chatsWithUsers.length > 0 ? (
    <ul className="divide-y">
      {chatsWithUsers.map((user) => (
        <li
          key={user.id}
          className="flex items-center p-1 bg-light-background hover:bg-gray-100 dark:hover:bg-gray-600 mb-1.5 text-xl dark:text-white dark:bg-gray-700 rounded cursor-pointer transition" onClick={()=>dispatch(setSelectedUser(user))}
        >
          {user.profileUrl ? <ProfileAvatar isnavbar={false} className='w-10 h-10' imgUrl={user.profileUrl} /> : <NormalAvatar className='w-10 h-10' isnavbar={false}/>}
          <span className="ml-3">{user.username}</span>
        </li>
      ))}
    </ul>
  ) : (
    <div className="flex justify-center items-center h-60 text-2xl text-gray-500 dark:text-gray-300">
      No Don't have any chats
    </div>
  ))
};