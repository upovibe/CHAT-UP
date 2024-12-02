import express from "express";
import {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  getFriendRequests,
  removeFriend,
  getFriendsList,
} from "../controllers/requestController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// Send a friend request
router.post("/send", protectRoute, sendFriendRequest);

// Accept a friend request
router.post("/accept/:id", protectRoute, acceptFriendRequest);

// Decline a friend request
router.post("/decline/:id", protectRoute, declineFriendRequest);

// Get pending friend requests
router.get("/requests", protectRoute, getFriendRequests);

// Get friends list
router.get("/friends", protectRoute, getFriendsList);

// Remove a friend
router.delete("/friends/:friendId", protectRoute, removeFriend);

export default router;
