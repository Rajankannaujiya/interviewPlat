// src/components/interview/InterViewConsole.tsx
import { Mic, PhoneCall, ScreenShare, MessageSquare, X, MicOff, ScreenShareOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ChatMessages } from "../message/component/ChatArea";
import { Message } from "../../types/user";
import {
  dataChannel,
  localStream,
  pc,
  registerLocalStreamCallback,
  registerOnMessageCallback,
  registerRemoteStreamCallback,
  remoteStream,
} from "./webrtc/webrtc";
import { useGetAllMyInterviewsQuery, useUpdateInterviewStatusMutation } from "../../state/api/interview";
import { useAppSelector } from "../../state/hook";
import { toast } from "react-toastify";
import { Interview } from "../../types/interview";
import { useNavigate } from "react-router-dom";
import { handleDisconnection } from "./webrtc/Signalling";
import { webRTCType } from "../../types/message";
import FeedBack from "../../components/FeedBack";

const InterViewConsole = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [localStreamState, setLocalStreamState] = useState<MediaStream | null>(null);
  const [remoteStreamState, setRemoteStreamState] = useState<MediaStream | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMuted, setIsMuted] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);


  const selectedInterviewId = useAppSelector(state => state.chat.selectedInterviewId);
  const userAuthState = useAppSelector((state) => state.auth);
  const currentUserId = userAuthState.user?.id;
  const navigate = useNavigate();

  const [updateInterviewStatus] = useUpdateInterviewStatusMutation();
  
  if (!userAuthState.isAuthenticated && !userAuthState.user) {
    toast.error("☠️ Please login");
    return null;
  }


  const { data, isError } = useGetAllMyInterviewsQuery(
      { userId: currentUserId! },
      { skip: !userAuthState.isAuthenticated || !userAuthState.user?.id }
    );
  
    if (isError) {
      toast.error("An error occurred while fetching the data");
      return null;
    }
  
    const allInterviews: Interview[] = data?.myinterviews || [];
  
    // Sort by scheduled time
  const interviewSelected: Interview | undefined = allInterviews.find(i => i.id === selectedInterviewId);
  const receiverId = (currentUserId === interviewSelected?.candidateId ? interviewSelected?.interviewerId : interviewSelected?.candidateId);
  


  const handleSend = () => {
    if (input.trim() === "") return;
    const msg:Message = {
      id:Math.random().toString(),
      senderId: currentUserId!,
      receiverId: receiverId!,
      content: input,
      createdAt: new Date()
    }

    if(dataChannel && dataChannel.readyState === "open"){
      dataChannel.send(JSON.stringify(msg));
    }

    setMessages(prev => [...prev, msg]);
    setInput("");
    // TODO: send through data channel or signalling
  };


  const handleCutCall = async()=>{

    await updateInterviewStatus({
      interviewId: interviewSelected?.id!,
      status: "COMPLETED",
      updateAll: false,
    }).unwrap();
    toast.success(`Interview ${interviewSelected?.id!} marked as COMPLETED`);

    const msg:webRTCType = {
      type:"webrtc_connection",
      payload:{
        action:"LEAVE",
        userId:currentUserId!,
        interviewId: interviewSelected?.id!
      },
      role: currentUserId === interviewSelected?.candidateId ? "ANSWERER" : "OFFERER"
    }
    await handleDisconnection(currentUserId!, msg);
    localVideoRef.current = null;
    remoteVideoRef.current = null
    navigate("/");
  }


  async function captureScreen() {
     const displayMediaOptions:any = {
      video: { cursor: "always" },
      audio: isMuted ? true : false, // set to true if you want system audio
    };
    return await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
  }

  const handleScreenShare = async () => {
  try {
    const stream = await captureScreen();

    const screenVideoTrack = stream.getVideoTracks()[0];
    const sender = pc?.getSenders().find(s => s.track?.kind === "video");

    if (sender) {
      await sender.replaceTrack(screenVideoTrack);
    } else {
      pc?.addTrack(screenVideoTrack, stream);
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
      localVideoRef.current.onloadedmetadata = () => {
        localVideoRef.current?.play().catch(console.warn);
      };
      setIsScreenSharing(true);
    }
    screenVideoTrack.onended = handleStopScreenShare;
  } catch (err) {
    console.error("Screen share error:", err);
  }
  };

  const handleStopScreenShare =  async () => {
      if (localStream) {
        const camVideoTrack = localStream.getVideoTracks()[0];

        const sender = pc?.getSenders().find(s => s.track?.kind === "video");
        if (sender) {
          await sender.replaceTrack(camVideoTrack);
        }

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
          localVideoRef.current.play().catch(console.warn);
          setIsScreenSharing(false);
        }
      }
    };

  const handleMuteAndUnmute = () => {
  console.log("ismuted", isMuted)
    if (!localStream) return;

    const audioTrack = localStream.getAudioTracks()[0];
    if (!audioTrack) return;

    audioTrack.enabled = !audioTrack.enabled;
    setIsMuted(!audioTrack.enabled);
  };

  useEffect(() => {
    console.log("Component mounted =>", {
      localVideoRef: localVideoRef.current,
      remoteVideoRef: remoteVideoRef.current,
      globalLocalStream: localStream,
      globalRemoteStream: remoteStream,
    });

    // Register callbacks first so late-arriving streams will update React
    registerLocalStreamCallback((stream) => {
      console.log("📡 React received LOCAL STREAM");
      setLocalStreamState(stream);
    });

    registerRemoteStreamCallback((stream) => {
      console.log("📡 React received REMOTE STREAM");
      setRemoteStreamState(stream);
    });

    // If stream arrived before mount, pick it up now
    if (localStream) {
      setLocalStreamState(localStream);
    }
    if (remoteStream) {
      setRemoteStreamState(remoteStream);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStream, remoteStream]); // run once

  // Attach local stream to video element
  useEffect(() => {
    const video = localVideoRef.current;
    if (!video) return;

    if (localStreamState) {
      video.srcObject = localStreamState;
      video.onloadedmetadata = () => {
        video.play().catch((err) => {
          console.warn("local video play error:", err);
        });
      };
    } else {
      // Clear srcObject when no stream
      try {
        (video as HTMLVideoElement).srcObject = null;
      } catch {}
    }
  }, [localStreamState]);

  // Attach remote stream to video element with onloadedmetadata
  useEffect(() => {
    const video = remoteVideoRef.current;
    if (!video) return;

    if (remoteStreamState) {
      console.log("Attaching REMOTE stream to video");
      video.srcObject = remoteStreamState;
      video.onloadedmetadata = () => {
        video.play().catch((err) => {
          console.warn("remote video play error:", err);
        });
      };
    } else {
      try {
        (video as HTMLVideoElement).srcObject = null;
      } catch {}
    }
  }, [remoteStreamState]);


  useEffect(() => {
  registerOnMessageCallback((msg: Message) => {
    setMessages(prev => [...prev, msg]);
  });
  }, []);


  return (
    <div
      className="
        flex flex-col lg:flex-row w-full 
        h-[calc(100vh-50px)] 
        bg-gradient-to-br from-gray-100 via-stone-100 to-gray-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 text-white 
        overflow-hidden
      "
    >
      {/* LEFT SECTION - VIDEO & CONTROLS */}
      <div className="flex-1 flex flex-col p-3 sm:p-4 space-y-4 relative overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center px-3 py-2 bg-gray-200 dark:bg-gray-800/50 rounded-2xl backdrop-blur-md border border-gray-700 sticky top-0 z-10">
          <h1 className="text-lg sm:text-xl font-semibold text-blue-400">
            IntelliHire Interview Room
          </h1>
          <span className="text-xs sm:text-sm text-gray-400">
            Live: <span className="text-green-400 font-medium">Active</span>
          </span>
        </div>

        {/* VIDEOS */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-12 lg:m-0">
          <div className="relative bg-black rounded-2xl overflow-hidden shadow-lg border border-gray-700">
            <video
              id="localVideo"
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-gray-800/70 text-xs sm:text-sm px-3 py-1 rounded-lg">
              You (Interviewer)
            </div>
          </div>

          <div className="relative bg-black rounded-2xl overflow-hidden shadow-lg border border-gray-700">
            <video
              id="remoteVideo"
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-gray-800/70 text-xs sm:text-sm px-3 py-1 rounded-lg">
              Candidate
            </div>
          </div>
        </div>

        {/* CONTROL BUTTONS */}
        <div className="hidden lg:flex justify-center flex-wrap gap-4 mt-4 pb-3 sticky bottom-0 bg-gray-200 dark:bg-gray-900/60 backdrop-blur-md py-3 rounded-xl border-t border-gray-800">
          <button className="bg-red-600 hover:bg-red-700 px-5 py-2 cursor-pointer rounded-full flex items-center gap-2 shadow-md transition-all text-base" onClick={handleCutCall}>
            <PhoneCall className="m-1 p-1" /> End Call
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 px-5 py-2 cursor-pointer rounded-full flex items-center gap-2 transition-all text-base" onClick={handleMuteAndUnmute}>
            {isMuted ? < MicOff/> : <Mic />}
            <span>{isMuted ? "Unmute" : "Mute"}</span>

          </button>
          <button className={` ${isScreenSharing ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"} px-5 py-2 cursor-pointer rounded-full flex items-center gap-2 transition-all text-base`} onClick={isScreenSharing ?  handleStopScreenShare : handleScreenShare}>
            {isScreenSharing ? <ScreenShare className="m-1 p-1" /> : <ScreenShareOff className="m-1 p-1"/>}
            <span>{isScreenSharing ? "Stop Sharing" : "Share Screen"}</span>
          </button>
        </div>

        {/* Floating Chat Button for Small/Medium Screens */}
        <button
          onClick={() => setIsChatOpen(true)}
          className="lg:hidden fixed top-16 right-5 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-50"
        >
          <MessageSquare className="w-6 h-6" />
        </button>

        {/* Bottom control bar for mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 w-full flex justify-around items-center bg-gray-200 dark:bg-gray-900/95 border-t border-gray-800 py-2 z-40">
          <button className="text-red-100 hover:text-red-200 text-xl cursor-pointer bg-red-600 hover:bg-red-700 px-2 py-2 rounded-full" onClick={handleCutCall}>
            <PhoneCall />
          </button>
          <button
            onClick={handleMuteAndUnmute}
            className="text-gray-300 hover:text-white text-xl cursor-pointer bg-gray-700 hover:bg-gray-600 py-2 px-2 rounded-full"
          >
            {isMuted ? < MicOff/> : <Mic />}
          </button>

          <button className={`text-blue-100 hover:text-blue-200 cursor-pointer text-xl ${isScreenSharing ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"} py-2 px-2 rounded-full`} onClick={isScreenSharing ?  handleStopScreenShare : handleScreenShare}>
            {isScreenSharing ? <ScreenShare /> : <ScreenShareOff/>}
          </button>
        </div>
      </div>

      <div
        className={`
          fixed inset-y-0 right-0 w-full sm:w-2/3 md:w-1/2 lg:static lg:w-96
          flex flex-col bg-gray-200 dark:bg-gray-900/95 border-t lg:border-t-0 lg:border-l border-gray-800 backdrop-blur-md
          transform transition-transform duration-300 ease-in-out
          ${isChatOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
          z-50 lg:z-auto
        `}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-800 bg-gray-50 dark:bg-gray-950/50 lg:hidden">
          <h2 className="text-base sm:text-lg font-semibold text-blue-400">
            💬 Chat & Feedback
          </h2>
          <button
            onClick={() => setIsChatOpen(false)}
            className="dark:text-gray-300 text-gray-900 hover:text-black dark:hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* CHAT */}
        <div className="flex-1 p-4 overflow-y-auto scrollbar-hide">
          <ChatMessages messages={messages} scrollRef={scrollRef} user={null} />
        </div>

        {/* INPUT */}
        <div className="p-3 border-t border-gray-800 flex items-center space-x-2 bg-gray-200 dark:bg-gray-950/50 sticky bottom-0">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 rounded-xl bg-gray-100 dark:text-white text-black dark:bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 px-3 sm:px-4 py-2 rounded-xl transition text-sm sm:text-base"
          >
            ➤
          </button>
        </div>

        {/* FEEDBACK */}
        <FeedBack interviewId={interviewSelected?.id!}/>
      </div>
    </div>
  );
};

export default InterViewConsole;
