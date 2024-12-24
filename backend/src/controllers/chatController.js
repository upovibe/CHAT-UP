import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";

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

// Get All Chats for a User
export const getChats = async (req, res) => {
  const { userId } = req.params;

  try {
    const chats = await Chat.find({ participants: userId })
      .populate("participants", "name email")
      .sort({ updatedAt: -1 }); // Sort by latest activity

    res.status(200).json(chats);
  } catch (err) {
    console.error("Error fetching chats:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
