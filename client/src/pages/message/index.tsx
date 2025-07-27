import ChatArea from "./component/ChatArea";
import SideContent from "./component/SideContent";
import AiChatBot from "./component/AiChatBot";

type Props = {};

const Message = () => {

  type Message = {
  id: string;
  text: string;
  user: 'sender' | 'receiver';
};

  const messages:Message[] = [
  {
  id: "1",
  text: "rajan is a sde",
  user: "sender"
  },
  {
  id: "2",
  text: "rajan is a sde",
  user: "receiver"
},
{
  id: "3",
  text: "rajan is a sde with excellent development skill",
  user: "sender"
},
{
  id: "4",
  text: "rajan is a sde",
  user: "receiver"
},
 {
  id: "5",
  text: "rajan is a sde",
  user: "receiver"
},
{
  id: "6",
  text: "rajan is a sde with excellent development skill",
  user: "sender"
},
{
  id: "7",
  text: "rajan is a sde",
  user: "receiver"
},
 {
  id: "8",
  text: "rajan is a sde",
  user: "receiver"
},
{
  id: "9",
  text: "rajan is a sde with excellent development skill",
  user: "sender"
},
{
  id: "10",
  text: "rajan is a sde",
  user: "receiver"
},
 {
  id: "11",
  text: "rajan is a sde",
  user: "receiver"
},
{
  id: "12",
  text: "rajan is a sde with excellent development skill",
  user: "sender"
},
{
  id: "13",
  text: "rajan is a sde",
  user: "receiver"
},
 {
  id: "14",
  text: "rajan is a sde",
  user: "receiver"
},
{
  id: "15",
  text: "rajan is a sde with excellent development skill",
  user: "sender"
},
{
  id: "16",
  text: "rajan is a sde",
  user: "receiver"
}
]
  

  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 min-h-screen bg-light-background dark:bg-dark-background text-gray-800 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="sm:col-span-4 lg:col-span-3 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-md p-4">
        <SideContent />
      </aside>

      {/* Chat Area */}
      <main className="hidden sm:block sm:col-span-8 lg:col-span-6 bg-white dark:bg-gray-800 shadow-md p-4 lg:border-r lg:border-gray-300 dark:lg:border-gray-700">
        <ChatArea messages={messages}/>
      </main>


      {/* Ai Chat Bot */}
      <aside className="hidden lg:block lg:col-span-3 bg-white dark:bg-gray-900 shadow-md p-4">
        <AiChatBot messages={messages}/>
      </aside>
    </div>
  );
};

export default Message;
