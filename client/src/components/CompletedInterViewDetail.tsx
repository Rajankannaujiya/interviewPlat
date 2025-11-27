import { useState } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "../state/hook";
import { useGetAllMyInterviewsQuery } from "../state/api/interview";
import { MessageSquare, Star, Clock, User } from "lucide-react";
import Loading from "../components/Loading";
import Card from "../components/Card";
import { Interview } from "../types/interview";


const CompletedInterviewDetails = () => {
  const userAuthState = useAppSelector((state) => state.auth);

  if (!userAuthState || (!userAuthState.isAuthenticated && !userAuthState.user)) {
    toast.error("☠️ Please login");
  }

  const { data, isError, isLoading } = useGetAllMyInterviewsQuery(
    { userId: userAuthState.user?.id! },
    { skip: !userAuthState.isAuthenticated || !userAuthState.user?.id }
  );

  const completedInterviews = data?.myinterviews?.filter(
    (i) => i.status === "COMPLETED"
  );

  let extendedInterviews:Interview[] =[];
  if (completedInterviews && completedInterviews.length > 0) {
  extendedInterviews = [
    ...completedInterviews,
    ...Array(9).fill(completedInterviews[0])
  ];
  // Now use extendedInterviews instead of completedInterviews
}

  const [openId, setOpenId] = useState<string | null>(null);

  if (isLoading) return <Loading />;
  if (isError)
    return <p className="text-center text-red-500">Failed to load interviews.</p>;

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
        {extendedInterviews.map((interview) => (
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
                {interview.feedback ? (
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="text-yellow-500" size={18} />
                      <h3 className="font-medium text-gray-700 dark:text-gray-200">
                        Feedback
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Rating:</strong> {interview.feedback.rating}/5
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Note:</strong> {interview.feedback.note}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-400 italic">No feedback provided.</p>
                )}

                {/* Comments Section */}
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="text-blue-500" size={18} />
                    <h3 className="font-medium text-gray-700 dark:text-gray-200">
                      Comments
                    </h3>
                  </div>
                  {interview.Comment.length > 0 ? (
                    <ul className="space-y-2">
                      {interview.Comment.map((comment:any) => (
                        <li
                          key={comment.id}
                          className="p-2 border-l-4 border-blue-400 bg-white dark:bg-gray-900 rounded-md shadow-sm"
                        >
                          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-300">
                            <div className="flex items-center gap-1">
                              <User size={14} />
                              {comment?.author?.username || "Anonymous"}
                            </div>
                            <span>
                              {new Date(comment.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-100 mt-1">
                            {comment.content}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 italic">No comments available.</p>
                  )}
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
