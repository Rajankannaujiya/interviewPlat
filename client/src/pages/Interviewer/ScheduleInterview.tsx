import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useCreateInterviewMutation,
  useGetAllCandidateQuery,
} from "../../state/api/interview";
import { CustomCenter } from "../../components/CustomComp";
import { useAppSelector } from "../../state/hook";

type Props = {};

const ScheduleInterview = (props: Props) => {
  const [title, setTitle] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCandidateName, setSelectedCandidateName] = useState("");

  const { data: candidates, isError } = useGetAllCandidateQuery();

  const [createInterview, { isLoading }] = useCreateInterviewMutation();
  const user = useAppSelector((state) => state.auth.user);

  // Error handling for API
  useEffect(() => {
    if (isError) {
      toast.error("Failed to load candidate list");
    }
  }, [isError]);

  const filteredCandidates =
    candidates?.filter(
      (c: any) =>
        c.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !user || !candidateId || !scheduledTime) {
      toast.error("Please fill all fields");
      return;
    }

    let interviewerId = null;

    if (user && user.role?.includes("INTERVIEWER")) {
      interviewerId = user.id;
    }

    if (!interviewerId) {
      toast.error("Please login as interviewer to schedule interview");
      return;
    }

    try {
      const res = await createInterview({data:{
        title,
        interviewerId,
        candidateId,
        scheduledTime,
      }}).unwrap();

      toast.success("Interview scheduled successfully!");

      setTitle("");
      setCandidateId("");
      setSelectedCandidateName("");
      setScheduledTime("");
      setSearchQuery("");
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to schedule interview");
    }
  };

  return (
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-800 rounded-2xl p-8 transition-all">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
          Schedule Interview
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300 font-semibold">
              Interview Title
            </label>
            <input
              type="text"
              value={title}
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Technical Round"
            />
          </div>

          {/* Candidate Search */}
          <div className="relative">
            <label className="block mb-1 text-gray-700 dark:text-gray-300 font-semibold">
              Select Candidate
            </label>

            <input
              type="text"
              value={candidateId ? selectedCandidateName : searchQuery}
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 transition-all"
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCandidateId("");
                setSelectedCandidateName("");
              }}
              placeholder="Search candidate by name or email"
            />

            {/* Dropdown */}
            {searchQuery.length > 1 &&
              filteredCandidates.length > 0 &&
              !candidateId && (
                <ul className="absolute mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-y-auto z-20">
                  {filteredCandidates.map((user: any) => (
                    <li
                      key={user.id}
                      onClick={() => {
                        setCandidateId(user.id);
                        setSelectedCandidateName(user.username);
                        setSearchQuery("");
                      }}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                    >
                      <div className="font-medium">{user.username}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </li>
                  ))}
                </ul>
              )}

            {/* No results */}
            {searchQuery.length > 1 &&
              filteredCandidates.length === 0 &&
              !candidateId && (
                <div className="absolute mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg px-4 py-3 text-gray-500 dark:text-gray-400">
                  No matching candidates
                </div>
              )}
          </div>

          {/* Date/Time */}
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300 font-semibold">
              Scheduled Time
            </label>
            <input
              type="datetime-local"
              value={scheduledTime}
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-400 transition-all"
              onChange={(e) => setScheduledTime(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold transition-all shadow-md disabled:opacity-70"
          >
            {isLoading ? "Scheduling..." : "Schedule Interview"}
          </button>
        </form>
      </div>
  );
};

export default ScheduleInterview;
