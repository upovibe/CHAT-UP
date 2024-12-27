import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import {
  getChatMessages,
  sendChatMessage,
  softDeleteMessage,
  getUnreadMessageCount,
  markMessagesAsRead,
} from "../controllers/chatMessageController.js";

const router = express.Router();

router.get("/:userId", protectRoute, getChatMessages);
router.post("/send/:userId", protectRoute, sendChatMessage);
router.put("/delete/:messageId", protectRoute, softDeleteMessage);
router.get("/unread/:userId", protectRoute, getUnreadMessageCount);
router.put("/read/:userId", protectRoute, markMessagesAsRead);

export default router;
