import React, { useRef, useState } from 'react';
import { useAppDispatch } from '../../state/hook';
import { setOtpEntered } from '../../state/slices/auth/verifyOtpSlice';

type InputProps = {
  length?: number;
  onComplete: (pin: string) => void;
};

const  OTPInput = ({ length = 6, onComplete }: InputProps) => {
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [OTP, setOTP] = useState<string[]>(Array(length).fill(''));
  const dispatch = useAppDispatch();

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return; // Only allow digits

    const updatedOTP = [...OTP];
    updatedOTP[index] = value;
    setOTP(updatedOTP);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (updatedOTP.every((digit) => digit !== '')) {
      onComplete(updatedOTP.join(''));
    }

    const complete = updatedOTP.every((digit) => digit !== '');
    if (complete) {
      const fullOtp = updatedOTP.join('');
      dispatch(setOtpEntered(fullOtp));  // 🔥 Store in Redux
      onComplete?.(fullOtp);             // Optional: call parent callback
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !OTP[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('Text').slice(0, length);
    const digits = pastedData.split('').filter((char) => /\d/.test(char));

    if (digits.length === length) {
      setOTP(digits);
      digits.forEach((digit, i) => {
        inputRefs.current[i].value = digit;
      });
      onComplete(digits.join(''));
    }
  };

  return (
    <div className="flex gap-2 sm:gap-2 md:gap-4 lg:gap-5">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-semibold border text-gray-900 border-gray-700 dark:border-white rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition dark:text-gray-100"
          value={OTP[index]}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          ref={(el) => {
            if (el) inputRefs.current[index] = el;
          }}
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default OTPInput;
