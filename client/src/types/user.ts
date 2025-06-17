import type { Notification } from "./notification";


export type Role = "INTERVIEWER" | "CANDIDATE" | "ADMIN";

export interface User{
    id: string
    username: string
    email?: string
    mobileNumber?: string
    isEmailVerified?: boolean
    isMobileVerified?: boolean
    profileUrl?: string
    role: Role
    notification?: Notification
    createdAt: Date
    updatedAt: Date
}
