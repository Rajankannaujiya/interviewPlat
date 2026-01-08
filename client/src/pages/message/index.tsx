import ChatArea from "./component/ChatArea";
import SideContent from "./component/SideContent";
const Message = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 min-h-screen bg-light-background dark:bg-dark-background text-gray-800 dark:text-gray-100">

      <aside className="sm:col-span-4 lg:col-span-3 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-md p-4">
        <SideContent />
      </aside>

      <main className="hidden sm:block sm:col-span-9 bg-white dark:bg-gray-800 shadow-md p-4 lg:border-r lg:border-gray-300 dark:lg:border-gray-700">
        <ChatArea />
      </main>
    </div>
  );
};

export default Message;
