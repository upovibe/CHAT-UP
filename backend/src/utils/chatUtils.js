import Notification from "../models/notification.js";
import cloudinary from "../config/cloudinary.js";

export const updateChatLastMessage = async (chat, message) => {
  chat.lastMessage = message.text;
  chat.lastMessageAt = Date.now();
  await chat.save();
};

export const sendNotification = async (recipient, sender) => {
  await Notification.create({
    userId: recipient,
    type: "message",
    message: `New message from ${sender.fullName}`,
    avatar: sender.avatar,
    fullName: sender.fullName,
  });
};

export const uploadAttachmentToCloudinary = async (attachment) => {
  try {
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

export const validateFile = (file) => {
  const fileBuffer = Buffer.from(file.split(",")[1], "base64");
  if (fileBuffer.length > 5 * 1024 * 1024) {
    throw new Error("Attachment too large");
  }
};