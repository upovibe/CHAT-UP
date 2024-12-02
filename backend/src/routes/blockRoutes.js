import express from "express";
import { blockUser, unblockUser, getBlockedUsers } from "../controllers/blockController.js"; // Import getBlockedUsers
import { protectRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to block a user
router.post("/block", protectRoute, blockUser);

// Route to unblock a user
router.post("/unblock", protectRoute, unblockUser);

// Route to get list of blocked users
router.get("/blocked", protectRoute, getBlockedUsers);

export default router;
