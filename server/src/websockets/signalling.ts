import { WebSocket } from "ws";
import { ConnectionType, RoomType, TypeWebRTCSchema } from "../zod/type";
import { prisma } from "../db/db.index";

export let connections = new Map<string, ConnectionType>();

export let room = new Map<string, RoomType>();

async function addConnections(message: TypeWebRTCSchema, ws: WebSocket) {
  const { userId, interviewId } = message.payload;

  if (!userId || !interviewId) return;

  let bothUsersPresent = false;

  // Fetch interview + user
  const [interview, user] = await Promise.all([
    prisma.interview.findUnique({
      where: { id: interviewId },
      select: {
        id: true,
        interviewerId: true,
        candidateId: true,
      },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true },
    }),
  ]);

  if (!interview || !user) return;

  // Save connection
  (ws as any).userId = userId;
  (ws as any).interviewId = interviewId;
  connections.set(userId, { userId, interviewId, ws });

  // Determine the other user
  const otherUserId =
    interview.candidateId === userId
      ? interview.interviewerId
      : interview.candidateId;

  if (!otherUserId) return;

  console.log("🔗 addConnections => sender:", userId, "other:", otherUserId);

  // Check if both are connected
  if (connections.has(userId) && connections.has(otherUserId)) {
    bothUsersPresent = true;
  }

  // Assign THIS user's role
  let role: "OFFERER" | "ANSWERER" | null = null;
  if (bothUsersPresent) {
    role = userId === interview.interviewerId ? "OFFERER" : "ANSWERER";
  }

  // Notify current user
  const messageToUser: TypeWebRTCSchema = {
    type: "webrtc_connection",
    payload: {
      action: "ROOMJOIN_SUCCESS",
      userId,
      interviewId,
    },
    role,
    isBothParticipantPresent: bothUsersPresent,
    message: `You have joined the interview.`,
  };

  sendSuccessMessage(userId, messageToUser);

  // Notify other user
  if (bothUsersPresent && connections.has(otherUserId)) {
    const otherRole =
      bothUsersPresent ?
      (otherUserId === interview.interviewerId ? "OFFERER" : "ANSWERER") : null;

    const messageToOther: TypeWebRTCSchema = {
      type: "webrtc_connection",
      payload: {
        action: "ROOMJOIN_SUCCESS",
        userId: otherUserId,
        interviewId,
      },
      role: otherRole,
      isBothParticipantPresent: bothUsersPresent,
      message: `User ${user.username} has joined the room.`,
    };
    sendSuccessMessage(otherUserId, messageToOther);
  }
}


async function handleSendWithoutChange(message: TypeWebRTCSchema) {
  const { userId, interviewId} = message.payload;

  if (!userId || !interviewId) {
    console.log("Data is missing in handleSendWithoutChange", message.payload);
    return;
  }

  if(message.payload.action === "ICE_CANDIDATE"){
    if(!message.payload.candidate){
      console.log("no ice candidate");
      return
    }
  }

  if(message.payload.action === "OFFER" || message.payload.action === "ANSWER"){
    if(!message.payload.sdp){
      console.log("mising sdp", message.payload.action);
      return
    }
  }

  try {
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
    });

    if (!interview) {
      console.log("No interview was found", interview);
      return;
    }

    const { interviewerId, candidateId } = interview;

    // Determine role
    let role: "OFFERER" | "ANSWERER" | null = null;
    if (userId === interviewerId) {
      role = "OFFERER";
    } else if (userId === candidateId) {
      role = "ANSWERER";
    } else {
      console.log("User is not part of this interview");
      return;
    }

    // Determine other user
    const otherUserId = userId === candidateId ? interviewerId : candidateId;

    if (!otherUserId) {
      console.log("otherUserId not found", otherUserId);
      return;
    }

    // Attach role inside the payload before sending to the other peer
    const updatedMessage = {
      ...message,
      role: role,
    };

    if (connections.has(otherUserId)) {
      sendSuccessMessage(otherUserId, updatedMessage);
    }
  } catch (error) {
    console.log(
      "Error in handleSendWithoutChange",
      message.payload.action,
      error
    );
  }
}



export function handleJoinWebRTC(message: TypeWebRTCSchema, ws:WebSocket){
    addConnections(message, ws);
}

export function handleOffer(message: TypeWebRTCSchema, ){
    handleSendWithoutChange(message);
}

export function handleAnswer(message: TypeWebRTCSchema){
  handleSendWithoutChange(message)
}

export function handleIceCandidate(message: TypeWebRTCSchema){
  handleSendWithoutChange(message);
}

export function handleLeave(message: TypeWebRTCSchema, ws:WebSocket){
  handleSendWithoutChange(message);
}

export function sendSuccessMessage(userId: string, message: any) {
  const conn = connections.get(userId);
  if (!conn) {
    console.warn("⚠️ No active WebSocket for user:", userId);
    return;
  }
  try {
    console.log("➡️ Sending to:", userId);
    conn.ws.send(JSON.stringify(message));
  } catch (e) {
    console.error("❌ Failed to send message:", e);
  }
}

