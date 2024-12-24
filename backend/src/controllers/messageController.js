import Notification from "../models/notification.js";
import BlockedUser from "../models/blockedUserModel.js";
import User from "../models/userModel.js";
import Message from "../models/messageModel.js";
import Chat from "../models/chatModel.js";
import cloudinary from "../config/cloudinary.js";
import {
  updateChatLastMessage,
  sendNotification,
  uploadAttachmentToCloudinary,
  validateFile,
} from "../utils/chatUtils.js";
// import { encryptMessage, decryptMessage } from "../config/encryption.js"; // Commented out encryption imports


// Controller function to send a message
export const sendMessage = async (req, res) => {
  const { sender, recipient, text, attachments } = req.body;

  // Ensure required data is provided
  if (!sender || !recipient || (!text && (!attachments || !attachments.length))) {
    return res.status(400).json({ message: "Incomplete data" });
  }

  try {
    // Check if both sender and recipient exist in the database
    const [senderExists, recipientExists] = await Promise.all([
      User.findById(sender),
      User.findById(recipient),
    ]);

    if (!senderExists || !recipientExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if either user has blocked the other
    const isBlocked = await BlockedUser.exists({
      $or: [
        { blocker: sender, blocked: recipient },
        { blocker: recipient, blocked: sender },
      ],
    });

    if (isBlocked) {
      return res.status(403).json({ message: "Blocked" });
    }

    // Encrypt the message text if provided (commented out for now)
    // const encryptedText = text ? encryptMessage(text) : null;
    const encryptedText = text; // Use the plain text temporarily

    // Upload attachments to Cloudinary if provided
    const uploadedAttachmentUrls = [];
    if (attachments?.length) {
      for (const attachment of attachments) {
        // Validate the file type
        validateFile(attachment.file);

        // Upload the file to Cloudinary and store the URL
        const uploadedAttachment = await uploadAttachmentToCloudinary(attachment);
        uploadedAttachmentUrls.push(uploadedAttachment);
      }
    }

    // Check if a chat exists between sender and recipient; create one if not
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

    // Save the message in the database
    const message = await Message.create({
      sender,
      recipient,
      text: encryptedText, // Store the plain text temporarily
      attachments: uploadedAttachmentUrls,
      chat: chat._id,
      status: "sent",
    });

    // Update the chat with the latest message
    await updateChatLastMessage(chat, message);

    // Send a notification to the recipient
    await sendNotification(recipient, senderExists);

    // Respond with the created message
    res.status(201).json({ message: "Message sent", data: message });
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


export const getMessages = async (req, res) => {
  const { chatId } = req.params;
  const { limit = 50, page = 1 } = req.query;

  try {
    const messages = await Message.find({ chat: chatId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("sender", "fullName avatar")
      .populate("recipient", "fullName avatar");

    // Decrypt the messages if encryption is enabled (commented out for now)
    const decryptedMessages = messages.map((message) => {
      let decryptedText = null;
      if (message.text) {
        // Try decrypting the text (commented out for now)
        // try {
        //   decryptedText = decryptMessage(message.text); // Decrypt the message text
        // } catch (err) {
        //   console.error("Error decrypting message:", err.message);
        // }
        decryptedText = message.text; // Use plain text for now
      }
      return { ...message.toObject(), text: decryptedText };
    });

    res.status(200).json({ data: decryptedMessages });
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark a message as read
export const markMessageAsRead = async (req, res) => {
  const { messageId } = req.params;

  try {
    // Find the message by its ID
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Check if the message is already read (optional)
    if (message.status === "read") {
      return res.status(400).json({ message: "Message already marked as read" });
    }

    // Mark the message as read
    message.status = "read";

    // Save the updated message
    await message.save();

    res.status(200).json({ message: "Message marked as read", data: message });
  } catch (error) {
    console.error("Error marking message as read:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller function to update a message
// export const updateMessage = async (req, res) => {
//   const { messageId } = req.params;
//   const { text, attachments } = req.body;  // Assuming only text and attachments will be updated

//   try {
//     // Find the message by its ID
//     const message = await Message.findById(messageId);

//     if (!message) {
//       return res.status(404).json({ message: "Message not found" });
//     }

//     // Update the message fields (text and attachments are optional)
//     if (text !== undefined) {
//       message.text = text;
//     }
    
//     if (attachments !== undefined) {
//       message.attachments = attachments;
//     }

//     // Save the updated message
//     await message.save();

//     // Return the updated message data
//     res.status(200).json({ message: "Message updated successfully", data: message });
//   } catch (error) {
//     console.error("Error updating message:", error.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };
export const updateMessage = async (req, res) => {
  const { messageId } = req.params;
  const { text, attachments } = req.body;

  try {
    // Find the message by its ID
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // If both text and attachments are provided, update only the text
    if (text && attachments) {
      message.text = text;
    } 
    // If only text is provided, update the text
    else if (text) {
      message.text = text;
    }

    // Save the updated message
    await message.save();

    // Return the updated message data
    res.status(200).json({ message: "Message updated successfully", data: message });
  } catch (error) {
    console.error("Error updating message:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  const { messageId } = req.params;

  try {
    // Find the message by its ID
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Option 1: Physically delete the message
    // await message.remove();

    // Option 2: Mark the message as deleted (soft delete)
    message.text = "This message was deleted.";
    message.isDeleted = true;  // Mark the message as deleted (soft delete)
    await message.save();

    // Return a success response
    res.status(200).json({ message: "Message deleted successfully", data: message });
  } catch (error) {
    console.error("Error deleting message:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Add a reaction to a message
export const addReaction = async (req, res) => {
  // Your implementation here
};

// Remove a reaction from a message
export const removeReaction = async (req, res) => {
  // Your implementation here
};
