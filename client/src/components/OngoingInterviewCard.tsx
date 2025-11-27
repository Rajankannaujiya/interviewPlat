import React from "react";
import { useGetAllMyInterviewsQuery } from "../state/api/interview";
import { useAppSelector } from "../state/hook";
import { toast } from "react-toastify";
import { Interview } from "../types/interview";
import { useNavigate } from "react-router-dom";
import { handleJoinInterView, handleWebRTCMessageEvent } from "../pages/Interviewer/webrtc/Signalling";
import { WsInstance } from "../ws/websocket";

const OngoingInterviewCard = () => {
  const [now, setNow] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const navigate = useNavigate();

  const userAuthState = useAppSelector((state) => state.auth);

  if (!userAuthState.isAuthenticated && !userAuthState.user) {
    toast.error("☠️ Please login");
    return null;
  }

  const { data, isError } = useGetAllMyInterviewsQuery(
    { userId: userAuthState.user?.id! },
    { skip: !userAuthState.isAuthenticated || !userAuthState.user?.id }
  );

  if (isError) {
    toast.error("An error occurred while fetching the data");
    return null;
  }

  const allInterviews: Interview[] = data?.myinterviews || [];

  // Sort by scheduled time
  const sorted = allInterviews
    .filter((i) => i.status === "SCHEDULED" || i.status === "ONGOING")
    .sort(
      (a, b) =>
        new Date(a.scheduledTime).getTime() -
        new Date(b.scheduledTime).getTime()
    );

  // Ongoing interviews come first
  const ongoingInterviews = sorted.filter((i) => {
    const start = new Date(i.scheduledTime).getTime();
    const end = start + 60 * 60 * 1000; // assume 1 hour
    return now.getTime() >= start && now.getTime() <= end;
  });

  // Next upcoming interview (after all ongoing)
  const nextUpcoming = sorted.find((i) => {
    const start = new Date(i.scheduledTime).getTime();
    return start > now.getTime();
  });

  // Helper for countdown timer
  const getRemainingTime = (scheduledTime: string | Date) => {
    const diff = new Date(scheduledTime).getTime() - now.getTime();
    if (diff <= 0) return { text: "Live now", diff: 0 };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    let result = "";
    if (days > 0) result += `${days}d `;
    if (hours > 0 || days > 0) result += `${hours}h `;
    if (minutes > 0 || hours > 0 || days > 0) result += `${minutes}m `;
    result += `${seconds}s`;

    return { text: result, diff };
  };


 const handleNavigateToRoom = async (userId: string | undefined, interviewId: string, interviewerId: string) => {
  if (!userId || !interviewId || !interviewerId) {
    return;
  }

  await WsInstance.connectWs("ws://localhost:3000", userId);

  const isSocketOpen = await new Promise<boolean>((resolve) => {
    const checkConnection = setInterval(() => {
      if (WsInstance['socket']?.readyState === WebSocket.OPEN) {
        clearInterval(checkConnection);
        resolve(true);
      }
    }, 100);
  });

  if (isSocketOpen) {
    handleJoinInterView(userId, interviewId, WsInstance);

    // ✅ Correct way to register message handler
    WsInstance.onMessage((data) => handleWebRTCMessageEvent(data, interviewerId, WsInstance));

    navigate(`/interviewer/${interviewId}`);
  } else {
    console.error("Failed to open WebSocket connection.");
  }
};



  return (
    <div className="w-full max-w-5xl flex flex-col md:flex-row gap-4 m-4">
      {/* Left side: Ongoing Interviews */}
      <div className="flex-1 flex flex-col gap-3">
        <h2 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-50">
          Ongoing Interviews
        </h2>
        {sorted.length > 0 ? (
          sorted.map((interview) => (
            <div
              key={interview.id}
              className="p-4 rounded-xl border flex justify-between items-center bg-green-50 border-green-400 shadow-sm"
              onClick={()=> handleNavigateToRoom(userAuthState.user?.id,interview.id, interview.interviewerId)}
            >
              <div>
                <p className="font-semibold text-gray-800">
                  {interview.title || "Untitled Interview"}
                </p>
                <p className="text-sm text-gray-600">
                  {interview.candidate.username} with{" "}
                  {interview.interviewr.username}
                </p>
                <p className="text-xs text-gray-500 ">
                  {new Date(interview.scheduledTime).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-green-600 dark:text-white text-gray-700">
                  ONGOING 
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 italic">No ongoing interviews</p>
        )}
      </div>

      {/* Right side: Next Upcoming Interview */}
      {nextUpcoming && (
        <div className="w-full md:w-1/3 p-4 rounded-xl border bg-yellow-50 border-yellow-300 shadow-sm">
          <h2 className="font-semibold text-lg mb-2 text-gray-800">
            Next Interview
          </h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-800">
                {nextUpcoming.title || "Untitled Interview"}
              </p>
              <p className="text-sm text-gray-600">
                {nextUpcoming.candidate.username} with{" "}
                {nextUpcoming.interviewr.username}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(nextUpcoming.scheduledTime).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-yellow-600 text-white">
                {getRemainingTime(nextUpcoming.scheduledTime).diff <= 0
                  ? "Join Now"
                  : "Next"}
              </span>
              <p className="text-xs mt-1 text-green-600">
                {getRemainingTime(nextUpcoming.scheduledTime).text}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OngoingInterviewCard;
