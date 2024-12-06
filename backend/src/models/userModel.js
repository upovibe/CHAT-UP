import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    avatar: {
      type: String,
      default: "",
      trim: true, 
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true, 
    },
    email: {
      type: String,
      required: false, 
      unique: true, 
      lowercase: true, 
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: false,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: false, 
      minlength: 6,
    },
    bio: {
      type: String,
      default: "",
      trim: true, 
      maxlength: 160,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      default: "Available",
      trim: true,
    },
    lastSeen: {
      type: Date,
      default: null,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    visibilityPreferences: {
      showEmail: { type: Boolean, default: true },
      showPhone: { type: Boolean, default: true },
      showStatus: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
