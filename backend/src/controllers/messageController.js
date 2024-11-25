import FriendRequest from "../models/requestModel.js";
import Message from "../models/messageModel.js";
import supabase from "../config/supabase.js";
import {
  validateAttachmentSize,
  validateAttachmentUrl,
} from "../utils/validators.js";

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

// Send a message
export const sendMessage = async (req, res) => {
  const { sender, recipient, text, attachments, conversation } = req.body;

  if (!sender || !recipient || !conversation) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const processedAttachments = [];

    if (attachments && attachments.length > 0) {
      for (const attachment of attachments) {
        const { file, type } = attachment;

        // Validate type and URL format
        const { isValid: isValidUrl, message: urlMessage } =
          validateAttachmentUrl(file, type);
        if (!isValidUrl) {
          return res.status(400).json({ message: urlMessage });
        }

        const fileBuffer = Buffer.from(file.split(",")[1], "base64");

        // Validate file size
        const { isValid: isValidSize, message: sizeMessage } =
          validateAttachmentSize(fileBuffer, type);
        if (!isValidSize) {
          return res.status(400).json({ message: sizeMessage });
        }

        // Generate file path and upload to Supabase
        const folder =
          type === "image" ? "images" : type === "video" ? "videos" : "files";
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}`;
        const filePath = `attachments/${folder}/${fileName}.${
          type === "image" ? "png" : type === "video" ? "mp4" : "dat"
        }`;

        const { data, error } = await supabase.storage
          .from("attachments")
          .upload(filePath, fileBuffer, {
            contentType:
              type === "image"
                ? "image/png"
                : type === "video"
                ? "video/mp4"
                : "application/octet-stream",
          });

        if (error) {
          return res
            .status(500)
            .json({ message: `Supabase upload failed: ${error.message}` });
        }

        const { publicURL, error: urlError } = supabase.storage
          .from("attachments")
          .getPublicUrl(filePath);

        if (urlError) {
          return res
            .status(500)
            .json({
              message: `Failed to generate public URL: ${urlError.message}`,
            });
        }

        processedAttachments.push({ url: publicURL, type });
      }
    }

    const message = await Message.create({
      sender,
      recipient,
      text,
      attachments: processedAttachments,
      conversation,
    });

    res
      .status(201)
      .json({ message: "Message sent successfully!", data: message });
  } catch (err) {
    console.error("Error sending message:", err.message);
    res.status(500).json({ message: "Error sending message" });
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
