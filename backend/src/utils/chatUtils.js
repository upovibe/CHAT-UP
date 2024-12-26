import cloudinary from "../config/cloudinary.js";
import BlockedUser from "../models/blockedUserModel.js";

// Utility function to upload attachments to Cloudinary
export const uploadAttachmentToCloudinary = async (attachment) => {
  try {
    const result = await cloudinary.uploader.upload(attachment, {
      folder: "attachments",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Attachment upload to Cloudinary failed:", error.message);
    throw new Error("Failed to upload attachment.");
  }
};

// Utility function to validate file size and format
export const validateFile = (file) => {
  const fileBuffer = Buffer.from(file.split(",")[1], "base64");
  if (fileBuffer.length > 5 * 1024 * 1024) {
    throw new Error("Attachment too large");
  }
};

// Utility function to check if a user is blocked
export const isUserBlocked = async (senderId, receiverId) => {
  const isBlocked = await BlockedUser.findOne({
    $or: [
      { userId: senderId, blockedUserId: receiverId },
      { userId: receiverId, blockedUserId: senderId },
    ],
  });
  return Boolean(isBlocked);
};

export const sendNotification = async (receiverId, message) => {
  // Assume Notification model is defined elsewhere
  await Notification.create({
    userId: receiverId,
    avatar: message.senderAvatar,
    fullName: message.senderFullName,
    type: "message",
    message: `${message.senderFullName} has sent you a message.`,
  });  try {
    const uploadResult = await cloudinary.uploader.upload(attachment.file, {
      folder: "attachments/images",
      resource_type: "image",
    });
    return { url: uploadResult.secure_url, type: attachment.type };
  } catch (uploadError) {
    console.error("Error uploading to Cloudinary:", uploadError.message);
    throw new Error("Error uploading attachment");
  }
};