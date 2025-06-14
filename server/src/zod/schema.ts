
import { z} from "zod";
import { NotificationType, NotificationChannel  } from "@prisma/client";

export const OtpSchema = z.object({
    to:z.string(),
    otp:z.string()
})

export const notificationPayloadSchema = z.object({
  type: z.nativeEnum(NotificationType),
  recipientId: z.string().min(1, "Recipient ID is required"),
  message: z.string().min(1, "Message is required"),
  channel: z.nativeEnum(NotificationChannel).optional(),
});