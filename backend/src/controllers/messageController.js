import Notification from "../models/notification.js";
import BlockedUser from "../models/blockedUserModel.js";
import User from "../models/userModel.js";
import Message from "../models/messageModel.js";
import Chat from "../models/chatModel.js";
import cloudinary from "../config/cloudinary.js";

// Send a message
export const sendMessage = async (req, res) => {
  const { sender, recipient, text, attachments } = req.body;

  if (!sender || !recipient || !text) {
    return res.status(400).json({ message: "Incomplete data" });
  }

  try {
    // Validate sender and recipient
    const [senderExists, recipientExists] = await Promise.all([
      User.findById(sender),
      User.findById(recipient),
    ]);

    if (!senderExists || !recipientExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check blocking
    const isBlocked = await BlockedUser.exists({
      $or: [{ blocker: sender, blocked: recipient }, { blocker: recipient, blocked: sender }],
    });

    if (isBlocked) {
      return res.status(403).json({ message: "Blocked" });
    }

    // Fetch or create chat
    let chat = await Chat.findOne({
      participants: { $all: [sender, recipient] },
      isGroupChat: false,
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [sender, recipient],
        isGroupChat: false,
      });
    }

    // Process attachments if present
    const processedAttachments = [];
    if (attachments?.length) {
      for (const attachment of attachments) {
        const { file, type } = attachment;

        // Check file size (max 5MB)
        const fileBuffer = Buffer.from(file.split(",")[1], "base64");
        if (fileBuffer.length > 5 * 1024 * 1024) {
          return res.status(400).json({ message: "Attachment too large" });
        }

        // Upload to Cloudinary
        try {
          const uploadResult = await cloudinary.uploader.upload(file, {
            folder: "attachments/images",
            resource_type: "image",
          });
          processedAttachments.push({ url: uploadResult.secure_url, type });
        } catch (uploadError) {
          console.error("Error uploading to Cloudinary:", uploadError.message);
          return res.status(500).json({ message: "Error uploading attachment" });
        }
      }
    }

    // Create message
    const message = await Message.create({
      sender,
      recipient,
      text,
      attachments: processedAttachments,
      chat: chat._id,
    });

    // Update chat's last message
    chat.lastMessage = text;
    chat.lastMessageAt = Date.now();
    chat.title = text; 
    await chat.save();

    // Send notification (optional)
    await Notification.create({
      userId: recipient,
      type: "message",
      message: `New message from ${senderExists.fullName}`,
      avatar: senderExists.avatar, 
      fullName: senderExists.fullName,
    });

    res.status(201).json({ message: "Message sent", data: message });
  } catch (err) {
    console.error("Error sending message:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


// Get Friends List
export const getFriendsList = async (req, res) => {
  try {
    const userId = req.user.id;

    const friends = await FriendRequest.find({
      $or: [
        { sender: userId, status: "accepted" },
        { recipient: userId, status: "accepted" },
      ],
    })
      .populate("sender recipient", "-password")
      .then((requests) =>
        requests.map((req) =>
          req.sender._id.toString() === userId ? req.recipient : req.sender
        )
      );

    res.status(200).json({ friends });
  } catch (err) {
    console.error("Error fetching friends list:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get messages in a conversation
export const getMessages = async (req, res) => {
  const { conversationId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    return res.status(400).json({ message: "Invalid conversation ID" });
  }

  try {
    const messages = await Message.find({ conversation: conversationId })
      .sort({ createdAt: -1 })
      .populate("sender", "username avatar")
      .populate("recipient", "username avatar");

    res.status(200).json({ messages });
  } catch (err) {
    console.error("Error fetching messages:", err.message);
    res.status(500).json({ message: "Error fetching messages" });
  }
};

// Mark a message as read
export const markAsRead = async (req, res) => {
  const { messageId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    return res.status(400).json({ message: "Invalid message ID" });
  }

  try {
    const message = await Message.findByIdAndUpdate(
      messageId,
      { status: "read" },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({ message: "Message marked as read", data: message });
  } catch (err) {
    console.error("Error marking message as read:", err.message);
    res.status(500).json({ message: "Error updating message status" });
  }
};
