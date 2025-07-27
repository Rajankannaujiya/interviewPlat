import type { Comment, Notification } from "./notification";


export type Role = "INTERVIEWER" | "CANDIDATE" | "ADMIN";

export type SingupUserEmailType = {
    email:string;
    username: string;
    role:Role;
} 

export type SingupUserMobileType = {
    mobileNumber:string;
    username: string;
    role:Role;
} 

export type MobileOtpVerifyType = {
    mobileNumber:string;
    otp:string
} 

export type EmailOtpVerifyType = {
    email:string;
    otp:string
} 

export type Email={
    email:string
}

export type Mobile={
    mobileNumber:string
}

export type VerifyOtpResponse = {
  message: string;
  token: string;
  user: User;
};

export interface User{
    id: string
    username: string
    email?: string
    mobileNumber?: string
    isEmailVerified?: boolean                                                     
    isMobileVerified?: boolean
    profileUrl?: string
    role: Role
    notification?: Notification[] | []
    comment?:Comment
    sentMessage?: Message[] | []
    receivedMessage?: Message[] | [] 
    createdAt: Date                                                                                   
    updatedAt: Date
}

interface Message {
  id:string;
  content:string
  senderId:string
  receiverId:string
  createdAt: Date
  updatedAt: Date
}
