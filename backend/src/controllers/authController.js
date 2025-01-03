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
import cloudinary from "../config/cloudinary.js";

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

    generateToken(newUser._id, res);

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
  const { identifier, password } = req.body;

  try {
    let user;
    if (identifier.includes("@")) {
      user = await User.findOne({ email: identifier });
    } else if (/^\d+$/.test(identifier)) {
      user = await User.findOne({ phoneNumber: identifier });
    } else {
      user = await User.findOne({ userName: identifier });
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
      user,
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
    return res
      .status(500)
      .json({ message: "Internal server error during logout" });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const { avatar, fullName, userName, phoneNumber, bio } = req.body;
    const userId = req.user._id;

    const updateData = {};

    // Validate and update avatar if provided
    if (avatar) {
      if (!validateAvatar(avatar)) {
        return res.status(400).json({ message: "Invalid avatar format." });
      }

      try {
        // Upload avatar to Cloudinary
        const result = await cloudinary.uploader.upload(avatar, {
          folder: "avatars",
          public_id: `${userId}-${Date.now()}`,
          overwrite: true,
        });

        // Update avatar URL in the user profile
        updateData.avatar = result.secure_url;
      } catch (error) {
        console.error("Avatar upload to Cloudinary failed:", error.message);
        return res.status(500).json({ message: "Failed to upload avatar." });
      }
    }

    // Validate and update fullName if provided
    if (fullName) {
      if (!validateFullName(fullName)) {
        return res.status(400).json({ message: "Invalid full name format." });
      }
      updateData.fullName = fullName;
    }

    // Validate and update userName if provided
    if (userName) {
      if (!validateUsername(userName)) {
        return res.status(400).json({ message: "Invalid username format." });
      }
      updateData.userName = userName;
    }

    // Validate and update phoneNumber if provided
    if (phoneNumber) {
      if (!validatePhoneNumber(phoneNumber)) {
        return res.status(400).json({ message: "Invalid phone number format." });
      }
      updateData.phoneNumber = phoneNumber;
    }

    // Update bio if provided (no validation for now)
    if (bio) {
      updateData.bio = bio;
    }

    // Update user in the database
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      select: "-password -email",
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: updatedUser,
    });
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
        message: "Unauthorized access. User not authenticated.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User authenticated successfully.",
      user: req.user,
    });
  } catch (err) {
    console.error("Error during authentication check:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication check.",
    });
  }
};

// Update visibility preferences
export const updateVisibilityPreferences = async (req, res) => {
  try {
    const userId = req.user.id; // From the protectRoute middleware
    const { showEmail, showPhone, showStatus } = req.body;

    // Update the user's visibility preferences in the database
    const user = await User.findByIdAndUpdate(
      userId,
      { visibilityPreferences: { showEmail, showPhone, showStatus } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ preferences: user.visibilityPreferences });
  } catch (error) {
    console.error('Error updating visibility preferences:', error);
    res.status(500).json({ message: 'Failed to update visibility preferences' });
  }
};

// Get visibility preferences
export const getVisibilityPreferences = async (req, res) => {
  try {
    const userId = req.user.id; // From the protectRoute middleware

    // Fetch the user's visibility preferences
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ preferences: user.visibilityPreferences });
  } catch (error) {
    console.error('Error fetching visibility preferences:', error);
    res.status(500).json({ message: 'Failed to fetch visibility preferences' });
  }
};