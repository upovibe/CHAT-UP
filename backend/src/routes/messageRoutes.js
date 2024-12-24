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

/**
 * @route   POST /api/messages/send
 * @desc    Send a new message
 * @access  Protected
 */
router.post("/send", protectRoute, sendMessage);

/**
 * @route   GET /api/messages/chat/:chatId
 * @desc    Get all messages for a specific chat with pagination
 * @access  Protected
 */
router.get("/chat/:chatId", protectRoute, getMessages);

/**
 * @route   PUT /api/messages/:messageId/read
 * @desc    Mark a specific message as read
 * @access  Protected
 */
router.put("/:messageId/read", protectRoute, markMessageAsRead);

/**
 * @route   PUT /api/messages/:messageId
 * @desc    Update (edit) a specific message
 * @access  Protected
 */
router.put("/:messageId", protectRoute, updateMessage);

/**
 * @route   DELETE /api/messages/:messageId
 * @desc    Delete a specific message
 * @access  Protected
 */
router.delete("/:messageId", protectRoute, deleteMessage);


/**
 * @route   POST /api/messages/:messageId/react
 * @desc    Add a reaction to a specific message
 * @access  Protected
 */
router.post("/:messageId/react", protectRoute, addReaction);

/**
 * @route   DELETE /api/messages/:messageId/react
 * @desc    Remove a reaction from a specific message
 * @access  Protected
 */
router.delete("/:messageId/react", protectRoute, removeReaction);

export default router;
