import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import {
  sendMessage,
  getMessages,
  markMessageAsRead,
  deleteMessage,
  updateMessage,
  addReaction,
  removeReaction,
} from "../controllers/messageController.js";

const router = express.Router();

// Send a new message
router.post("/send", protectRoute, sendMessage);

// Get messages for a specific chat
router.get("/chat/:chatId", protectRoute, getMessages);

// Mark a message as read
router.put("/:messageId/read", protectRoute, markMessageAsRead);

// Update a specific message
router.put("/:messageId", protectRoute, updateMessage);

// Delete a specific message
router.delete("/:messageId", protectRoute, deleteMessage);

// Add a reaction to a message
router.post("/:messageId/react", protectRoute, addReaction);

// Remove a reaction from a message
router.delete("/:messageId/react", protectRoute, removeReaction);

export default router;
