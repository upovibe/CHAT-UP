import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { getChats, createOrFetchChat, markMessagesAsReadForChat } from "../controllers/chatController.js";

const router = express.Router();

// Route to create or fetch a chat
router.post("/chat", protectRoute, createOrFetchChat);

// Route to get all chats for a user
router.get("/:userId", protectRoute, getChats);

// Route to mark all messages in a chat as read
router.put("/:chatId/read", protectRoute, markMessagesAsReadForChat);

export default router;
