import { useState } from 'react';
import sideImage from "../../assets/2.jpg";
import EmailAuth from './LoginEmail';
import MobileAuth from './LoginMobile';
import { useLocation } from 'react-router-dom';
import SignupEmail from './SignupEmail';
import SignupMobile from './SignupMobile';
import { useAppSelector } from '../../state/hook';
import OtpToMobile from './OtpToMobile';
import OtpToEmail from './OtpToEmail';

type LoginPage = {
    headingText: string;
    formHeadEmail: string;
    formHeadMobile: string;
}


const AuthPage = ({ headingText, formHeadEmail, formHeadMobile }: LoginPage) => {
    const [verifyMode, setVerifyMode] = useState("email");
    const isotpSent = useAppSelector(state=>state.otpVerify.isotpSent);
    console.log(verifyMode)

    const location = useLocation();
    const pathname = location.pathname;

    return (
        <div className={`p-4 w-full h-screen overflow-auto overflow-y-auto scroll-auto  grid grid-cols-1 lg:grid-cols-2`}>
            { !isotpSent ? (<div className="flex h-full flex-col justify-center items-center w-full px-4">
                <div className={`flex flex-col justify-center bg-gray-100 dark:bg-gray-700 p-8 rounded-lg shadow-sm w-full  max-w-xl tracking-wide gap-8`}>
                    <h1 className="text-2xl font-semibold mt-4 text-center text-blue-800 font-serif dark:text-blue-200 mb-6">
                        {/* Create your Account to proceed With InterViewPlat */}
                        {headingText}
                    </h1>

{/* show this on the above medium screen */}

                    <div className="hidden md:grid md:grid-col-1 md:grid-cols-2 text-center bg-light-background p-1 text-gray-700 w-full rounded-lg shadow-sm">
                        <button
                            type="button"
                            className={`w-full p-1 transition-all duration-200 rounded ${verifyMode === "email"
                                    ? "underline underline-offset-6 text-primary text-white font-semibold bg-blue-500"
                                    : "hover:text-primary"
                                }`}
                            onClick={() => setVerifyMode("email")}
                        >
                            <strong className="text-xl">{formHeadEmail}</strong>
                        </button>
                        <button
                            type="button"
                            className={`w-full p-1 transition-all duration-200 rounded ${verifyMode ==="mobile"
                                    ? "underline underline-offset-6 text-primary font-semibold text-white   bg-blue-500"
                                    : "hover:text-primary"
                                }`}
                            onClick={() => setVerifyMode("mobile")}
                        >
                            <strong className="text-xl">{formHeadMobile}</strong>
                        </button>
                    </div>
{/* if the user want to login */}

                    {(pathname === "/login") && (<div className=''>
                        {verifyMode === "email" && <EmailAuth setVerifyMode={setVerifyMode}/>}
                        {verifyMode === "mobile" && <MobileAuth setVerifyMode={setVerifyMode}/>}
                    </div>)}

{/* if the user want to signup */}

                    {
                        (pathname === "/signup" || pathname === "/") && (
                            <div>
                                {verifyMode === "email" && <SignupEmail setVerifyMode={setVerifyMode}/>}
                                {verifyMode === "mobile" && <SignupMobile setVerifyMode={setVerifyMode}/>}
                            </div>
                        )
                    }
                </div>
            </div>)
            :
            // handle when otp sent is true

            (<div className='items-center'>
                {/* <OtpToMobile /> */}

            {verifyMode === "mobile" && <OtpToMobile />}
            {verifyMode === "email" && <OtpToEmail />} 
            </div>)
}



            <div className={`hidden lg:flex h-full rounded-lg shadow-md transform translate-0 duration-200 ease-in-out`}>
                <img
                    src={sideImage}
                    alt='background image'
                    className='rounded-xl shadow-xl w-full'
                />
            </div>

        </div>
    )
}

export default AuthPage