import mongoose from "mongoose";
import FriendRequest from "../models/requestModel.js";
import BlockedUser from "../models/blockedUserModel.js";

// Send a Friend Request
export const sendFriendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body; // Receiver's user ID
    const senderId = req.user.id; // Sender's user ID (from auth middleware)

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: "Invalid sender or receiver ID." });
    }

    // Prevent self-request
    if (senderId === receiverId) {
      return res.status(400).json({ message: "You cannot send a friend request to yourself." });
    }

    // Check if the receiver is blocked
    const isBlocked = await BlockedUser.findOne({
      $or: [
        { blockerId: senderId, blockedId: receiverId },
        { blockerId: receiverId, blockedId: senderId },
      ],
    });

    if (isBlocked) {
      return res.status(403).json({ message: "You cannot send a friend request to this user." });
    }

    // Check if the user has canceled a friend request within the last 14 days
    const recentCancelledRequest = await FriendRequest.findOne({
      senderId,
      receiverId,
      status: "cancelled",
    });

    if (recentCancelledRequest) {
      const cancellationTime = recentCancelledRequest.cancelledAt;
      const currentTime = new Date();
      const differenceInDays = (currentTime - cancellationTime) / (1000 * 3600 * 24); // Difference in days

      if (differenceInDays < 14) {
        return res.status(400).json({
          message: "You cannot send a friend request within 14 days of canceling a previous one.",
        });
      }
    }

    // Check for an existing friend request
    const existingRequest = await FriendRequest.findOne({
      senderId,
      receiverId,
      status: { $in: ["pending", "accepted"] },
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Friend request already sent or you are already friends with this user.",
      });
    }

    // Create the friend request
    const friendRequest = new FriendRequest({
      senderId,
      receiverId,
      status: "pending",
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7-day expiry
    });

    await friendRequest.save();

    res.status(201).json({
      message: "Friend request sent successfully.",
      friendRequest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while sending the friend request." });
  }
};

// Cancel a Friend Request
export const cancelFriendRequest = async (req, res) => {
  const { receiverId } = req.body; // ID of the friend request receiver
  const senderId = req.user.id; // Authenticated user's ID

  try {
    // Validate receiverId
    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: "Invalid receiver ID." });
    }

    // Find the friend request
    const friendRequest = await FriendRequest.findOne({
      senderId: senderId,
      receiverId: receiverId,
      status: "pending"
    });

    if (!friendRequest) {
      return res.status(404).json({ message: "Request already cancelled, wait after 14 days to send new request." });
    }

    // Check if the authenticated user is the sender of the request
    if (friendRequest.senderId.toString() !== senderId) {
      return res.status(403).json({ message: "You can only cancel your own friend requests." });
    }

    // Update the status of the friend request to 'cancelled'
    friendRequest.status = "cancelled";
    friendRequest.cancelledAt = new Date();

    await friendRequest.save();

    res.status(200).json({
      message: "Friend request cancelled successfully.",
      friendRequest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
};

// Get Pending Friend Requests
export const getPendingFriendRequests = async (req, res) => {
  const userId = req.user.id; // Authenticated user's ID

  try {
    // Fetch pending friend requests where the user is either the sender or receiver
    const pendingRequests = await FriendRequest.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
      status: "pending",
    })
      .populate("senderId", "fullName userName avatar") // Populate sender's details
      .populate("receiverId", "userName userName avatar") // Populate receiver's details
      .sort({ createdAt: -1 }); // Sort by the latest request

    res.status(200).json({
      message: "Pending friend requests fetched successfully.",
      pendingRequests,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching pending friend requests." });
  }
};

// Accept a Friend Request
export const acceptFriendRequest = async (req, res) => {
  const { requestId } = req.body; // ID of the friend request to accept
  const userId = req.user.id; // Authenticated user's ID

  try {
    // Validate the requestId
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ message: "Invalid friend request ID." });
    }

    // Find the friend request
    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found." });
    }

    // Ensure the user is the receiver of the friend request
    if (friendRequest.receiverId.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to accept this friend request." });
    }

    // Check if the request is still pending
    if (friendRequest.status !== "pending") {
      return res.status(400).json({
        message: `Cannot accept this request. Current status: ${friendRequest.status}.`,
      });
    }

    // Update the status of the friend request to 'accepted'
    friendRequest.status = "accepted";
    friendRequest.save();

    res.status(200).json({
      message: "Friend request accepted successfully.",
      friendRequest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while accepting the friend request." });
  }
};