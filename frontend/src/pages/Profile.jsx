import { useAuth } from "@/store/useAuth";
import DefaultAavatar from "@/assets/images/users/avatar.jpeg";
import { Camera } from "lucide-react";

const Profile = () => {
  const { authUser, updateProfile, isUpdatingProfile } = useAuth();

  const handleAvatarUpload = () => {};

  return (
    <div>
      <div className="p-4">
        <div className="bg-base-300 rounded-xl space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your Profile Info</p>
          </div>

          {/* Avata upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={authUser.Avatar || DefaultAavatar}
                alt="Avatar"
                className="size-32 rounded-full object-cover border-4"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-2 bg-gray-500 hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${
                  isUpdatingProfile ? "animate-pulse event-none" : ""
                }`}
              >
                <Camera className="size-4 text-white" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  required
                  accept="image/jpeg, image/png"
                  onChange={handleAvatarUpload}
                  disabled={isUpdatingProfile}
                ></input>
              </label>
            </div>
            <p className="text-sm text-gray-300">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Profile;
