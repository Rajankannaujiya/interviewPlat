import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "../state/hook";
import { CustomCenter } from "../components/CustomComp";
import { uploadImageToCloudinary } from "./cloudinary";
import { useUpdateUsersInformationMutation } from "../state/api/generic";
import { NormalAvatar } from "../components/Navbar";




const Settings = () => {
  const { user } = useAppSelector((state) => state.auth);

  const [name, setName] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [mobileNumber, setMobileNumber] = useState(user?.mobileNumber || "");
  const [profileImage, setProfileImage] = useState(user?.profileUrl || "");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [updateUserInfromation] = useUpdateUsersInformationMutation();

  // Upload image to Cloudinary
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    toast.info("Uploading image...");

    try {
      const uploadedUrl = await uploadImageToCloudinary(file);
      if (!uploadedUrl) throw new Error("Cannot upload image");

      setProfileImage(uploadedUrl);
      toast.success("Profile picture updated!");
    } catch (err) {
      toast.error("Failed to upload image");
    }
  };

  // Save profile to backend
  const handleSaveProfile = async () => {
    try {

      await updateUserInfromation({username: name, email, mobileNumber, imageUrl:profileImage})
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error updating profile");
    }
  };

  const handleChangeProfileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <CustomCenter className="dark:bg-dark-background bg-light-background w-screen min-h-screen">
      <div className="p-6 w-full lg:max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Settings
        </h1>

        <section className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Profile</h2>

          {/* Avatar */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-32 h-32">
              {profileImage ? <img
                src={profileImage || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-full h-full rounded-full object-cover shadow-lg border-4 border-indigo-500/50"
              /> :
              <NormalAvatar isnavbar={false} className="w-32 h-32 rounded-full"/>
              }
              <button
                type="button"
                onClick={handleChangeProfileClick}
                className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-xl border-2 border-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.867-1.297A2 2 0 0111.126 3h1.748a2 2 0 011.664.89l.867 1.297a2 2 0 001.664.89H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </button>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <p className="text-lg font-semibold dark:text-gray-100 text-gray-700">{name}</p>
            <p className="text-sm dark:text-gray-300 text-gray-500">
              Click the camera to change your photo.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                Mobile
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow"
          >
            Save Profile
          </button>
        </section>
      </div>
    </CustomCenter>
  );
};

export default Settings;
