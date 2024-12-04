import mongoose from "mongoose";
import FriendRequest from "../models/requestModel.js";
import BlockedUser from "../models/blockedUserModel.js";

// Send a Friend Request
export const sendFriendRequest = async (req, res) => {
  const { recipientId } = req.body;
  const senderId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(recipientId)) {
    return res.status(400).json({ message: "Invalid sender or recipient ID" });
  }

  try {
    const blockExists = await BlockedUser.findOne({
      $or: [
        { blocker: senderId, blocked: recipientId },
        { blocker: recipientId, blocked: senderId },
      ],
    });

    if (blockExists) {
      return res.status(403).json({ message: "Cannot send friend request. One of the users has blocked the other." });
    }

    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      recipient: recipientId,
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent!" });
    }

    const friendRequest = new FriendRequest({ sender: senderId, recipient: recipientId, status: "pending" });
    await friendRequest.save();
    res.status(201).json({ message: "Friend request sent!", friendRequest });
  } catch (error) {
    res.status(500).json({ message: "Error sending friend request", error: error.message });
  }
};

// Accept a Friend Request
export const acceptFriendRequest = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid friend request ID" });
  }

  try {
    const request = await FriendRequest.findById(id);

    if (!request) {
      return res.status(404).json({ message: "Friend request not found!" });
    }

    request.status = "accepted";
    await request.save();

    res.status(200).json({ message: "Friend request accepted!", request });
  } catch (error) {
    res.status(500).json({ message: "Error accepting friend request", error: error.message });
  }
};

// Decline a Friend Request
export const declineFriendRequest = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid friend request ID" });
  }

  try {
    const request = await FriendRequest.findById(id);

    if (!request) {
      return res.status(404).json({ message: "Friend request not found!" });
    }

    request.status = "declined";
    await request.save();

    res.status(200).json({ message: "Friend request declined.", request });
  } catch (error) {
    res.status(500).json({ message: "Error declining friend request", error: error.message });
  }
};

// Delete a Friend Request
export const deleteFriendRequest = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid friend request ID" });
  }

  try {
    const request = await FriendRequest.findByIdAndDelete(id);

    if (!request) {
      return res.status(404).json({ message: "Friend request not found." });
    }

    res.status(200).json({ message: "Friend request deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting friend request", error: error.message });
  }
};

// Get Friend Requests
export const getFriendRequests = async (req, res) => {
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const requests = await FriendRequest.find({
      recipient: userId,
      status: "pending",
    }).populate("sender", "userName fullName avatar");

    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ message: "Error fetching friend requests", error: error.message });
  }
};

// Get Sent Friend Requests
export const getSentRequests = async (req, res) => {
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const sentRequests = await FriendRequest.find({
      sender: userId,
      status: "pending", // Optional: filter by "pending" status
    }).populate("recipient", "userName fullName avatar");

    const formattedRequests = sentRequests.map((request) => ({
      id: request.recipient._id,
      userName: request.recipient.userName,
      fullName: request.recipient.fullName,
      avatar: request.recipient.avatar,
    }));

    res.status(200).json({ sentRequests: formattedRequests });
  } catch (error) {
    res.status(500).json({ message: "Error fetching sent requests", error: error.message });
  }
};

// Get Friends List
export const getFriendsList = async (req, res) => {
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const friends = await FriendRequest.find({
      $or: [
        { sender: userId, status: "accepted" },
        { recipient: userId, status: "accepted" },
      ],
    })
      .populate("sender", "userName fullName avatar")
      .populate("recipient", "userName fullName avatar");

    const friendsList = friends.map((friend) => {
      const isSender = friend.sender._id.toString() === userId;
      const friendData = isSender ? friend.recipient : friend.sender;

      return {
        id: friendData._id,
        userName: friendData.userName,
        fullName: friendData.fullName,
        avatar: friendData.avatar,
      };
    });

    res.status(200).json({ friends: friendsList });
  } catch (error) {
    res.status(500).json({ message: "Error fetching friends list", error: error.message });
  }
};
