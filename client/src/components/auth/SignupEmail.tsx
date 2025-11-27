import React, { useState } from 'react'
import { CustomDivForAuth } from '../CustomComp'
import { useLocation, useNavigate } from 'react-router-dom'
import Label from '../Label'
import Input from '../Input'
import { Button } from '../CustomComp'
import { Role } from '../../types/user'
import { useCreateUserWithEmailMutation } from '../../state/api/auth'
import { useAppDispatch } from '../../state/hook'
import { toast } from 'react-toastify';
import { setEmail, setIsOtpSent } from '../../state/slices/auth/verifyOtpSlice'

type SignupEmailProps = {
  setVerifyMode: React.Dispatch<React.SetStateAction<string>>

}

const SignupEmail = ({ setVerifyMode }: SignupEmailProps) => {

  const [emailInfo, setEmailInfo] = useState("");
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState<Role>("CANDIDATE");
  const navigate = useNavigate();

const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

const matchemail = emailInfo.match(emailRegex);


  const [createUserWithEmail, { data, isError, isLoading}] = useCreateUserWithEmailMutation();
  
  const dispatch = useAppDispatch();



  const location = useLocation();
  const pathname = location.pathname;


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createUserWithEmail({
        email:emailInfo,
        username: userName,
        role
      }).unwrap();
      
      dispatch(setIsOtpSent(true));
      dispatch(setEmail(emailInfo))
      toast.success("🤹! Otp Sent Successfully")
    } catch (err: any) {

      if (err?.status === 409) {
      toast.error("⚠️ A user with this email already exists");
    }
    else{
      toast.error("☠️! Unable to creare user");
    }
    }
  }



  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Label label='Email' />
      <Input placeHolder='Enter your Email' setInputValue={setEmailInfo} type='email' />
      { !matchemail && <div className='flex text-red-500 text-md'>Please check ur email</div>}

      <Label label='UserName' />
      <Input placeHolder='Enter your username' setInputValue={setUserName} />

      <Label label='Role' />
      <select
        name="role"
        value={role}
        onChange={(e) => setRole(e.target.value.toUpperCase() as Role)}
        className="w-full p-2 relative bg-white text-gray-800 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
      >
        <option value="CANDIDATE">Candidate</option>
        <option value="INTERVIEWER">Interviewer</option>
        <option value="ADMIN">Admin</option>
      </select>

      <Button isLoading={isLoading} type='submit' buttonText={isLoading ? "Processing..." : "Send Otp"} />


      <div className='md:hidden flex justify-center gap-2 font-serif text-lg'>
        <CustomDivForAuth onClick={() => setVerifyMode("mobile")} buttonContent='Verify here' paraContent='Want to verify yourself with mobile number?' />
      </div>

      <div className='flex justify-center items-center gap-2 font-serif text-lg'>
        <CustomDivForAuth onClick={() => {
          if(pathname.includes("interviewer")){
            navigate("/interviewer/login")
          }else{
            navigate("/login");
          }
        }} buttonContent='Login' paraContent={"Don't have an account?"} />
      </div>
    </form>
  )
}

export default SignupEmail