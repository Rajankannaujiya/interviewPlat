import { toast } from "react-toastify";
import {
  useGetAllMyInterviewsQuery,
  useUpdateInterviewStatusMutation,
} from "../state/api/interview";
import { useAppSelector } from "../state/hook";
import Loading from "./Loading";
import { TypeInterviewStatus } from "../types/interview";
import { useState } from "react";
import { CustomCenter } from "./CustomComp";

const UpdateInterview = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  console.log("user", user);

  const [showBulkModal, setShowBulkModal] = useState(false);

  if (!isAuthenticated || !user) {
    toast.error("User not authenticated");
    return (
      <div className="p-6 text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/40 rounded-md">
        User not authenticated
      </div>
    );
  }

  const { data, isError, isLoading } = useGetAllMyInterviewsQuery(
    { userId: user.id },
    { skip: !isAuthenticated }
  );

  const [updateInterviewStatus] = useUpdateInterviewStatusMutation();

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <p className="text-center text-red-500 dark:text-red-400 p-4">
        Failed to load interviews
      </p>
    );

  const scheduledInterviews =
    data?.myinterviews.filter((i) => i.status === "SCHEDULED") || [];

  // ------------ HANDLERS ------------
  const updateStatus = async (
    interviewId: string | null,
    status: TypeInterviewStatus,
    updateAll: boolean
  ) => {
    try {
      await updateInterviewStatus({ interviewId, status, updateAll }).unwrap();
      toast.success(
        updateAll ? "All interviews cancelled!" : "Interview cancelled!"
      );
    } catch (err) {
      console.error(err);
      toast.error(
        updateAll ? "Bulk cancel failed" : "Failed to cancel interview"
      );
    }
  };

  const handleSingleUpdate = (id: string) =>
    updateStatus(id, "CANCELLED", false);

  const handleBulkUpdate = () => {
    setShowBulkModal(false);
    updateStatus(null, "CANCELLED", true);
  };

  // ------------ UI ------------
  return (
    <CustomCenter className="flex-col w-full dark:bg-dark-background bg-light-background">
      <div className="w-full lg:max-w-6xl gap-2 m-4 ml-6">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-800 dark:text-gray-100">
        📋 Scheduled Interviews
      </h1>

      {/* Bulk Cancel Section */}
      {scheduledInterviews.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 sm:justify-between items-center">
          <p className="text-gray-600 dark:text-gray-300 mt-4 sm:m-0">
            You have{" "}
            <span className="font-semibold">{scheduledInterviews.length}</span>{" "}
            scheduled interviews.
          </p>

          <button
            onClick={() => setShowBulkModal(true)}
            className="px-6 m-3 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:brightness-110 transition-all cursor-pointer"
          >
            Cancel All Scheduled Interviews
          </button>
        </div>
      )}

<div className="flex bg-red-700 text-red-700 border-2 mb-4"></div>
      {/* Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 dark:bg-black/60 px-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md p-6 rounded-2xl shadow-2xl border dark:border-gray-700 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
              Are you sure?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              This action will <b>cancel all scheduled interviews</b>.
              Candidates will be automatically notified.
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowBulkModal(false)}
                className="px-5 py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Close
              </button>

              <button
                onClick={handleBulkUpdate}
                className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 shadow-lg transition dark:bg-red-700 dark:hover:bg-red-800"
              >
                Cancel All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interview List */}
      <div
        className="max-h-[70vh] overflow-y-auto pr-2 
                scrollbar-hide"
      >
        <div className="grid sm:grid-cols-2 gap-6">
          {scheduledInterviews.map((interview) => (
            <div
              key={interview.id}
              className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-md border
                   border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl
                   rounded-2xl p-6 transition-all hover:-translate-y-1"
            >
              <div className="space-y-2">
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    Interview ID:
                  </span>{" "}
                  {interview.id}
                </p>
                {user && user.role?.includes("INTERVIEWER") && (
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      Candidate:
                    </span>{" "}
                    {interview.candidate?.username}
                  </p>
                )}

                {user && user.role?.includes("CANDIDATE") && (
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      interviewer:
                    </span>{" "}
                    {interview.interviewr?.username}
                  </p>
                )}
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    Status:
                  </span>{" "}
                  {interview.status}
                </p>
              </div>

              <button
                onClick={() => handleSingleUpdate(interview.id)}
                className="mt-5 w-full px-4 py-2 bg-gradient-to-r 
                     from-red-500 to-red-600 text-white rounded-xl shadow 
                     hover:shadow-lg transition hover:brightness-110 cursor-pointer "
              >
                Cancel Interview
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* No Interviews */}
      {scheduledInterviews.length === 0 && (
        <p className="text-gray-600 dark:text-gray-400 text-center py-10 text-lg">
          No scheduled interviews found.
        </p>
      )}
      </div>
    </CustomCenter>
  );
};

export default UpdateInterview;
