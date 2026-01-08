import { Feedback } from "./notification"
import { User } from "./user";

export type TypeInterviewStatus = "SCHEDULED" | "ONGOING"  | "COMPLETED" | "CANCELLED"


export interface Interview {
  id:string;
  title: string
  scheduledTime:Date;
  status: TypeInterviewStatus;
  feedback: Feedback;
  createdAt: Date;
  updatedAt: Date;
  Comment: Comment[] | [];
  interviewerId: string;
  candidateId: string;
  interviewr: User;
  candidate: User;
}

export interface GetAllMyInterviewsResponse {
  message: string;
  myinterviews: Interview[] | [];
}

export interface createInterviewProps{
  title?: string,
  interviewerId: string,
  candidateId: string,
  scheduledTime: string,
}

export interface rescheduleInterviewProps{
  title?:string,
  interviewId: string,
  newDateTime: string,
}