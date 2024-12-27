import ChatMessage from "../models/chatMessageModel.js";
import BlockedUser from "../models/blockedUserModel.js";
import cloudinary from "../config/cloudinary.js";
import { getRecieverSocketId, io } from "../lib/socket.js";

//  Controller function to send chat messages
export const sendChatMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { userId: receiverId } = req.params;
    const senderId = req.user._id;

    // Validate sender and receiver
    if (!senderId || !receiverId || senderId === receiverId) {
      return res.status(400).json({ message: "Invalid sender or receiver." });
    }

    // Check if the sender or receiver is blocked
    const isBlocked = await BlockedUser.findOne({
      $or: [
        { userId: senderId, blockedUserId: receiverId },
        { userId: receiverId, blockedUserId: senderId },
      ],
    });

    if (isBlocked) {
      return res.status(403).json({ message: "You cannot send messages to this user." });
    }

    // Handle image upload to 
    let imageURl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image,{
        folder: 'chats/images',
      });
      imageURl = uploadResponse.secure_url;
    }

    // Create a new chat message
    const newChatMessage = new ChatMessage({
      senderId,
      receiverId,
      text,
      image: imageURl,
    });

    await newChatMessage.save();

    //Real time functionality with socket.io
    const receiverSocketId = getRecieverSocketId(receiverId);
    if(receiverSocketId){
      io.to(receiverSocketId).emit('newChatMessage',newChatMessage);
    }

    // Return the created message
    return res.status(201).json(newChatMessage);
  } catch (error) {
    console.error("Error sending chat message:", { error: error.message });
    res.status(500).json({ message: "Error sending chat message." });
  }
};

// Controller function to get all chat messages for a user
export const getChatMessages = async (req, res) => {
  try {
    const { userId: userToChatId } = req.params
    const senderId = req.user._id;

    const chatmessages = await ChatMessage.find({
      $or: [
        { senderId: senderId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: senderId }
      ],
    })
    res.status(200).json(chatmessages);
  } catch (error) {
    console.error("Error getting chat messages:", error.message);
    res.status(500).json({ message: "Error getting chat messages" });
  }
};

// Controller function to mark messages as read
export const getUnreadMessageCount = async (req, res) => {
  const { userId } = req.params;

  try {
    const unreadCount = await ChatMessage.countDocuments({
      receiverId: userId,
      read: false,
      deleted: false,
    });

    res.status(200).json({ unreadCount });
  } catch (error) {
    console.error("Error fetching unread message count:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Controller function to mark messages as read
export const markMessagesAsRead = async (req, res) => {
  const { userId } = req.params;

  try {
    const updatedMessages = await ChatMessage.updateMany(
      { receiverId: userId, read: false, deleted: false },
      { $set: { read: true } }
    );

    // Fetch all updated messages
    const readMessages = await ChatMessage.find({
      receiverId: userId,
      read: true,
    });

    // Emit a Socket.IO event to notify the sender that messages were read
    readMessages.forEach((message) => {
      const senderSocketId = getRecieverSocketId(message.senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("messageRead", {
          messageId: message._id,
        });
      }
    });

    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Error marking messages as read:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Controller function to mark messages as deleted
export const softDeleteMessage = async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await ChatMessage.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    message.deleted = true;
    await message.save();

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
