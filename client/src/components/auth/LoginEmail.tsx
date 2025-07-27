import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Label from '../Label';
import Input from '../Input';
import {Button} from '../CustomComp';
import { CustomDivForAuth } from '../CustomComp';
import { useAppDispatch } from '../../state/hook';
import { useLoginUserWithEmailMutation } from '../../state/api/auth';
import { setEmail, setIsOtpSent } from '../../state/slices/auth/verifyOtpSlice';
import { Role } from '../../types/user';
import { toast } from 'react-toastify';

type EmailProps = {
    setVerifyMode: React.Dispatch<React.SetStateAction<string>>
}

const LoginEmail = ({ setVerifyMode }: EmailProps) => {

      const [emailInfo, setEmailInfo] = useState("");
      const navigate = useNavigate();
    
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    
    const matchemail = emailInfo.match(emailRegex)
    
const [loginWithEmail, { isLoading }] = useLoginUserWithEmailMutation();
      
        const dispatch = useAppDispatch();
    
      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
          await loginWithEmail({
            email:emailInfo,
          }).unwrap();
          
          dispatch(setIsOtpSent(true));
          dispatch(setEmail(emailInfo))
          toast.success("🤹 Otp sent Successfully")
          return
        } catch (err: any) {
          toast.error("☠️! Unable to Login Please try again");
          return
        }
    }
      

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Label label='Email' />
            <Input placeHolder='Enter Your Email' setInputValue={setEmailInfo} type='email'/>
            { !matchemail && <div className='flex text-red-500 text-md'>Please check ur email</div>}

            <Button type='submit' isLoading={isLoading} buttonText='Send Otp'/>
            
            <div className='md:hidden flex justify-center gap-2 font-serif text-lg'>
                <CustomDivForAuth onClick={()=>setVerifyMode("mobile")} buttonContent='Verify here' paraContent='Want to verify yourself with mobile number?'/>
            </div>

            <div className='flex justify-center items-center gap-2 font-serif text-lg'>
                <CustomDivForAuth onClick={()=>navigate("/signup")} buttonContent='SingUp' paraContent={"Don't have an account?"}/>
                  </div>
        </form>
    )
}

export default LoginEmail