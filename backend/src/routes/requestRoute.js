import express from "express";
import {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  getFriendRequests,
  removeFriend,
} from "../controllers/requestController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// Send a friend request
router.post("/send", protectRoute, sendFriendRequest);

// Accept a friend request
router.post("/accept/:id", protectRoute, acceptFriendRequest);

// Decline a friend request
router.post("/decline/:id", protectRoute, declineFriendRequest);

// Get friend requests
router.get("/", protectRoute, getFriendRequests);

// Remove friend requests
router.delete("/friends/:friendId", protectRoute, removeFriend);

export default router;
