type PopupProps = {

  children: React.ReactNode;
};

const Popup = ({ children }: PopupProps) => {

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-end p-4 pt-20 pointer-events-none">
      <div
        className="fixed z-50 right-4 top-12 transition-all duration-300 ease-in-out scrollbar-hide bg-light-background dark:bg-gray-900 text-gray-800 dark:text-white p-4 space-y-2 shadow-lg rounded-md md:rounded-xl w-[90vw] sm:w-[22rem] md:w-[26rem] lg:w-[28rem] xl:w-[32rem] max-w-[calc(100vw-2rem)] h-auto max-h-[80vh] overflow-y-auto border border-gray-200 dark:border-gray-700 pointer-events-auto"
      >
        {children}
      </div>
    </div>
  );
};

export default Popup;