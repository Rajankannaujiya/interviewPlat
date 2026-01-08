import { useNavigate } from "react-router-dom";
import { Interview } from "../types/interview";
import { NormalAvatar, ProfileAvatar } from "./Navbar";

type AllMeetingProps = {
  data: Interview[];
};

const AllMeetings = ({ data }: AllMeetingProps) => {

  const navigate = useNavigate();
  return (
    <div className="p-6 bg-light-background rounded dark:bg-[#353839] shadow-sm">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-50">All Scheduled Interviews</h2>

      <div className="m-3 max-w-full" onClick={()=>navigate("/interview/update")}> {/* Positioning the button */}
        <button className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75">
            Want to Cancell Any Interview
        </button>
      </div>

      {data.length === 0 ? (
        <p className="text-gray-500">No interviews scheduled.</p>
      ) : (
        <div className="max-h-[500px] overflow-y-auto pr-2 overflow-hidden">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((interview) => {
            const date = new Date(interview.scheduledTime);
            const formattedDate = date.toLocaleDateString();
            const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <div
                key={interview.id}
                className="bg-light-background dark:bg-dark-background shadow-sm rounded-lg p-5 border border-bahia-600 dark:border-bahia-200 hover:shadow-md transition-shadow dark:hover:bg-gray-800 hover:bg-gray-100 duration-300"
              >
                {/* Candidate Info */}
                <div className="flex items-center gap-4 mb-4">
                  {interview.candidate.profileUrl ? <ProfileAvatar className="w-10 h-10 rounded-full" isnavbar={false} imgUrl={interview.candidate.profileUrl} /> : <NormalAvatar className="w-10 h-10" isnavbar={false}/> }
                  <div>
                    <h3 className="text-lg font-medium text-bahia-700 dark:text-bahia-300">
                      Candidate: {interview.candidate.username}
                    </h3>
                    <p className="text-sm text-bahia-950 dark:text-bahia-500">
                      Status: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{interview.status}</span>
                    </p>
                  </div>
                </div>

                {/* Time Info */}
                <div className="mb-4">
                  <p className="text-md text-gray-700 dark:text-indigo-400">
                    <strong className="text-gray-600 dark:text-bahia-300">Date:</strong> {formattedDate}
                  </p>
                  <p className="text-md text-gray-700 dark:text-indigo-400">
                    <strong className="text-gray-600 dark:text-bahia-300">Time:</strong> {formattedTime}
                  </p>
                </div>

                <hr className="my-4 border-bahia-800 dark:border-bahia-400" />

                {/* Interviewer Info */}
                <div className="flex items-center gap-4">
                  {interview.interviewr.profileUrl ? <ProfileAvatar className="w-10 h-10 rounded-full" isnavbar={false} imgUrl={interview.interviewr.profileUrl} /> : <NormalAvatar className="w-10 h-10" isnavbar={false} /> }
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-bahia-300">
                      Interviewer: {interview.interviewr.username}
                    </h4>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      )}
    </div>
  );
};

export default AllMeetings;
