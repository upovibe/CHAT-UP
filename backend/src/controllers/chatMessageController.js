import ChatMessage from "../models/chatMessageModel.js";
import BlockedUser from "../models/blockedUserModel.js";
import cloudinary from "../config/cloudinary.js";

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

    // Return the created message
    return res.status(201).json(newChatMessage);
  } catch (error) {
    console.error("Error sending chat message:", { error: error.message });
    res.status(500).json({ message: "Error sending chat message." });
  }
};