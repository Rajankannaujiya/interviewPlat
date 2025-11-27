import React, { useState } from 'react'
import { Button, CustomDivForAuth } from '../CustomComp'
import Input from '../Input'
import Label from '../Label'
import { useLocation, useNavigate } from 'react-router-dom'
import { Role } from '../../types/user'
import { useCreateUserWithMobileMutation } from '../../state/api/auth'
import { useAppDispatch } from '../../state/hook'
import { setIsOtpSent, setMobileNumber } from '../../state/slices/auth/verifyOtpSlice'
import { toast } from 'react-toastify'

type SingupMobileProps = {
  setVerifyMode: React.Dispatch<React.SetStateAction<string>>

}

const SignupMobile = ({ setVerifyMode }: SingupMobileProps) => {

  const [mobileNum, setMobileNum] = useState("");
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState<Role>("CANDIDATE");
  const navigate = useNavigate();
  const [createUserWithMobile, { data, isError, isLoading }] = useCreateUserWithMobileMutation();
  const dispatch = useAppDispatch();

  const location = useLocation();
  const pathname = location.pathname;



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createUserWithMobile({
        mobileNumber: mobileNum,
        username: userName,
        role
      }).unwrap();

      dispatch(setIsOtpSent(true));
      dispatch(setMobileNumber(mobileNum))
      toast.success("🤹! Otp Sent Successfully")
    } catch (err: any) {
      if (err?.status === 409) {
        toast.error("⚠️ A user with this mobile Number already exists");
      }
      else {
        toast.error("☠️! Unable to creare user");
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Label label='MobileNumber' />
      <Input placeHolder='enter your Mobile number' setInputValue={setMobileNum} />
      {(!mobileNum) && <div className='flex text-red-500 text-md'>Please enter with calling code</div>}

      <Label label='UserName' />
      <Input placeHolder='enter your username' setInputValue={setUserName} />

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
        <CustomDivForAuth onClick={() => setVerifyMode("mobile")} buttonContent='Verify here' paraContent='Want to verify yourself with Email?' />
      </div>

      <div className='flex justify-center items-center gap-2 font-serif text-lg'>
        <CustomDivForAuth onClick={() => {
          if (pathname.includes("interviewer")) {
            navigate("/interviewer/login")
          } else {
            navigate("/login");
          }
        }
        } buttonContent='Login' paraContent={"Don't have an account?"} />
      </div>
    </form>
  )
}

export default SignupMobile