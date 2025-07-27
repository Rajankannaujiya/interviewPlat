import React from 'react'

type Props = {
    type?:string;
    placeHolder: string
    setInputValue: React.Dispatch<React.SetStateAction<string>>
}

const Input = ({type, placeHolder, setInputValue}: Props) => {

  return (
    <input
        type={type ? type : "text"}
        placeholder={placeHolder}
        className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 bg-light-background text-black focus:ring-blue-400 placeholder:text-gray-500"
        onChange={(e) => setInputValue(e.target.value)}
    />
  )
}

export default Input