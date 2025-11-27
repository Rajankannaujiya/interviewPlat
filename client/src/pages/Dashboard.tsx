import { toast } from "react-toastify"
import { CustomCenter } from "../components/CustomComp"
import { useGetAllMyInterviewsQuery } from "../state/api/interview"
import { useAppSelector } from "../state/hook"
import AllMeetings from "../components/AllMeetings"
import Graph from "../components/Graph"
import Card from "../components/Card"
import Loading from "../components/Loading"
import OngoingInterviewCard from "../components/OngoingInterviewCard"


const Dashboard = () => {

  const userAuthState = useAppSelector(state=>state.auth);

  if(!userAuthState.isAuthenticated && !userAuthState.user) {
    toast.error("☠️ Please login");
  }

const {data, isError, isLoading} = useGetAllMyInterviewsQuery({userId: userAuthState.user?.id!}, {skip: !userAuthState.isAuthenticated || !userAuthState.user?.id });


const noOfInterviewTaken: number = data?.myinterviews
  ? data.myinterviews.filter(
      (interview) => interview.status==="COMPLETED" && interview.interviewerId === userAuthState.user?.id
    ).length
  : 0;

const noOfInterviewsAttended: number = data?.myinterviews
  ? data.myinterviews.filter(
      (interview) => interview.candidateId === userAuthState.user?.id
    ).length
  : 0;
const myinterviewCount:number = data?.myinterviews ? data?.myinterviews.length : 0;

if(isError){
  toast.error("An error occured while fetching the data");
  return;
}

  return (
    <CustomCenter className="flex justify-center items-center w-full min-h-screen dark:bg-dark-background bg-light-background dark:text-gray-100">
      {isLoading ? (
      <div className="flex justify-center items-center min-h-screen w-full dark:bg-dark-background bg-light-background">
        <Loading />
      </div>
    ):
      <div className="flex flex-col w-full lg:w-full h-[94vh] p-2 gap-3 overflow-auto">
        <div className="flex flex-col p-3 sm:m-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 justify-center h-fit gap-2 sm:gap-4 w-full mb-3 rounded shadow-sm dark:bg-[#353839]">

          <Card>
            <div className="flex flex-col space-y-2 w-full">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-900 dark:border-white">Number of interviews attended</h2>
              <strong className="text-gray-800 dark:text-gray-200 text-xl leading-relaxed">content={noOfInterviewsAttended ? noOfInterviewsAttended : 0}</strong>
            </div>
          </Card>

          <Card>
            <div className="flex flex-col space-y-2 w-full">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-900 dark:border-white">Number of interviews taken</h2>
              <strong className="text-gray-800 dark:text-gray-200 text-xl leading-relaxed">content={noOfInterviewTaken? noOfInterviewTaken : 0}</strong>
            </div>
          </Card>

          <Card>
            <div className="flex flex-col space-y-2 w-full">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-900 dark:border-white">Total interview Count</h2>
              <strong className="text-gray-800 dark:text-gray-200 text-xl leading-relaxed">{myinterviewCount}</strong>
            </div>
          </Card>
        </div>

    <OngoingInterviewCard />
        <div className="text-dark-background bg-white">
          {data && <Graph data={data?.myinterviews} />}
        </div>
        <div className="flex flex-col text-black mb-5">
          {data && <AllMeetings data={data?.myinterviews} />}
        </div>

      </div>}
    </CustomCenter>
  )
}

export default Dashboard