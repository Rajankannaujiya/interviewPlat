import { webRTCType } from "../../../types/message";
import { WebSocketManager, WsInstance } from "../../../ws/websocket";
import { toast } from "react-toastify";
import { createPeerConnection, handleCandidate, iceCandidateBufferReceived, pc, startWebRTCConnection } from "./webrtc";

function getPersistedAuth() {
  try {
    const raw = localStorage.getItem("persist:auth");
    if (!raw) return null;

    const level1 = JSON.parse(raw);

    if(!level1.user){
      return null;
    }

    return {
      user: JSON.parse(level1.user),
      token: JSON.parse(level1.token),
    };
  } catch (err) {
    console.error("❌ Failed to parse persist:auth", err);
    return null;
  }
}

export async function handleJoinInterView(
  userId: string,
  interviewId: string,
  WsInstance: WebSocketManager
) {
  const message: webRTCType = {
    type: "webrtc_connection",
    payload: {
      action: "JOIN",
      userId,
      interviewId,
    },
    isBothParticipantPresent: false,
    role: null,
  };
  WsInstance.send(JSON.stringify(message));
}

export function handleWebRTCMessageEvent(
  data: any,
  interviewerId: string,
  WsInstance: WebSocketManager
) {
  const message: webRTCType = data;

  const currentUserId = getPersistedAuth()?.user.id;
  if(!currentUserId) {
    alert("you are not login");
    return
  }
  console.log(currentUserId, "current user id is currentuserid");
  const webrtcRequestType = message.payload;
  if (message.type === "webrtc_connection") {
    switch (webrtcRequestType.action) {
      case "ROOMJOIN_SUCCESS":
        toast(message.message);
        if (message.isBothParticipantPresent && message.role === "OFFERER") {
          startWebRTCConnection(true, currentUserId, interviewerId, message, WsInstance);
        }
        break;

      case "OFFER":
        handleOffer(currentUserId, interviewerId, message, WsInstance);
        break;

      case "ANSWER":
        handleAnswer(message);
        break;

      case "ICE_CANDIDATE":
        handleCandidate(message);
        break;

      default:
        console.warn("⚠️ Unknown WebRTC action:", webrtcRequestType);
    }
  }
}

async function handleOffer(
  currentUserId: string,
  interviewerId: string,
  message: webRTCType,
  WsInstance: WebSocketManager
) {
  const { sdp } = message.payload;

  if (!sdp) {
    console.log("data is missing handloffer", message);
    return;
  }

  // Only create if not present (or closed)
  if (!pc || pc.connectionState === "closed" || pc.signalingState === "closed") {
    await createPeerConnection(currentUserId, interviewerId, message, WsInstance);
  } else {
    console.log("Using existing peer connection for incoming offer.");
  }

  const peerConnection = pc;
  if (!peerConnection) {
    alert("pc is null");
    return;
  }

  await peerConnection.setRemoteDescription(sdp);

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  sendAnswer(currentUserId, interviewerId, answer, message, WsInstance);

  // after setRemoteDescription, flush any buffered ICE candidates (see below)
}



export async function handleAnswer(  
  message: webRTCType
) {
  console.log("answer received", message)
  const { sdp } = message.payload;
  if (!sdp ) return;

  const peerConnection = pc;
  if (!peerConnection) {
    alert("Peer connection (pc) not found in handleAnswer");
    return;
  }

  try {
    
    await pc.setRemoteDescription(sdp);

    for (const candidate of iceCandidateBufferReceived) {
      try {
        await pc.addIceCandidate(candidate);
      } catch (err) {
        console.error("Failed to add buffered ICE candidate:", candidate, err);
      }
    }
    iceCandidateBufferReceived.length = 0;
  } catch (error) {
    console.error("Error handling ANSWER:", error);
  }
}


export function sendOffer(currentUserId:string, interviewerId:string, offer:RTCSessionDescriptionInit, message:webRTCType, WsInstance:WebSocketManager){

  if(currentUserId === interviewerId){
    message.role = "OFFERER"
  }else{
    message.role = "ANSWERER";
  }
  message.payload.action = "OFFER"
  message.payload.sdp = offer;
  message.payload.userId = currentUserId;
  WsInstance.send(message);
}

export function sendAnswer(currentUserId:string, interviewerId: string, answer:RTCSessionDescriptionInit, message:webRTCType, WsInstance:WebSocketManager){
  if(currentUserId === interviewerId){
    message.role = "OFFERER"
  }else{
    message.role = "ANSWERER";
  }

  const answerMessage={
  type: "webrtc_connection",
  payload: {
    action: "ANSWER",
    userId: currentUserId,
    interviewId: message.payload.interviewId,
    sdp: answer
  },
  role:message.role,
  isBothParticipantPresent: true
};
  WsInstance.send(answerMessage);

}


export function sendIceCandidate(currentUserId:string, interviewerId: string, interviewId:string, candidate: RTCIceCandidateInit, WsInstance:WebSocketManager){

  if(!candidate){
    return
  }
  const role = currentUserId === interviewerId ? "OFFERER" : "ANSWERER";


  const message:webRTCType = {
    type:"webrtc_connection",
    payload:{
      action: "ICE_CANDIDATE",
      userId:currentUserId,
      interviewId,
      candidate
    },
    isBothParticipantPresent:true,
    role
  }

  WsInstance.send(message)
}