import ChatMessage from "../models/chatMessageModel.js";
import {
  uploadAttachmentToCloudinary,
  validateFile,
  isUserBlocked,
} from "../utils/chatUtils.js";

// Controller function to get all chat messages for a user

export const getChatMessages = async (req, res) => {
  try {
    const { userId: userToChatId } = req.params
    const senderId = req.user._id;

    const chatmessages = await ChatMessage.find({
      $or: [
        { senderId: senderId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: senderId }
      ]
    })
    res.status(200).json(chatmessages);
  } catch (error) {
    console.error("Error getting chat messages:", error.message);
    res.status(500).json({ message: "Error getting chat messages" });
  }
};

export const sendChatMessage = async (req, res) => {
  try {
    const { receiverId, text, attachment } = req.body;
    const senderId = req.user._id; // Use authenticated user

    // Validate sender and receiver
    if (!senderId || !receiverId || senderId === receiverId) {
      return res.status(400).json({ message: "Invalid sender or receiver." });
    }

    // Check if the sender or receiver is blocked
    const blocked = await isUserBlocked(senderId, receiverId);
    if (blocked) {
      return res.status(403).json({ message: "You cannot send messages to this user." });
    }

    // Handle attachment upload (if provided)
    let attachmentUrl;
    if (attachment) {
      try {
        validateFile(attachment); // Validate file size and type
        attachmentUrl = await uploadAttachmentToCloudinary(attachment);
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
    }

    // Create a new chat message
    const message = await ChatMessage.create({
      senderId,
      receiverId,
      text,
      attachment: attachmentUrl,
    });

    // Return the created message
    return res.status(201).json(message);
  } catch (error) {
    console.error("Error sending chat message:", { error: error.message, senderId: req.user._id });
    res.status(500).json({ message: "Error sending chat message." });
  }
};
