import { generateToken } from "../utils/tokenGen.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import {
  validateUsername,
  validateEmail,
  validatePassword,
  validateFullName,
  validatePhoneNumber,
  validateAvatar,
} from "../utils/validators.js";
import supabase from "../config/supabase.js";

// Signup logic
export const signup = async (req, res) => {
  const { fullName, userName, email, phoneNumber, password } = req.body;

  try {
    if (!fullName || !userName || !password || (!email && !phoneNumber)) {
      return res.status(400).json({
        message:
          "All fields are required, and either email or phone number must be provided.",
      });
    }

    if (!validateFullName(fullName)) {
      return res.status(400).json({
        message:
          "Full name must contain at least two words with only alphabets and spaces.",
      });
    }

    if (!validateUsername(userName)) {
      return res.status(400).json({
        message:
          "Username must be at least 3 characters long and can only contain alphanumeric characters and underscores.",
      });
    }

    if (email && !validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
      return res.status(400).json({ message: "Invalid phone number format." });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long and include one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    if (email) {
      const existingEmailUser = await User.findOne({ email });
      if (existingEmailUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    if (phoneNumber) {
      const existingPhoneUser = await User.findOne({ phoneNumber });
      if (existingPhoneUser) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
    }

    const existingUsername = await User.findOne({ userName });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      userName,
      email: email || null,
      phoneNumber: phoneNumber || null,
      password: hashedPassword,
    });

    return res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      userName: newUser.userName,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
      avatar: newUser.avatar,
      bio: newUser.bio,
      createdAt: newUser.createdAt,
    });
  } catch (err) {
    console.error("Error during signup:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login logic
export const login = async (req, res) => {
  const { userName, email, phoneNumber, password } = req.body;

  try {
    let user;
    if (email) {
      user = await User.findOne({ email });
    } else if (userName) {
      user = await User.findOne({ userName });
    } else if (phoneNumber) {
      user = await User.findOne({ phoneNumber });
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    return res.status(200).json({
      message: "Login successful",
      _id: user._id,
      fullName: user.fullName,
      userName: user.userName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Logout logic
export const logout = (req, res) => {
  try {
    // Clear the authentication token cookie
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict", 
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Error during logout:", err.message);
    return res.status(500).json({ message: "Internal server error during logout" });
  }
};

// Update Profile Logic
export const updateProfile = async (req, res) => {
  try {
    const { avatar } = req.body;
    const userId = req.user._id;

    if (avatar) {
      // Validate the avatar
      if (!validateAvatar(avatar)) {
        return res.status(400).json({ message: "Invalid avatar format." });
      }

      const fileName = `avatars/${userId}-${Date.now()}.png`;
      const buffer = Buffer.from(avatar.split(",")[1], "base64");

      // Upload the avatar to Supabase
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(fileName, buffer, {
          contentType: "image/png",
          upsert: true,
        });

      if (error) {
        console.error("Supabase upload error:", error.message);
        return res.status(500).json({ message: "Failed to upload avatar." });
      }

      // Generate a public URL for the uploaded avatar
      const { publicURL, error: urlError } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      if (urlError) {
        console.error("Error generating public URL:", urlError.message);
        return res.status(500).json({ message: "Failed to generate avatar URL." });
      }

      // Update the user's avatar in the database
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { avatar: publicURL },
        { new: true }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found." });
      }

      return res.status(200).json({
        message: "Avatar updated successfully.",
        user: updatedUser,
      });
    }

    // If no avatar is provided, return an appropriate response
    return res.status(400).json({ message: "No avatar provided for update." });
  } catch (err) {
    console.error("Error during profile update:", err.message);
    res.status(500).json({ message: "Internal server error during profile update." });
  }
};

// Check Authentication Logic
export const checkAuth = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized access. User not authenticated." 
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: "User authenticated successfully.", 
      user: req.user 
    });
  } catch (err) {
    console.error("Error during authentication check:", err.message);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error during authentication check." 
    });
  }
};
