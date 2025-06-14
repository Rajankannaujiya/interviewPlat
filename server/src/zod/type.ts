import { z } from "zod";
import {  notificationPayloadSchema, OtpSchema } from "./schema";

export type TypeOtpSchema = z.infer<typeof OtpSchema>
export type TypeNotificationPayloadSchema = z.infer<typeof notificationPayloadSchema>