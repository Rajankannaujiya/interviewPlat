import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "../state/hook";
import {
  useGetAllMyInterviewsQuery,
  useGetInterviewFeebBackQuery,
} from "../state/api/interview";
import { MessageSquare, Star, Clock } from "lucide-react";
import Loading from "../components/Loading";
import Card from "../components/Card";
import { Interview } from "../types/interview";
import { Feedback } from "../types/notification";
import Comment, { CommentItem } from "./Comment";

const CompletedInterviewDetails = () => {

  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const userAuthState = useAppSelector((state) => state.auth);

  if (!userAuthState || !userAuthState.isAuthenticated || !userAuthState.user) {
    toast.error("☠️ Please login");
  }

  // Fetch interviews
  const { data, isError, isLoading } = useGetAllMyInterviewsQuery(
    { userId: userAuthState.user?.id! },
    { skip: !userAuthState.isAuthenticated || !userAuthState.user?.id }
  );

  const completedInterviews = data?.myinterviews?.filter(
    (i: Interview) => i.status === "COMPLETED"
  );

  completedInterviews?.map(i=>console.log("completed interview",i))
  const [openId, setOpenId] = useState<string | null>(null);

  // Fetch feedback dynamically for each open item
  const { data: feedbackData, isLoading: isFeedbackLoading } =
    useGetInterviewFeebBackQuery(
      { interviewId: openId || "" },
      { skip: !openId }
    );

  useEffect(() => {
  if (feedbackData) {
    setSelectedFeedback(feedbackData);
  }
}, [feedbackData]);

console.log(selectedFeedback);
  if (isLoading || isFeedbackLoading) return <Loading />;
  if (isError )
    return (
      <p className="text-center text-red-500">Failed to load interviews.</p>
    );
  if (!completedInterviews || completedInterviews.length === 0)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        No completed interviews yet.
      </div>
    );

  return (
    <div className="p-4 max-w-5xl md:w-full  mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Completed Interviews
      </h1>

      <div className="space-y-4 overflow-auto max-h-[80vh] scrollbar-hide pr-2">
        {completedInterviews.map((interview) => (
          <Card
            key={interview.id + Math.random()}
            className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm dark:bg-gray-900 bg-white transition-all hover:shadow-md"
          >
            {/* Header */}
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() =>
                setOpenId(openId === interview.id ? null : interview.id)
              }
            >
              <div>
                <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-50">
                  {interview.title || "Untitled Interview"}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  Between{" "}
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {interview.candidate.username}
                  </span>{" "}
                  and{" "}
                  <span className="font-medium text-purple-600 dark:text-purple-400">
                    {interview.interviewr.username}
                  </span>
                </p>
              </div>

              <div className="text-sm text-gray-500 flex items-center gap-2">
                <Clock size={16} />
                {new Date(interview.scheduledTime).toLocaleString()}
              </div>
            </div>

            {/* Expanded Details */}
            {openId === interview.id && (
              <div className="mt-4 border-t pt-4 space-y-3">
                {/* Feedback Section */}
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="text-yellow-500" size={18} />
                    <h3 className="font-medium text-gray-700 dark:text-gray-200">
                      Feedback
                    </h3>
                  </div>

                  {isFeedbackLoading ? (
                    <p className="text-gray-400 italic">Loading feedback…</p>
                  ) : selectedFeedback && selectedFeedback.interview?.feedback ? (
                    <>
                      <p className="text-gray-600 dark:text-gray-300">
                        <strong>Rating:</strong> {selectedFeedback?.interview?.feedback.rating}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        <strong>Note:</strong> {selectedFeedback.interview?.feedback.note}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-400 italic">No feedback provided.</p>
                  )}
                </div>

                {/* Comments Section */}
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="text-blue-500" size={18} />
                    <h3 className="font-medium text-gray-700 dark:text-gray-200">
                      Comments
                    </h3>
                  </div>

                  {interview.Comment.length > 0 ? (
    <ul className="space-y-2">
      {interview.Comment.map((comment: any) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          interview={interview}
          loggedInUserId={userAuthState.user?.id!}
        />
      ))}
    </ul>
  ) : (
    <p className="text-gray-400 italic">No comments available.</p>
  )}

                  <Comment interviewId={openId} authorId={userAuthState.user?.id!} />
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CompletedInterviewDetails;
