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