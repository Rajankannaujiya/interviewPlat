import { CustomCenter } from "../../components/CustomComp";
import RescheduleInterview from "./Reschedule";
import ScheduleInterview from "./ScheduleInterview";

const InterviewConstruct = () => {
  return (
<CustomCenter className="flex flex-col justify-start items-center w-full h-screen overflow-y-auto scrollbar-hide dark:bg-dark-background bg-light-background dark:text-gray-100 p-4">
      <div className="w-full m-4 mb-12 md:mb-4 max-w-7xl flex flex-col md:flex-row gap-10 md:gap-6 justify-center items-start">

        {/* Schedule Box */}
        <div className="w-full md:w-1/2 bg-white dark:bg-gray-900 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
          <h2 className="text-2xl font-bold mb-5 text-gray-800 dark:text-gray-100">
            Schedule Interview
          </h2>
          <ScheduleInterview />
        </div>

        {/* Reschedule Box */}
        <div className="w-full md:w-1/2 bg-white dark:bg-gray-900 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
          <h2 className="text-2xl font-bold mb-5 text-gray-800 dark:text-gray-100">
            Reschedule Interview
          </h2>
          <RescheduleInterview />
        </div>

      </div>

  </CustomCenter>
  );
};

export default InterviewConstruct;
