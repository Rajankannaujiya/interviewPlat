
export type newMessageType = {
  type: "new_message";
  payload: {
    id: string;
    chatId: string;
    senderId: string;
    receiverId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  };
};

export type aiResponseType = {
  type: "ai_msg";
  payload: {
    sender: "ai" | "user";
    senderId: string;
    contents?: string;
    answer?: string;
  };
};

export type WebRTC_Actions = "OFFER" | "ANSWER" | "ICE_CANDIDATE" | "JOIN" | "LEAVE" | "ROOMJOIN_SUCCESS" | "ROOMJOIN_FAILURE" | "ROOMLEAVE_SUCCESS" | "ROOMLEAVE_FAILURE" ;


export interface webRTCType{
  type:"webrtc_connection";
  payload:{
    action: WebRTC_Actions;
    userId: string; // your peer/user ID
    interviewId?: string;

    // Optional fields depending on action type:
    sdp?: RTCSessionDescriptionInit// for offer/answer
    candidate?: RTCIceCandidateInit
  },
  isBothParticipantPresent?:boolean,
  message?:string,
  role: "OFFERER" | "ANSWERER" | null
};