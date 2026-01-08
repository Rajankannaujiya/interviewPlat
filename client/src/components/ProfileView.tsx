import { useParams } from "react-router-dom";
import { useAppSelector } from "../state/hook";
import { CustomCenter } from "../components/CustomComp";
import { useGetUserByIdQuery } from "../state/api/generic";
import { NormalAvatar } from "./Navbar";

const ProfileView = () => {
  const { user: loggedInUser } = useAppSelector((state) => state.auth);
  const { id } = useParams<{ id?: string }>();

  const resolvedUserId = !id ? loggedInUser?.id : id;

  const {
    data: profile,
    isLoading,
    isError,
  } = useGetUserByIdQuery({userId: resolvedUserId!}, {
    skip: !resolvedUserId,
  });

  if (isLoading) {
    return (
      <CustomCenter className="dark:bg-dark-background bg-light-background w-screen min-h-screen">
        <p className="text-gray-700 dark:text-gray-300">
          Loading profile...
        </p>
      </CustomCenter>
    );
  }

  if (isError || !profile) {
    return (
      <CustomCenter className="dark:bg-dark-background bg-light-background w-screen min-h-screen">
        <p className="text-red-500">User not found</p>
      </CustomCenter>
    );
  }


  return (
    <CustomCenter className="dark:bg-dark-background bg-light-background w-screen min-h-screen">
      <div className="p-6 w-full lg:max-w-5xl mx-auto space-y-6">


        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Profile
        </h1>

        <section className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 space-y-6">

          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-32 h-32">
              {profile.profileUrl ? <img
                src={profile.profileUrl}
                alt="Profile"
                className="w-full h-full rounded-full object-cover shadow-lg border-4 border-indigo-500/50"
              /> : <NormalAvatar isnavbar={false} className='w-32 h-32' />
            }
            </div>

            <p className="text-lg font-semibold dark:text-gray-100 text-gray-700">
              {profile.username}
            </p>

            <p className="text-sm dark:text-gray-300 text-gray-500">
              Profile information
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">

            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                Name
              </label>
              <input
                value={profile.username}
                disabled
                className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700
                           border-gray-300 dark:border-gray-600
                           text-gray-900 dark:text-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                Email
              </label>
              <input
                value={profile.email}
                disabled
                className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700
                           border-gray-300 dark:border-gray-600
                           text-gray-900 dark:text-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                Mobile
              </label>
              <input
                value={profile.mobileNumber || "—"}
                disabled
                className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700
                           border-gray-300 dark:border-gray-600
                           text-gray-900 dark:text-gray-100 cursor-not-allowed"
              />
            </div>

          </div>

        </section>
      </div>
    </CustomCenter>
  );
};

export default ProfileView;
