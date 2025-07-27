import { User } from "../types/user";
import { useParams } from "react-router-dom";
import Card from "./Card";
import { useGetUserByIdQuery } from "../state/api/generic";
import { toast } from "react-toastify";

type Props = {
  user: User;
};
const Profile = ()=> {
    const {id} = useParams();
    if(!id){
      toast.error("user not found")
    }
    // const user = useAppSelector(state => state.auth.user)
    const {data:user, isError, isLoading} = useGetUserByIdQuery({userId:id!})

  return (
    <Card>
      <div className="flex flex-col w-full h-[calc(100vh-11px)] sm:flex-row items-center gap-6">
        <img
          src={user?.profileUrl || "https://imgs.search.brave.com/Oc9sVuKlCGSoesPOP0KlpJHuRrFrvAzdvJr6NdjUiQY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMTMv/NTc5LzgzNS9zbWFs/bC9iZXN0LW1hbmFn/ZXItY2hlZXJmdWwt/eW91bmctaGFuZHNv/bWUtbWFuLWluLWds/YXNzZXMtd29ya2lu/Zy1vbi1jb21wdXRl/ci1hbmQtbG9va2lu/Zy1hdC1jYW1lcmEt/d2l0aC1zbWlsZS13/aGlsZS1zaXR0aW5n/LWF0LWhpcy13b3Jr/aW5nLXBsYWNlLWZy/ZWUtcGhvdG8uanBn"}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover shadow-md border"
        />
        <div className="flex-1 space-y-2">
          <h2 className="text-2xl font-semibold">{user?.username}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Role: <span className="font-medium">{user?.role}</span>
          </p>
          <p className="text-sm text-gray-500">
            Joined on {new Date(user?.createdAt!).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          View Interviews
        </button>
        <button className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
          View Messages
        </button>
      </div>
    </Card>
  );
}


export default Profile