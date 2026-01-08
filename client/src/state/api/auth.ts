import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { EmailOtpVerifyType, MobileOtpVerifyType, Email, Mobile, SingupUserEmailType, SingupUserMobileType, VerifyOtpResponse, User } from '../../types/user';



export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/' }),
  endpoints: (build) => ({
    createUserWithEmail: build.mutation< void,SingupUserEmailType>({
      query:(body)=>({
        url: '/auth/signup/otp/email/',
        method: 'POST',
        body
      })
    }),

    createUserWithMobile: build.mutation<void, SingupUserMobileType>({
      query: (body)=>({
        url: '/auth/signup/otp/mobile/',
        method:'POST',
        body
      })
    }),

    loginUserWithEmail: build.mutation<void, Email>({
      query: (email)=>({
        url: '/auth/login/otp/email',
        method: 'POST',
        body: email
      })
    }),

    loginUserWithMobile: build.mutation<void, Mobile>({
      query: (mobileNumber)=>({
        url: '/auth/login/otp/mobile',
        method: 'POST',
        body: mobileNumber
      })
    }),

    verifyEmailOtp: build.mutation<VerifyOtpResponse, EmailOtpVerifyType>({
      query: (body)=>({
        url: '/auth/verify/email',
        method: 'POST',
        body
      })
    }),

    verifyMobileOtp: build.mutation<VerifyOtpResponse, MobileOtpVerifyType>({
      query: (body)=>({
        url: '/auth/verify/mobile',
        method: 'POST',
        body
      })
    }),

    OtpResendToEmail: build.mutation<void,Email>({
      query: (email)=>({
        url: '/auth/resend/otp/email',
        method: 'POST',
        body:email
      })
    }),

    OtpResendToMobile: build.mutation<void, Mobile>({
      query: (mobileNumber)=>({
        url: '/auth/resend/otp/mobile',
        method: 'POST',
        body:mobileNumber
      })
    }),
  }),
})


export const {useCreateUserWithEmailMutation, useCreateUserWithMobileMutation, useVerifyEmailOtpMutation, useVerifyMobileOtpMutation, useOtpResendToEmailMutation, useOtpResendToMobileMutation, useLoginUserWithEmailMutation, useLoginUserWithMobileMutation} = authApi