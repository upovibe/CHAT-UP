import mongoose from "mongoose";
import FriendRequest from "../models/requestModel.js";
import BlockedUser from "../models/blockedUserModel.js";

// Send a Friend Request
export const sendFriendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body; // Extract the receiver's user ID from the request body
    const senderId = req.user.id; // Assume `req.user.id` contains the logged-in user's ID (via middleware)

    // Ensure sender and receiver are not the same
    if (senderId === receiverId) {
      return res.status(400).json({ message: "You cannot send a friend request to yourself." });
    }

    // Check if the receiver is blocked by the sender
    const isBlocked = await BlockedUser.findOne({
      $or: [
        { blockerId: senderId, blockedId: receiverId },
        { blockerId: receiverId, blockedId: senderId },
      ],
    });
    if (isBlocked) {
      return res.status(403).json({ message: "You cannot send a friend request to this user." });
    }

    // Check if there's already a friend request between the sender and receiver
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

    // Create a new friend request
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


// Send a Friend Request
// export const sendFriendRequest = async (req, res) => {
//   const { recipientId } = req.body;
//   const senderId = req.user.id;

//   if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(recipientId)) {
//     return res.status(400).json({ message: "Invalid sender or recipient ID" });
//   }

//   try {
//     const blockExists = await BlockedUser.findOne({
//       $or: [
//         { blocker: senderId, blocked: recipientId },
//         { blocker: recipientId, blocked: senderId },
//       ],
//     });

//     if (blockExists) {
//       return res.status(403).json({ message: "Cannot send friend request. One of the users has blocked the other." });
//     }

//     const existingRequest = await FriendRequest.findOne({
//       sender: senderId,
//       recipient: recipientId,
//     });

//     if (existingRequest) {
//       return res.status(400).json({ message: "Request already sent!" });
//     }

//     const friendRequest = new FriendRequest({ sender: senderId, recipient: recipientId, status: "pending" });
//     await friendRequest.save();
//     res.status(201).json({ message: "Friend request sent!", friendRequest });
//   } catch (error) {
//     res.status(500).json({ message: "Error sending friend request", error: error.message });
//   }
// };

