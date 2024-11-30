import { useAuth } from "@/store/useAuth";
import DefaultAvatar from "@/assets/images/users/avatar.jpeg";
import { Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputTextarea } from "@/components/ui/InputTextarea";
import { useState } from "react";
import supabase from "@/lib/supabase";

const Profile = () => {
  const { authUser, updateProfile, isUpdatingProfile } = useAuth();

  const [formData, setFormData] = useState({
    fullName: authUser.fullName || "",
    userName: authUser.userName || "",
    bio: authUser.bio || "",
    phoneNumber: authUser.phoneNumber || "",
    avatar: authUser.avatar || "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Avatar upload handler
  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      const fileName = `avatars/${authUser.id}-${Date.now()}`;
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);

      if (error) {
        console.error("Avatar upload failed:", error.message);
        return;
      }

      const { publicURL } = supabase.storage.from("avatars").getPublicUrl(fileName);
      setFormData((prev) => ({ ...prev, avatar: publicURL }));
    } catch (err) {
      console.error("Avatar upload error:", err);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Handle profile form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUpdatingProfile) return;

    // Update profile with form data (including avatar if updated)
    await updateProfile(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="mt-2">Your Profile Info</p>
      </div>

      {/* Avatar Upload */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <img
            src={formData.avatar || DefaultAvatar}
            alt="Avatar"
            className="size-32 rounded-full object-cover border-4"
          />
          <label
            htmlFor="avatar-upload"
            className={`absolute bottom-0 right-2 bg-gray-500 hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${
              isUploadingAvatar ? "animate-pulse pointer-events-none" : ""
            }`}
          >
            <Camera className="size-4 text-white" />
            <input
              type="file"
              id="avatar-upload"
              className="hidden"
              accept="image/jpeg, image/png"
              onChange={handleAvatarUpload}
              disabled={isUploadingAvatar}
            />
          </label>
        </div>
        <p className="text-sm text-gray-300">
          {isUploadingAvatar ? "Uploading..." : "Click the camera icon to update your photo"}
        </p>
      </div>

      {/* Profile Form */}
      <div className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            type="text"
            id="fullName"
            placeholder="Enter full name"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="userName">Username</Label>
          <Input
            type="text"
            id="userName"
            placeholder="Enter username"
            value={formData.userName}
            onChange={(e) =>
              setFormData({ ...formData, userName: e.target.value })
            }
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="bio">Bio</Label>
          <InputTextarea
            id="bio"
            placeholder="Enter your bio"
            value={formData.bio}
            onChange={(e) =>
              setFormData({ ...formData, bio: e.target.value })
            }
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            type="tel"
            id="phoneNumber"
            placeholder="Enter phone number"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className={`btn-primary ${isUpdatingProfile ? "animate-pulse" : ""}`}
          disabled={isUpdatingProfile}
        >
          {isUpdatingProfile ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </form>
  );
};

export default Profile;
