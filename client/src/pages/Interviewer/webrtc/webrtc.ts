import { webRTCType } from "../../../types/message";
import { Message } from "../../../types/user";
import { WebSocketManager } from "../../../ws/websocket";
import { sendIceCandidate, sendOffer } from "./Signalling";

export let pc: RTCPeerConnection | null = null;
export let localStream: MediaStream | null = null;
export let remoteStream: MediaStream | null = null;
export let dataChannel: RTCDataChannel | null = null;
export const iceCandidateBufferReceived: RTCIceCandidateInit[] = [];

const webRTCConfigurations = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun3.l.google.com:19302",
        "stun:stun4.l.google.com:19302",
      ],
    },
  ],
};

const constraints = {
  audio: true,
  video: { frameRate: { ideal: 10, max: 15 } },
};

let onLocalStream: ((s: MediaStream) => void) | null = null;
let onRemoteStream: ((s: MediaStream) => void) | null = null;
let onMessageCallback: ((msg: Message) => void) | null = null;

export function registerLocalStreamCallback(cb: (s: MediaStream) => void) {
  onLocalStream = cb;
}

export function registerRemoteStreamCallback(cb: (s: MediaStream) => void) {
  onRemoteStream = cb;
}

export function registerOnMessageCallback(cb: (msg: Message) => void) {
  onMessageCallback = cb;
}

const getUserMedia = async () => {
  // await navigator.mediaDevices.enumerateDevices();
  return await navigator.mediaDevices.getUserMedia(constraints);
};

export async function startWebRTCConnection(
  isOfferer: boolean,
  currentUserId: string,
  interviewerId: string,
  message: webRTCType,
  WsInstance: WebSocketManager
) {
  console.log("Starting WebRTC connection...");
  // let offer = null;
  if (
    !pc ||
    pc.connectionState === "closed" ||
    pc.signalingState === "closed"
  ) {
    await createPeerConnection(
      currentUserId,
      interviewerId,
      message,
      WsInstance
    );
  } else {
    console.log("PC already exists — not recreating it.");
  }
  await createDataChannel(isOfferer);
}

export async function createPeerConnection(
  currentUserId: string,
  interviewerId: string,
  message: webRTCType,
  WsInstance: WebSocketManager
) {
  pc = new RTCPeerConnection(webRTCConfigurations);
  if(!pc){
    return
  }
  else if(pc){
    pc.onconnectionstatechange = () => {
      console.log("Connection State of the pc: ", pc?.connectionState);
      if (pc?.connectionState === "connected") {
        alert("you have made the webrtc connection");
      }
    };

    pc.onsignalingstatechange = () => {
      console.log("signling state changed", pc && pc.signalingState);
    };

    if (!localStream) {
      try {
        localStream = await getUserMedia();
        if (onLocalStream) {
          onLocalStream(localStream);
        }
      } catch (error) {
        console.log("error in setting local stream", error);
      }
    }

    if (pc && localStream) {
    localStream.getTracks().forEach((track) => {
      pc?.addTrack(track, localStream!);
    });
}

    pc.ontrack = (event) => {
      console.log("🎥 Received remote track:", event.track);

      // Create stream manually
      if (!remoteStream) {
        remoteStream = new MediaStream();
        if (onRemoteStream) onRemoteStream(remoteStream);
      }

      remoteStream.addTrack(event.track);
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        console.log("SENDING ICE: ", e.candidate);
        sendIceCandidate(
          currentUserId,
          interviewerId,
          message.payload.interviewId!,
          e.candidate,
          WsInstance
        );
      }
    };

    pc.onnegotiationneeded = async () => {
      if(!pc){
        return
      }
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      sendOffer(currentUserId, interviewerId, offer, message, WsInstance);
    };
    console.log("after sending offer", pc);
  }

  
}

export async function createDataChannel(isOfferer: boolean) {
  if(!pc){
    return
  }
  if (isOfferer) {
    const dataChannelOption: RTCDataChannelInit = {
      ordered: false,
      maxRetransmits: 0,
    };
    dataChannel = pc.createDataChannel(
      "interviewConsole-Chat-Room",
      dataChannelOption
    );
    registerDataChannelEvent();
  } else {
    pc.ondatachannel = (e) => {
      dataChannel = e.channel;
      registerDataChannelEvent();
    };
  }
}

export function registerDataChannelEvent() {
  if (!dataChannel) return;

  dataChannel.onmessage = (e) => {
    console.log("message received onmessage");
    try {
      const msg: Message = JSON.parse(e.data);

      if (onMessageCallback) {
        onMessageCallback(msg);
      }
    } catch (error) {
      console.log("Invalid JSON:", e.data);
    }
  };

  dataChannel.onopen = (e) => {
    console.log("Data channel is opened now", e);
  };

  dataChannel.onclose = () => {
    console.log("The 'close' event was fired on your data channel object");
  };

  dataChannel.onerror = () => {
    console.log("Error occured in data channel");
  };
}

export async function handleCandidate(message: webRTCType) {
  console.log("handle ice candidate frontend", message);
  const { candidate } = message.payload;
  if (!candidate) {
    alert("candidate not found");
    return;
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

export async function closePeerConnection() {
  try {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      localStream = null;
    }

    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
      remoteStream = null
    }

    if (dataChannel && dataChannel.readyState !== "closed") {
      dataChannel.close();
      dataChannel = null
    }

    if (pc) {
      pc.onicecandidate = null;
      pc.ontrack = null;
      pc.onnegotiationneeded = null;
      pc.oniceconnectionstatechange = null;
      pc.onsignalingstatechange = null;

    // Close PC
      pc.close();
      pc = null;

      localStorage.removeItem("currentInterviewId");
    }
  } catch (err) {
    console.warn("Error closing peer connection:", err);
  }
}