import express from "express";
import {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  deleteFriendRequest,
  getFriendRequests,
  getSentRequests,
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

// Delete a friend request (sent or received)
router.delete("/delete/:id", protectRoute, deleteFriendRequest);

// Get pending friend requests
router.get("/requests", protectRoute, getFriendRequests);

// Retrieve sent friend requests
router.get("/sent-requests", protectRoute, getSentRequests);

// Get friends list
router.get("/friends", protectRoute, getFriendsList);

export default router;
