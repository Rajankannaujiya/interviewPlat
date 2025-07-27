import { useCallback, useEffect, useRef, useState } from 'react';
import OTPInput from './OtpInput';
import { useAppDispatch, useAppSelector } from '../../state/hook';
import { useOtpResendToEmailMutation, useVerifyEmailOtpMutation } from '../../state/api/auth';
import { setIsVerrified, setOtpEntered } from '../../state/slices/auth/verifyOtpSlice';
import { toast } from 'react-toastify';
import { setAuthenticatedState } from '../../state/slices/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const OtpToEmail = () => {
    const [canResendOtp, setCanResendOtp] = useState(60);
    const otpExpireRef = useRef(300); // 5 minutes total
    const [displayTime, setDisplayTime] = useState(otpExpireRef.current);
    const isOtpSent = useAppSelector((state) => state.otpVerify.isotpSent);

    const email = useAppSelector((state) => state.otpVerify.email);
    const otpEntered = useAppSelector((state) => state.otpVerify.otpEntered);
    console.log("otp send to email", otpEntered)

    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const [verifyOtp, { data, isError, isLoading }] = useVerifyEmailOtpMutation();
    const [resendOtp, { isLoading: resendOtpLoaing }] = useOtpResendToEmailMutation();


    console.log("otpemail", data, isError, isLoading);

    // Countdown timer for resend button
    useEffect(() => {
        if (canResendOtp === 0) return;

        const resendTimer = setInterval(() => {
            setCanResendOtp((prev) => {
                if (prev === 1) clearInterval(resendTimer);
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(resendTimer);
    }, [canResendOtp]);

    // OTP expiration timer using ref to avoid re-renders
    useEffect(() => {
        const otpTimer = setInterval(() => {
            if (otpExpireRef.current === 0) {
                clearInterval(otpTimer);
                return;
            }

            otpExpireRef.current -= 1;
            setDisplayTime(otpExpireRef.current); // update UI
        }, 1000);

        return () => clearInterval(otpTimer);
    }, []);

    // Reset timers when OTP is (re)sent
    useEffect(() => {
        if (isOtpSent) {
            setCanResendOtp(60);
            otpExpireRef.current = 300;
            setDisplayTime(300);
        }
    }, [isOtpSent]);

    const handleOtpComplete = useCallback(async (otp: string) => {
        console.log("Verifying OTP...");
        try {
            const result = await verifyOtp({
                email,
                otp: otp
            }).unwrap();

            if (result) {
                dispatch(setAuthenticatedState({
                    user: result.user,
                    token: result.token,
                    isAuthenticated: true
                }));
                dispatch(setIsVerrified(true));
                toast.success("💥 Verification Successful");
                navigate("/")
                return

            }
        } catch (error) {
            console.log(error)
            toast.error("🙃 Please try again after some time");
            return
        }
    }, [email, otpEntered, verifyOtp, dispatch]);

    const handleResendOtp = async () => {
        if (canResendOtp === 0) {
            console.log("Resending OTP...");
            try {
                await resendOtp({
                    email
                }).unwrap();
                toast.success("✅ OTP resent successfully");
            } catch (error) {
                console.error(error);
                toast.error("❌ Failed to resend OTP. Please try again.");
            }
        }
    };

    const handleVerify = async () => {
        await handleOtpComplete(otpEntered);
    };

    const isResendAvailable = canResendOtp === 0;
    const isOtpExpired = otpExpireRef.current === 0;

    // Format MM:SS
    const formatTime = (seconds: number) => {
        const min = Math.floor(seconds / 60).toString().padStart(2, '0');
        const sec = (seconds % 60).toString().padStart(2, '0');
        return `${min}:${sec}`;
    };

    useEffect(() => {
  if (isError) {
    toast.error("Please check the otp");
  }
}, [isError]);

    return (
        <div className="flex justify-center mt-40 rounded-md min-h-1/3">
            <div className="w-full p-2 m-2 flex items-center flex-wrap justify-center flex-col gap-4">
                <div className="flex flex-col p-0.5">
                    <h1 className="text-2xl font-semibold mt-4 text-center text-blue-800 font-serif dark:text-blue-200 mb-6">
                        Please Enter the OTP
                    </h1>
                    <p className="text-2xl text-green-400 font-serif dark:text-green-100">
                        <strong className="font-semibold">Note:</strong> OTP expires in {formatTime(displayTime)} minutes
                    </p>
                </div>

                <div className="flex m-4 py-2">
                    <OTPInput onComplete={handleOtpComplete} />
                </div>

                <div className="text-center w-full">
                    <button
                        disabled={isOtpExpired}
                        onClick={handleVerify}
                        className={`bg-blue-500 text-white text-md w-full md:w-md shadow-sm rounded-md px-4 py-2 ${isOtpExpired ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? "Processing..." : "Verify"}
                    </button>

                    {isResendAvailable ? (
                        <div className="gap-1 flex justify-center items-center text-center mt-2">
                            <p className="m-1 p-1 text-xl text-green-400">
                                Haven't received the OTP?
                            </p>
                            <button
                                type="button"
                                className="text-xl text-blue-700 cursor-pointer p-1"
                                onClick={handleResendOtp}
                            >
                                {resendOtpLoaing ? "Processing..." : "Resend OTP"}
                            </button>
                        </div>
                    ) : (
                        <p className="m-1 p-1 text-xl text-red-600">
                            You can request another OTP in {canResendOtp}s
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OtpToEmail;
