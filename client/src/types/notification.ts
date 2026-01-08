import {Interview} from "./interview"
import { User } from "./user"
export type TypeNotificationStatus = "PENDING" | "SENT" | "FAILED"
export type TypeNotificationChannel = "EMAIL" | "SMS"
export type TypeNotification = "REMINDER" | "RESCHEDULE" | "CANCELLATION"


export interface Notification {
id:string
type: TypeNotification
recipientId:string
message:string
status:TypeNotificationStatus
channel: TypeNotificationChannel
sentAt?: Date
}


export interface Feedback {
  id?: string;
  interviewId: string;
  rating?: number;
  note?: string;
  interview?: Interview
  createdAt?: Date
}

export interface Comment {
  id: string;
  interviewId:string;
  authorId?:string;
  content: string
  createdAt: Date
  updatedAt: Date
  interview: Interview
  author?: User
}