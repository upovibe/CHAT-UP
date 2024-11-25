import FriendRequest from "../models/requestModel.js";

// Send a Friend Request
export const sendFriendRequest = async (req, res) => {
  const { senderId, recipientId } = req.body;
  try {
    // Check if a request already exists
    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      recipient: recipientId,
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent!" });
    }

    // Create a new friend request
    const friendRequest = new FriendRequest({ sender: senderId, recipient: recipientId });
    await friendRequest.save();
    res.status(201).json({ message: "Friend request sent!", friendRequest });
  } catch (error) {
    res.status(500).json({ message: "Error sending friend request", error });
  }
};

// Accept a Friend Request
export const acceptFriendRequest = async (req, res) => {
  const { id } = req.params; // FriendRequest ID
  try {
    // Update request to accepted
    const request = await FriendRequest.findByIdAndUpdate(
      id,
      { status: "accepted" },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: "Friend request not found!" });
    }

    res.status(200).json({ message: "Friend request accepted!", request });
  } catch (error) {
    res.status(500).json({ message: "Error accepting friend request", error });
  }
};

// Decline a Friend Request
export const declineFriendRequest = async (req, res) => {
  const { id } = req.params; // FriendRequest ID
  try {
    // Update request to declined
    const request = await FriendRequest.findByIdAndUpdate(
      id,
      { status: "declined" },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: "Friend request not found!" });
    }

    res.status(200).json({ message: "Friend request declined!", request });
  } catch (error) {
    res.status(500).json({ message: "Error declining friend request", error });
  }
};

// Get Friend Requests
export const getFriendRequests = async (req, res) => {
  const { userId } = req.query; // Logged-in user ID
  try {
    const requests = await FriendRequest.find({
      recipient: userId,
      status: "pending",
    }).populate("sender", "username avatar");
    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ message: "Error fetching friend requests", error });
  }
};

// Remove Friend Requests
export const removeFriend = async (req, res) => {
  try {
    const userId = req.user.id;
    const { friendId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(friendId)) {
      return res.status(400).json({ message: "Invalid friend ID" });
    }

    const friendship = await FriendRequest.findOneAndDelete({
      $or: [
        { sender: userId, recipient: friendId, status: "accepted" },
        { sender: friendId, recipient: userId, status: "accepted" },
      ],
    });

    if (!friendship) {
      return res.status(404).json({ message: "Friendship not found" });
    }

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (err) {
    console.error("Error removing friend:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
