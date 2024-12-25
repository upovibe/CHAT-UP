import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js"; 
import User from "../models/userModel.js";
import mongoose from "mongoose";

// Create or Fetch Chat
export const createOrFetchChat = async (req, res) => {
  const { sender, recipient, isGroupChat = false } = req.body;

  if (!sender || !recipient) {
    return res.status(400).json({ message: "Sender and recipient are required" });
  }

  try {
    // Validate users
    const senderExists = await User.findById(sender);
    const recipientExists = await User.findById(recipient);
    if (!senderExists || !recipientExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [sender, recipient] },
      isGroupChat,
    });

    // If no chat exists, create a new one
    if (!chat) {
      chat = await Chat.create({
        participants: [sender, recipient],
        isGroupChat,
      });
    }

    res.status(200).json({ message: "Chat retrieved or created", data: chat });
  } catch (err) {
    console.error("Error creating or fetching chat:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getChats = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid userId" });
  }

  try {
    const chats = await Chat.find({ participants: userId })
      .populate("participants", "fullName avatar ")
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (err) {
    console.error("Error fetching chats:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Mark all messages as read for a specific chat
export const markMessagesAsReadForChat = async (req, res) => {
  const { chatId } = req.params;

  try {
    // Find all unread messages in the chat
    const unreadMessages = await Message.find({ chat: chatId, status: "sent" });

    if (!unreadMessages.length) {
      return res.status(404).json({ message: "No unread messages found in this chat" });
    }

    // Update the status of all unread messages to "read"
    const updatedMessages = await Message.updateMany(
      { _id: { $in: unreadMessages.map((msg) => msg._id) } },
      { status: "read" }
    );

    res.status(200).json({ message: "Messages marked as read", data: updatedMessages });
  } catch (error) {
    console.error("Error marking messages as read:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};