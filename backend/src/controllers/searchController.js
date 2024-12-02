import User from "../models/userModel.js";
import BlockedUser from "../models/blockedUserModel.js";

// Search users by username
export const searchUsers = async (req, res) => {
  const { username } = req.query;
  const userId = req.user?.id;

  try {
    if (!username) {
      return res.status(400).json({ message: "Username query parameter is required." });
    }

    // Find users who have blocked or are blocked by the authenticated user
    const blockedUsers = await BlockedUser.find({
      $or: [
        { blocker: userId },
        { blocked: userId },
      ],
    });

    // Extract blocked user IDs
    const blockedUserIds = blockedUsers.map(block => (
      block.blocker.toString() === userId ? block.blocked : block.blocker
    ));

    const users = await User.find({
      userName: { $regex: username, $options: "i" },  // 'i' for case-insensitive search
      _id: { $ne: userId, $nin: blockedUserIds },  // Exclude the authenticated user and blocked users
    }).select("fullName userName avatar");  // Only return relevant fields

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error during search:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};
