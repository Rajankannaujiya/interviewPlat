import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Label from '../Label'
import Input from '../Input'
import {Button} from '../CustomComp'
import { CustomDivForAuth } from '../CustomComp'
import { useAppDispatch } from '../../state/hook'
import { useLoginUserWithMobileMutation } from '../../state/api/auth'
import { setIsOtpSent, setMobileNumber } from '../../state/slices/auth/verifyOtpSlice'
import { toast } from 'react-toastify'

type MobileProps = {
    setVerifyMode: React.Dispatch<React.SetStateAction<string>>
}

const LoginMobile = ({setVerifyMode}: MobileProps) => {

    const [mobileNum, setMobileNum] = useState("");
      
        const dispatch = useAppDispatch();
        const navigate = useNavigate();

        const [loginWithMobile, {data, isError, isLoading}] = useLoginUserWithMobileMutation();
        
          console.log(data, isError, isLoading);
        
          const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            try {
              await loginWithMobile({
                mobileNumber:mobileNum,
              }).unwrap();
              
              dispatch(setIsOtpSent(true));
              dispatch(setMobileNumber(mobileNum))
              toast.success("🤹 Otp sent Successfully")
              return
            } catch (err: any) {
              toast.error("☠️! Unable to Login Please try again");
              return
            }
        }
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Label label='Mobile' />
            <Input placeHolder='Enter your mobile number' setInputValue={setMobileNum} />
            {(!mobileNum) && <div className='flex text-red-500 text-md'>Please enter with calling code</div>}

            <Button isLoading={isLoading} type='submit' buttonText='Send Otp'/>

            <div className='md:hidden flex justify-center gap-2 font-serif text-lg'>
                    <CustomDivForAuth onClick={()=>setVerifyMode("email")} buttonContent='Verify here' paraContent='Want to verify yourself with Email?'/>
            </div>

            <div className='flex justify-center items-center gap-2 font-serif text-lg'>
                <CustomDivForAuth onClick={()=>navigate("/signup")} buttonContent='SingUp' paraContent={"Don't have an account?"}/>
            </div>
        </form>
    )
}

export default LoginMobile