import { useGetAllMyInterviewsQuery } from '../../state/api/interview';
import { useAppSelector } from '../../state/hook';
import { toast } from 'react-toastify';
import { Interview } from '../../types/interview';
import AllMeetings from '../../components/AllMeetings';
import Graph from '../../components/Graph';
import { CustomCenter } from '../../components/CustomComp';
import OngoingInterviewCard from '../../components/OngoingInterviewCard';

const InterviewerDashboard = () => {
  const userAuthState = useAppSelector(state => state.auth);

  // If user not authenticated, return early
  if (!userAuthState?.isAuthenticated || !userAuthState.user) {
    toast.error("☠️ Please login");
    return <div className="flex justify-center items-center min-h-screen">Please login</div>;
  }

  const { data, isError, isLoading } = useGetAllMyInterviewsQuery(
    { userId: userAuthState.user?.id },
    { skip: !userAuthState.isAuthenticated || !userAuthState.user?.id }
  );

  if (isLoading) return <div>Loading...</div>;
  if (isError) {
    toast.error("An error occured while fetching the data");
    return <div className="text-center text-red-500">Failed to load data</div>;
  }

  const interviews: Interview[] = data?.myinterviews || [];
  const ScheduledInterViews = interviews.filter(i => i.status === "SCHEDULED");

  return (
   <CustomCenter className="flex flex-col justify-start items-center w-full h-screen overflow-y-auto scrollbar-hide dark:bg-dark-background bg-light-background dark:text-gray-100 px-2 sm:px-4 ">

      {/* Ongoing Interviews */}
      <OngoingInterviewCard />

      {/* Graph Section */}
      <Graph data={[]} />
      {/* Scheduled Interviews */}
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl mb-20">
        <div className="flex items-center justify-between mb-6 border-b pb-3 border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Scheduled Interviews
          </h1>
          <span className="text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full">
            {ScheduledInterViews.length} to Attend
          </span>
        </div>

        {ScheduledInterViews.length > 0 ? (
          <AllMeetings data={ScheduledInterViews} />
        ) : (
          <NoDataPlaceholder />
        )}
      </div>
    </CustomCenter>
  );
};

export default InterviewerDashboard;

const NoDataPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-16 h-16 mb-4 text-gray-400"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 7h8m-8 4h4m-6 7h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v9a2 2 0 002 2z"
        />
      </svg>
      <p className="text-lg font-medium">No interviews found</p>
    </div>
  );
};
