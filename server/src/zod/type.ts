import { z } from "zod";
import {  notificationPayloadSchema, OtpSchema, statusSchema } from "./schema";

export type TypeOtpSchema = z.infer<typeof OtpSchema>
export type TypeNotificationPayloadSchema = z.infer<typeof notificationPayloadSchema>
export type TypeStatusSchema = z.infer<typeof statusSchema>