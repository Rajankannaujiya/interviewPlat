import { twMerge } from "tailwind-merge";


const Card = ({ children , className}: {children:React.ReactNode, className?:string}) => {
  const mergeClassName = twMerge(
    "w-[100%] mx-auto bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-600 rounded-md shadow-md p-6 transition hover:shadow-md hover:scale-3d duration-300 ease-in-out",
    className
  )
  return (
    <div className={mergeClassName}>
      {children}
    </div>
  );
};

export default Card;
