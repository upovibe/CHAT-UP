import express from "express";
import {
  sendMessage,
  getMessages,
  markAsRead,
} from "../controllers/messageController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// Send a message
router.post("/", protectRoute, sendMessage);

// Get all messages for a conversation
router.get("/:conversationId", protectRoute, getMessages);

// Mark a message as read
router.patch("/:messageId/read", protectRoute, markAsRead);

export default router;
