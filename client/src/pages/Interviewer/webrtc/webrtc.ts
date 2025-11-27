import { webRTCType } from "../../../types/message";
import { WebSocketManager } from "../../../ws/websocket";
import { sendIceCandidate, sendOffer } from "./Signalling";

export let pc: RTCPeerConnection;
export let localStream: MediaStream;
export let remoteStream: MediaStream;
export let dataChannel: RTCDataChannel;
export const iceCandidateBufferReceived: RTCIceCandidateInit[] = []


const webRTCConfigurations = {
    iceServers: [
  {
    urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun3.l.google.com:19302",
        "stun:stun4.l.google.com:19302",
    ]
  }
]
}

const constraints = {
  audio: true,
 video: { frameRate: { ideal: 10, max: 15 } }};


 let onLocalStream: ((s: MediaStream) => void) | null = null;
let onRemoteStream: ((s: MediaStream) => void) | null = null;

export function registerLocalStreamCallback(cb: (s: MediaStream) => void) {
  onLocalStream = cb;
}

export function registerRemoteStreamCallback(cb: (s: MediaStream) => void) {
  onRemoteStream = cb;
}
const getUserMedia = async()=>{
    // await navigator.mediaDevices.enumerateDevices();
    return await navigator.mediaDevices.getUserMedia(constraints)
}



export async function startWebRTCConnection(
  isOfferer:boolean,
  currentUserId: string,
  interviewerId: string,
  message: webRTCType,
  WsInstance: WebSocketManager
) {
  console.log("Starting WebRTC connection...");
  // let offer = null;
if (!pc || pc.connectionState === "closed" || pc.signalingState === "closed") {
    await createPeerConnection(currentUserId, interviewerId, message, WsInstance);
  } else {
    console.log("PC already exists — not recreating it.");
  }  // createDataChannel(currentUserId, interviewerId, WsInstance);
  // if(isOfferer){
  //   offer = await pc.createOffer();
  //   await pc.setLocalDescription(offer);
  //   message.payload.userId = currentUserId
  //   message.payload.sdp = offer;
  //   message.role = "OFFERER";
  //   WsInstance.send(message);
  // }
}


export async function createPeerConnection(
  currentUserId: string,
  interviewerId: string,
  message: webRTCType,
  WsInstance: WebSocketManager
) {
  pc = new RTCPeerConnection(webRTCConfigurations);

  pc.onconnectionstatechange = ()=>{
    console.log("Connection State of the pc: ", pc.connectionState );
    if(pc.connectionState === "connected"){
      alert("you have made the webrtc connection")
    }
  } 

  pc.onsignalingstatechange = ()=>{
    console.log("signling state changed",pc.signalingState);
  }

  if(!localStream){
    try {
      localStream = await getUserMedia();
      if(onLocalStream){
        onLocalStream(localStream)
      }
    } catch (error) {
      console.log("error in setting local stream", error);
    }
  }
  

  localStream.getTracks().forEach((track)=>{
    pc.addTrack(track, localStream)
  });

  pc.ontrack = (event) => {
  console.log("🎥 Received remote track:", event.track);

  // Create stream manually
  if (!remoteStream) {
    remoteStream = new MediaStream();
    if (onRemoteStream) onRemoteStream(remoteStream);
  }

  remoteStream.addTrack(event.track);
};


  pc.onicecandidate = (e)=>{
    if(e.candidate){
        console.log("SENDING ICE: ", e.candidate);
        sendIceCandidate(currentUserId, interviewerId, message.payload.interviewId!, e.candidate, WsInstance);
    }
  }

  
   pc.onnegotiationneeded = async () => {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      sendOffer(currentUserId, interviewerId, offer, message, WsInstance);
    };

    console.log("after sending offer",pc)

}



export async function handleCandidate (message:webRTCType){
  console.log("handle ice candidate frontend", message)
  const {candidate} = message.payload;
  if(!candidate){
    alert("candidate not found");
    return
  }

  if (pc && pc.remoteDescription) {
    try {
        await pc.addIceCandidate(candidate);
    } catch (err) {
      console.error("Error adding ICE candidate:", err);
    }
  } else {
    // Buffer if remote description isn't set yet
      candidate && iceCandidateBufferReceived.push(candidate);
  }
}

export function closePeerConnection(){
    if(pc){
        pc.close();
        console.log("you have closed your peer connection by calling the close() method");
    }
    console.log("your pc object after exiting the room is now ", pc);
}