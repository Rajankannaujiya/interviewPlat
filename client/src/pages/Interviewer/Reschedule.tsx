import { useState } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "../../state/hook";
import {
  useGetAllMyInterviewsQuery,
  useRescheduleInterviewMutation,
} from "../../state/api/interview";

const RescheduleInterview = () => {
  const user = useAppSelector((state) => state.auth.user);

  const [selectedInterview, setSelectedInterview] = useState("");
  const [title, setTitle] = useState("");
  const [newDateTime, setNewDateTime] = useState("");

  const { data: interviews, isLoading: isFetching } =
    useGetAllMyInterviewsQuery({ userId: user?.id! },{skip: !user?.id});

  const [rescheduleInterview, { isLoading }] =
    useRescheduleInterviewMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedInterview || !newDateTime) {
      toast.error("Please choose an interview and new date/time");
      return;
    }

    try {
      await rescheduleInterview({data:{
        interviewId: selectedInterview,
        newDateTime,
        title,
    }}).unwrap();

      toast.success("Interview successfully rescheduled!");

      setSelectedInterview("");
      setNewDateTime("");
      setTitle("");
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to reschedule");
    }
  };

  return (
    <div className="flex justify-center items-center py-10 dark:bg-dark-background bg-light-background">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-800 rounded-2xl p-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
          Reschedule Interview
        </h2>

        {isFetching ? (
          <p className="text-gray-600 dark:text-gray-300">Loading interviews...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Select Interview */}
            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-300 font-semibold">
                Select Interview
              </label>
              <select
                value={selectedInterview}
                onChange={(e) => {
                  setSelectedInterview(e.target.value);
                  const interview = interviews?.myinterviews?.find(
                    (i: any) => i.id === e.target.value
                  );
                  setTitle(interview?.title || "");
                }}
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 
                dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500"
              >
                <option value="">-- Choose Interview --</option>

                {interviews?.myinterviews?.map((interview: any) => (
                  <option key={interview.id} value={interview.id}>
                    {interview.title} — {new Date(interview.scheduledTime).toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Edit Title (optional) */}
            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-300 font-semibold">
                Title (optional)
              </label>
              <input
                type="text"
                value={title}
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 
                bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 
                focus:ring-blue-500"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Update title if needed"
              />
            </div>

            {/* New Date & Time */}
            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-300 font-semibold">
                New Date & Time
              </label>
              <input
                type="datetime-local"
                value={newDateTime}
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 
                dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-400"
                onChange={(e) => setNewDateTime(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 mt-2 rounded-xl bg-purple-600 hover:bg-purple-700 
              dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-semibold transition-all 
              shadow-md disabled:opacity-70"
            >
              {isLoading ? "Rescheduling..." : "Reschedule Interview"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RescheduleInterview;
