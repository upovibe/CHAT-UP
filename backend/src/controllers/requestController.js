import mongoose from "mongoose";
import Notification from "../models/notification.js";
import FriendRequest from "../models/requestModel.js";
import BlockedUser from "../models/blockedUserModel.js";
import User from "../models/userModel.js";

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

    // Fetch the sender's details (avatar and fullName)
    const sender = await User.findById(senderId);
    const senderAvatar = sender?.avatar || ''; // Default to empty string if no avatar is found
    const senderFullName = sender?.fullName || ''; // Default to "Unknown User" if fullName is not found

    // Create the friend request
    const friendRequest = new FriendRequest({
      senderId,
      receiverId,
      status: "pending",
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7-day expiry
    });

    await friendRequest.save();

    // Send notification to the receiver
    await Notification.create({
      userId: receiverId,
      avatar: senderAvatar,
      fullName: senderFullName, // Include fullName in notification
      type: "friend_request",
      message: `${senderFullName} has sent you a friend request.`,
    });

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

// Get Cancelled Friend Requests
export const getCancelledFriendRequests = async (req, res) => {
  const userId = req.user.id; // Authenticated user's ID

  try {
    // Fetch cancelled friend requests where the user is the sender
    const cancelledRequests = await FriendRequest.find({
      senderId: userId, // Only fetch requests where the user is the sender
      status: "cancelled", // Ensure we're only fetching cancelled requests
    })
      .populate("senderId", "fullName userName avatar") // Populate sender's details
      .populate("receiverId", "fullName userName avatar") // Populate receiver's details
      .sort({ cancelledAt: -1 }); // Sort by the cancellation date

    // Check if there are any cancelled requests
    // if (!cancelledRequests || cancelledRequests.length === 0) {
    //   return res.status(404).json({ message: "No cancelled friend requests found." });
    // }

    // Send the response with cancelledRequests
    res.status(200).json({
      message: "Cancelled friend requests fetched successfully.",
      cancelledRequests, // Return the cancelledRequests data here
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching cancelled friend requests." });
  }
};

// Get Pending Friend Requests
export const getPendingFriendRequests = async (req, res) => {
  const userId = req.user.id; // Authenticated user's ID

  try {
    // For the sender, fetch the list of pending friend requests with populated sender and receiver details
    const pendingRequests = await FriendRequest.find({
      senderId: userId,
      status: "pending",
    })
      .populate("senderId", "fullName userName avatar") // Populate sender's details
      .populate("receiverId", "fullName userName avatar") // Populate receiver's details
      .sort({ createdAt: -1 }); // Sort by the latest request

    // Filter out blocked users
    const blockedUserIds = await BlockedUser.find({ blocker: userId })
      .select("blocked")
      .lean()
      .then((blocks) => blocks.map((block) => block.blocked));

    const filteredRequests = pendingRequests.filter(
      (request) => !blockedUserIds.includes(request.receiverId.toString())
    );

    res.status(200).json({
      message: "Pending friend requests fetched successfully.",
      pendingRequests: filteredRequests,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching pending friend requests." });
  }
};

// Get Received Friend Requests
export const getReceivedFriendRequests = async (req, res) => {
  const userId = req.user.id; // Authenticated user's ID

  try {
    // Fetch friend requests where the logged-in user is the receiver and the status is 'pending'
    const receivedRequests = await FriendRequest.find({
      receiverId: userId,
      status: "pending",
    })
      .populate("senderId", "fullName userName avatar")
      .sort({ createdAt: -1 });

    // Filter out blocked users
    const blockedUserIds = await BlockedUser.find({ blocker: userId })
      .select("blocked")
      .lean()
      .then((blocks) => blocks.map((block) => block.blocked));

    const filteredRequests = receivedRequests.filter(
      (request) => !blockedUserIds.includes(request.senderId.toString())
    );

    res.status(200).json({
      message: "Received friend requests fetched successfully.",
      receivedRequests: filteredRequests,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching received friend requests." });
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
    await friendRequest.save();

    // Fetch the receiver's details (authenticated user)
    const receiver = await User.findById(userId); 
    const receiverFullName = receiver?.fullName || 'Unknown User'; // Default to "Unknown User" if fullName is not found
    const receiverAvatar = receiver?.avatar || ''; // Default to empty string if no avatar is found

    // Send notification to the sender (that their request was accepted)
    await Notification.create({
      userId: friendRequest.senderId, // Sender of the friend request
      avatar: receiverAvatar,  // Include receiver's avatar in notification
      fullName: receiverFullName, // Include receiver's fullName in notification
      type: "friend_request",
      message: `${receiverFullName} has accepted your friend request.`,
    });

    res.status(200).json({
      message: "Friend request accepted successfully.",
      friendRequest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while accepting the friend request." });
  }
};

// Reject a Friend Request
export const rejectFriendRequest = async (req, res) => {
  const { requestId } = req.body; // ID of the friend request to reject
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
      return res.status(403).json({ message: "You are not authorized to reject this friend request." });
    }

    // Check if the request is still pending
    if (friendRequest.status !== "pending") {
      return res.status(400).json({
        message: `Cannot reject this request. Current status: ${friendRequest.status}.`,
      });
    }

    // Update the status of the friend request to 'rejected'
    friendRequest.status = "rejected";
    await friendRequest.save();

    res.status(200).json({
      message: "Friend request rejected successfully.",
      friendRequest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while rejecting the friend request." });
  }
};

// Get Friends List
export const getFriendsList = async (req, res) => {
  const userId = req.user.id; // Authenticated user's ID

  try {
    // Fetch blocked user IDs
    const blockedUserIds = await BlockedUser.find({ blocker: userId })
      .select("blocked")
      .lean()
      .then((blocks) => blocks.map((block) => block.blocked));

    // Fetch friends where the user is either the sender or receiver and status is "accepted"
    const friends = await FriendRequest.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
      status: "accepted",
      $nor: [{ senderId: { $in: blockedUserIds } }, { receiverId: { $in: blockedUserIds } }],
    })
      .populate("senderId", "fullName userName phoneNumber avatar email createdAt status isOnline lastSeenr")
      .populate("receiverId", "fullName userName phoneNumber avatar email createdAt status isOnline lastSeen")
      .sort({ updatedAt: -1 });

    // Transform the data to get a clean list of friends and exclude the authenticated user
    const friendsList = friends
      .map((friendRequest) => {
        const friend =
          friendRequest.senderId._id.toString() === userId
            ? friendRequest.receiverId
            : friendRequest.senderId;

        // Exclude the authenticated user from the list
        if (friend._id.toString() === userId) {
          return null; // Skip the authenticated user
        }

        return {
          id: friend._id,
          fullName: friend.fullName,
          userName: friend.userName,
          avatar: friend.avatar,
          phoneNumber: friend.phoneNumber,
          email: friend.email,
          createdAt: friend.createdAt,
          status: friend.status,
          isOnline: friend.isOnline,
          lastSeen: friend.lastSeen,
          email: friend.email,
          status: friend.status,
          isOnline: friend.isOnline,
          lastSeen: friend.lastSeen,
        };
      })
      .filter((friend) => friend !== null);

    res.status(200).json({
      message: "Friends list fetched successfully.",
      friends: friendsList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while fetching the friends list.",
    });
  }
};

