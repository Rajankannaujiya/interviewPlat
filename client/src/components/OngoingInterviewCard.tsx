import { useEffect, useState, useRef, useMemo } from "react";
import { useGetAllMyInterviewsQuery, useUpdateInterviewStatusMutation } from "../state/api/interview";
import { useAppDispatch, useAppSelector } from "../state/hook";
import { toast } from "react-toastify";
import { Interview } from "../types/interview";
import { useNavigate } from "react-router-dom";
import { handleJoinInterView, handleWebRTCMessageEvent } from "../pages/Interviewer/webrtc/Signalling";
import { WsInstance } from "../ws/websocket";
import { setSelectedInterviewId } from "../state/slices/chatSlice";

const OngoingInterviewCard = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [now, setNow] = useState(new Date());
  const [currentSelectInterviewId, setCurrentSelectedInterviewId] = useState<string | null>(null);

  // Track which interviews have scheduled timers to prevent duplicates
  const scheduledTimers = useRef<Set<string>>(new Set());

  const { data, isError, isLoading } = useGetAllMyInterviewsQuery(
    { userId: user?.id! },
    { skip: !isAuthenticated }
  );

  const [updateInterviewStatus] = useUpdateInterviewStatusMutation();

  // Update 'now' every second for countdowns
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Dispatch selected interview ID to store
  useEffect(() => {
    if (currentSelectInterviewId) {
      dispatch(setSelectedInterviewId(currentSelectInterviewId));
    }
  }, [currentSelectInterviewId, dispatch]);

  // Handle user authentication
  if (!isAuthenticated || !user) {
    toast.error("☠️ Please login");
    return null;
  }

  if (isError) {
    toast.error("An error occurred while fetching interviews");
    return null;
  }

  const allInterviews: Interview[] = data?.myinterviews || [];

  // ------------ STATUS AUTO-UPDATES ------------
  useEffect(() => {
    allInterviews.forEach((interview) => {
      if (!interview.scheduledTime) return;
      if (scheduledTimers.current.has(interview.id)) return;

      scheduledTimers.current.add(interview.id);

      const start = new Date(interview.scheduledTime).getTime();
      const end = start + 2 * 60 * 60 * 1000; // 2 hours duration

      const nowTime = Date.now();

      // Schedule ONGOING status update
      if (interview.status === "SCHEDULED" && start > nowTime) {
        const msUntilStart = start - nowTime;
        setTimeout(async () => {
          try {
            await updateInterviewStatus({ interviewId: interview.id, status: "ONGOING", updateAll: false }).unwrap();
            toast.info(`Interview ${interview.id} is now ONGOING`);
          } catch (err) {
            console.error(err);
          }
        }, msUntilStart);
      }

      // Schedule COMPLETED status update
      if (["SCHEDULED", "ONGOING"].includes(interview.status) && end > nowTime) {
        const msUntilEnd = end - nowTime;
        setTimeout(async () => {
          try {
            await updateInterviewStatus({ interviewId: interview.id, status: "COMPLETED", updateAll: false }).unwrap();
            toast.success(`Interview ${interview.id} is now COMPLETED`);
          } catch (err) {
            console.error(err);
          }
        }, msUntilEnd);
      }
    });
  }, [allInterviews, updateInterviewStatus]);

  // ------------ FILTER INTERVIEWS ------------
  const sortedInterviews = useMemo(() => {
    return allInterviews
      .filter((i) => ["SCHEDULED", "ONGOING"].includes(i.status))
      .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());
  }, [allInterviews]);

  const ongoingInterviews = useMemo(() => {
    return sortedInterviews.filter((i) => {
      const start = new Date(i.scheduledTime).getTime();
      const end = start + 60 * 60 * 1000; // 1-hour default duration for display
      return now.getTime() >= start && now.getTime() <= end;
    });
  }, [sortedInterviews, now]);

  const nextUpcoming = useMemo(() => {
    return sortedInterviews.find((i) => new Date(i.scheduledTime).getTime() > now.getTime());
  }, [sortedInterviews, now]);

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

  // ------------ HANDLE JOIN ------------
  const handleNavigateToRoom = async (userId: string | undefined, interviewId: string, interviewerId: string) => {
    if (!userId || !interviewId || !interviewerId) return;

    setCurrentSelectedInterviewId(interviewId);
    await WsInstance.connectWs("ws://localhost:3000", userId);

    const isSocketOpen = await new Promise<boolean>((resolve) => {
      const checkConnection = setInterval(() => {
        if (WsInstance["socket"]?.readyState === WebSocket.OPEN) {
          clearInterval(checkConnection);
          resolve(true);
        }
      }, 100);
    });

    if (isSocketOpen) {
      handleJoinInterView(userId, interviewId, WsInstance);
      WsInstance.onMessage((data) => handleWebRTCMessageEvent(data, interviewerId, WsInstance));
      navigate(`/interviewer/${interviewId}`);
    } else {
      console.error("Failed to open WebSocket connection.");
    }
  };

  // ------------ RENDER ------------
  return (
    <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6 m-4">
      {/* Left: Ongoing */}
      <div className="flex-1 flex flex-col gap-4">
        <h2 className="font-bold text-xl text-gray-800 dark:text-gray-50">Ongoing Interviews</h2>
        {ongoingInterviews.length > 0 ? (
          ongoingInterviews.map((interview) => (
            <div
              key={interview.id}
              className="p-4 rounded-xl border flex justify-between items-center bg-green-50 dark:bg-green-900/30 border-green-400 shadow hover:shadow-md cursor-pointer transition"
              onClick={() => handleNavigateToRoom(user?.id, interview.id, interview.interviewerId)}
            >
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-50">
                  {interview.title || "Untitled Interview"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {interview.candidate.username} with {interview.interviewr.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(interview.scheduledTime).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-green-600 text-white">
                  ONGOING
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">No ongoing interviews</p>
        )}
      </div>

      {/* Right: Next Upcoming */}
      {nextUpcoming && (
        <div className="w-full md:w-1/3 p-4 rounded-xl border bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 shadow">
          <h2 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-50">Next Interview</h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-50">
                {nextUpcoming.title || "Untitled Interview"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {nextUpcoming.candidate.username} with {nextUpcoming.interviewr.username}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(nextUpcoming.scheduledTime).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-yellow-600 text-white">
                {getRemainingTime(nextUpcoming.scheduledTime).diff <= 0 ? "Join Now" : "Next"}
              </span>
              <p className="text-xs mt-1 text-green-600 dark:text-green-400">
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
