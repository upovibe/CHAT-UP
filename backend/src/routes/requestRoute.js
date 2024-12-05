import express from "express";
import {
  sendFriendRequest,
  cancelFriendRequest,
  getPendingFriendRequests,
  acceptFriendRequest,
  // rejectFriendRequest,
  // getFriendsList,
  // reSendFriendRequest,
  // getFriendRequestStatus,
} from "../controllers/requestController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// Send a friend request
router.post("/send", protectRoute, sendFriendRequest);

// Cancel a pending friend request
router.post("/cancel", protectRoute, cancelFriendRequest);

// Get a list of all pending friend requests for the logged-in user
router.get("/pending", protectRoute, getPendingFriendRequests);

// Accept a friend request
router.post("/accept", protectRoute, acceptFriendRequest);

// // Reject a friend request
// router.post("/friend-requests/reject", protectRoute, rejectFriendRequest);

// // Get a list of all accepted friends for the logged-in user
// router.get("/friends/list", protectRoute, getFriendsList);

// // Re-send a friend request after cancellation or expiration
// router.post("/friend-requests/re-send", protectRoute, reSendFriendRequest);

// // Get the status of a friend request (e.g., pending, accepted, canceled, expired)
// router.get("/friend-requests/status/:userId", protectRoute, getFriendRequestStatus);

export default router;
