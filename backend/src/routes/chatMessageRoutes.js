import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { getChatMessages, sendChatMessage } from "../controllers/chatMessageController.js";

const router = express.Router();

/**
 * @route   GET /api/chatmessags/:userId
 * @desc    Get all chat messages for a user
 * @access  Private
 */
router.get("/:userId", protectRoute, getChatMessages);

/**
 * @route   POST /api/chatmessages/send/:userId
 * @desc    Send a new chat message
 * @access  Private
 */
router.post("/send/:userId", protectRoute, sendChatMessage);

export default router;