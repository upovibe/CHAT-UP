import express from "express";
import { sendMessage } from "../controllers/messageController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// Send a message
router.post("/send", protectRoute, sendMessage);

export default router;
