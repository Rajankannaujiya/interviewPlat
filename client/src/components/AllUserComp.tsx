import { useNavigate } from "react-router-dom";
import { useGetAllUsersQuery, useCreateChatMutation } from "../state/api/generic";
import Card from "./Card";
import Loading from "./Loading";
import { NormalAvatar, ProfileAvatar } from "./Navbar";
import { useAppSelector } from "../state/hook";
import { ExistingChat, User } from "../types/user";


const AllUserComp = () => {
  const user = useAppSelector(state => state.auth.user); // ✅ assumes state.auth.user holds { id, email, ... }
  const { data: users, isError, isLoading } = useGetAllUsersQuery();
  const [createChat, { isLoading: isCreating }] = useCreateChatMutation();
  const navigate = useNavigate();

  const handleCreateMessage = async (senderId: string, receiverId: string) => {
    try {
      const response:ExistingChat = await createChat({ senderId, receiverId }).unwrap();
      const data =  response;
      navigate(`/chat/${data?.id}`);
    } catch (error) {
      console.error("Failed to create or find chat:", error);
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <p className="text-center mt-10 text-red-500">Error fetching users</p>;

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {users?.map((userItem: User) => (
        userItem.id !== user?.id &&
        <Card
          key={userItem.id}
          className="dark:text-white bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex flex-col justify-center items-center gap-4">
            {userItem.profileUrl ? (
              <ProfileAvatar
                imgUrl={userItem.profileUrl}
                isnavbar={false}
                className="w-24 h-24 rounded-full ring-2 ring-blue-500"
              />
            ) : (
              <NormalAvatar
                isnavbar={false}
                className="w-24 h-24 rounded-full ring-2 ring-blue-300"
              />
            )}

            <div className="text-center">
              <h2 className="text-xl font-semibold">{userItem.username}</h2>
              <p className="text-sm dark:text-bahia-400 mt-1 text-bahia-800">Role: {userItem.role}</p>
            </div>

            <div className="flex flex-col justify-center gap-3 mt-3 w-full">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-md cursor-pointer"
                onClick={() => navigate(`/user/profile/${userItem.id}`)}
              >
                View Profile
              </button>

              {userItem.id !== user?.id && (
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-md cursor-pointer"
                  disabled={isCreating}
                  onClick={() => handleCreateMessage(user?.id!, userItem.id)}
                >
                  {isCreating ? "processing..." : "Message"}
                </button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AllUserComp;
