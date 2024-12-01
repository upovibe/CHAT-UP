import { useAuth } from "@/store/useAuth";
import DefaultAvatar from "@/assets/images/users/avatar.jpeg";
import { Camera, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputTextarea } from "@/components/ui/InputTextarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { validateAvatar } from "@/utils/validators";
import { Button } from "@/components/ui/button";

const EditProfile = () => {
  const { authUser, updateProfile, isUpdatingProfile } = useAuth();
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const { toast } = useToast();

  const { fullName, userName, bio, phoneNumber, avatar } = authUser || {};
  const [formData, setFormData] = useState({
    fullName: fullName || "",
    userName: userName || "",
    bio: bio || "",
    phoneNumber: phoneNumber || "",
    avatar: avatar || "",
  });

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    setIsUploadingAvatar(true);

    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64Image = reader.result;
      setFormData((prev) => ({ ...prev, avatar: base64Image }));
      setIsUploadingAvatar(false);
    };

    reader.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to upload avatar.",
        variant: "destructive",
      });
      setIsUploadingAvatar(false);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUpdatingProfile) return;

    // Validate avatar
    const avatarValidation = validateAvatar(formData.avatar);
    if (!avatarValidation.isValid) {
      toast({
        title: "Invalid Avatar",
        description: avatarValidation.error,
        variant: "destructive",
      });
      return;
    }

    try {
      await updateProfile(formData);
      toast({
        title: "Success",
        description: "Profile updated successfully!",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    }
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
          {isUploadingAvatar
            ? "Uploading..."
            : "Click the camera icon to update your photo"}
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
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
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
        <div className="flex flex-col w-full">
          <Button
            type="submit"
            className="rounded-full bg-slate-950 flex items-center justify-center gap-2"
            disabled={isUpdatingProfile}
          >
            {isUpdatingProfile ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Please wait
              </>
            ) : (
              "Update Profile"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default EditProfile;
