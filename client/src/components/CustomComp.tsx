import React from 'react'
import { twMerge } from 'tailwind-merge';

type CustomCenterProps = {
  className?: string;
  children: React.ReactNode;
}

export const CustomCenter = ({ className, children }: CustomCenterProps) => {

  const mergedClasses = twMerge(
    'items-center w-screen min-h-screen w-full flex justify-center',
    className
  );

  return <div className={mergedClasses}>{children}</div>;
}


type CustomDivForAuthProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  paraContent: string;
  buttonContent: string;
};

export const CustomDivForAuth = ({
  onClick,
  paraContent,
  buttonContent,
}: CustomDivForAuthProps) => {
  return (
    <>
      <p className="text-blue-950 dark:text-blue-300 mx-0 my-1 p-1 font-light">
        {paraContent}
      </p>
      <button
        type="button"
        className="text-blue-500 dark:text-blue-400 mx-0 my-1 p-1 font-bold cursor-pointer hover:font-semibold"
        onClick={onClick}
      >
        {buttonContent}
      </button>
    </>
  );
};


type ButtonProps = {
  type:"submit" | "reset" | "button";
  onClick?: React.Dispatch<React.MouseEvent<HTMLElement>>
  buttonText:string;
  isLoading: boolean
}

export const Button = ({type, onClick, isLoading, buttonText}: ButtonProps) => {
  return (
    <button type= {type} className="p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200" 
    onClick={onClick}>
                {isLoading ? "Processing" : buttonText}
            </button>
  )
}
