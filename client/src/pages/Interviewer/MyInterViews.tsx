import { Calendar, CheckCircle, RefreshCcw, PlayCircle } from "lucide-react";
import { Interview } from "../../types/interview";
import { useGetAllMyInterviewsQuery } from "../../state/api/interview";
import { useAppSelector } from "../../state/hook";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import Card from "../../components/Card";
import { CustomCenter } from "../../components/CustomComp";
import CompletedInterviewDetails from "../../components/CompletedInterViewDetail";

const MyInterviews = () => {
  const userAuthState = useAppSelector((state) => state.auth);

  if (!userAuthState || (!userAuthState.isAuthenticated && !userAuthState.user)) {
    toast.error("☠️ Please login");
  }

  const { data, isError, isLoading } = useGetAllMyInterviewsQuery(
    { userId: userAuthState.user?.id! },
    { skip: !userAuthState.isAuthenticated || !userAuthState.user?.id }
  );

  if (isLoading) return <Loading />;
  if (isError) return  <CustomCenter className="flex flex-col justify-start w-full overflow-auto scroll-auto min-h-screen dark:bg-dark-background bg-light-background dark:text-gray-100 px-2 sm:px-4">
    <p className="text-center text-red-500">Failed to load interviews.</p>
    </CustomCenter>;

  const allInterviews = data?.myinterviews || [];

  const scheduled = allInterviews.filter((i) => i.status === "SCHEDULED");
  const completed = allInterviews.filter((i) => i.status === "COMPLETED");
  const cancelled = allInterviews.filter((i) => i.status === "CANCELLED");
  const ongoing = allInterviews.filter((i) => i.status === "ONGOING");

  const renderSection = (
    title: string,
    icon: any,
    color: any,
    interviews: Interview[],
    highlightOngoing = false
  ) => (
    <Card className="bg-light-background rounded-2xl shadow-md p-5 m-2 border dark:bg-dark-background border-gray-100 hover:shadow-lg transition-all">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 border-b pb-2">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-lg font-semibold dark:text-gray-100 text-gray-800">{title}</h2>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${color.bg} ${color.text}`}
        >
          {interviews?.length}
        </span>
      </div>

      {/* Section Content */}
      <div className="max-h-[400px] overflow-y-auto pr-2">
        {interviews.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">No interviews found.</p>
        ) : (
          <div className="space-y-3">
            {interviews.map((interview: Interview) => (
              <div
                key={interview.id}
                className={`p-4 rounded-xl border flex justify-between items-center transition-all cursor-pointer ${
                  highlightOngoing
                    ? "bg-green-50 border-green-400 shadow-sm animate-pulse"
                    : "hover:bg-gray-50 dark:hover:bg-gray-900"
                }`}
              >
                {/* Left Section */}
                <div className="dark:text-gray-50">
                  <p className="font-semibold dark:text-gray-50 text-gray-800">
                    {interview.title || "Untitled Interview"}
                  </p>
                  <p className="text-sm dark:text-gray-100 text-gray-500">
                    {interview.candidate.username} with {interview.interviewr.username}
                  </p>
                  <p className="text-xs dark:text-gray-200 text-gray-400">
                    {new Date(interview.scheduledTime).toLocaleString()}
                  </p>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                    interview.status === "ONGOING"
                      ? "bg-green-600 text-white"
                      : interview.status === "COMPLETED"
                      ? "bg-gray-200 text-gray-700"
                      : interview.status === "SCHEDULED"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {interview.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <CustomCenter className="flex flex-col justify-start w-full max-h-screen overflow-y-auto scrollbar-hide dark:bg-dark-background bg-light-background dark:text-gray-100 px-2 sm:px-4">


      <h1 className="text-2xl font-bold dark:text-gray-100 text-gray-800 mb-6">
        My Interviews
      </h1>

     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
    {renderSection("Ongoing Interviews", <PlayCircle className="text-green-600" size={22} />, { bg: "bg-green-100", text: "text-green-700" }, ongoing, true)}

    <details className="md:hidden">
      <summary className="cursor-pointer font-semibold text-blue-500">View Scheduled</summary>
      {renderSection("Scheduled Interviews", <Calendar className="text-blue-500" size={22} />, { bg: "bg-blue-100", text: "text-blue-700" }, scheduled)}
    </details>

    <details className="md:hidden">
      <summary className="cursor-pointer font-semibold text-gray-600">View Completed</summary>
      {renderSection("Completed Interviews", <CheckCircle className="text-gray-600" size={22} />, { bg: "bg-gray-100", text: "text-gray-700" }, completed)}
    </details>

    <details className="md:hidden">
      <summary className="cursor-pointer font-semibold text-yellow-600">View Cancelled</summary>
      {renderSection("Cancelled Interviews", <RefreshCcw className="text-yellow-500" size={22} />, { bg: "bg-yellow-100", text: "text-yellow-700" }, cancelled)}
    </details>

    {/* Visible on larger screens */}
    <div className="hidden md:block">{renderSection("Scheduled Interviews", <Calendar className="text-blue-500" size={22} />, { bg: "bg-blue-100", text: "text-blue-700" }, scheduled)}</div>
    <div className="hidden md:block">{renderSection("Completed Interviews", <CheckCircle className="text-gray-600" size={22} />, { bg: "bg-gray-100", text: "text-gray-700" }, completed)}</div>
    <div className="hidden md:block">{renderSection("Cancelled Interviews", <RefreshCcw className="text-yellow-500" size={22} />, { bg: "bg-yellow-100", text: "text-yellow-700" }, cancelled)}</div>
  </div>


    <div className="w-full m-2 h-[1px] border-0 bg-gray-300 dark:bg-gray-700"></div>

      <div className="w-full mb-12">
          <p className="text-center text-sm text-gray-500 mt-2">
          Tip: Click on a completed interview to see its detailed summary.
          </p>
        
          <CompletedInterviewDetails />
      </div>
    </CustomCenter>
  );
};

export default MyInterviews;
