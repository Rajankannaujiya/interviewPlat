import { z } from "zod";
import {
  NotificationType,
  NotificationChannel,
  InterViewStatus,
} from "@prisma/client";

export const OtpSchema = z.object({
  to: z.string(),
  otp: z.string(),
});

export const statusSchema = z.object({
  status: z.nativeEnum(InterViewStatus),
});

export const notificationPayloadSchema = z.object({
  type: z.nativeEnum(NotificationType),
  recipientId: z.string().min(1, "Recipient ID is required"),
  message: z.string().min(1, "Message is required"),
  channel: z.nativeEnum(NotificationChannel).optional(),
});

// const messageTypes = ["initWs", "chat_message"] as const;

// type MessageType = (typeof messageTypes)[number];

// Schema for "initWs" message
export const initMessageSchema = z.object({
  type: z.literal("initWs"),
  payload: z.object({
    userId: z.string(),
  }),
});

export const exitRoomSchema = z.object({
  type: z.literal("exit_chat"),
  payload: z.object({
    userId: z.string(),
  }),
});

const chatMessageSchema = z.object({
  type: z.literal("chat_message"),
  payload: z.object({
    chatId: z.string(),
    content: z.string(),
    senderId: z.string(),
    receiverId: z.string(),
  }),
});

export const aiChatSchema = z.object({
  type: z.literal("ai_msg"),
  payload: z.object({
    sender: z.union([z.literal("ai"), z.literal("user")]),
    contents: z.string(),
    senderId: z.string(),
  }),
});

export const newMessageSchema = z.object({
  type: z.literal("new_message"),
  payload: z.object({
    id: z.string(),
    chatId: z.string(),
    senderId: z.string(),
    receiverId: z.string(),
    content: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
});


export const iceCandidateSchema = z.object({
  candidate: z.string().optional(),
  sdpMid: z.string().nullable().optional(),
  sdpMLineIndex: z.number().nullable().optional(),
  usernameFragment: z.string().optional(),
});

export const webRTCSchema = z.object({
  type: z.literal("webrtc_connection"),
  payload: z.object({
    action: z.enum(["OFFER", "ANSWER", "ICE_CANDIDATE", "JOIN", "LEAVE", "ROOMJOIN_SUCCESS", "ROOMJOIN_FAILURE", "ROOMLEAVE_SUCCESS", "ROOMLEAVE_FAILURE"]),
    userId: z.string().uuid().or(z.string()).optional(),
    interviewId: z.string().uuid().or(z.string()).optional(),

    // Optional fields depending on action type:
   sdp: z.object({
        type: z.string(),   // "offer" | "answer"
        sdp: z.string(),    // actual SDP text
      })
      .optional(),
    candidate: iceCandidateSchema
      .optional(),
  }),
  message: z.string().optional(),
  isBothParticipantPresent:z.boolean().optional(),
  role: z.enum(["OFFERER" , "ANSWERER" ]).nullable()
});

export const messageSchema = z.discriminatedUnion("type", [
  initMessageSchema,
  chatMessageSchema,
  exitRoomSchema,
  aiChatSchema,
  webRTCSchema
]);
