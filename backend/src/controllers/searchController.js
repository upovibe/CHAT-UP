import User from "../models/userModel.js";

// Search users by username
export const searchUsers = async (req, res) => {
  const { username } = req.query;
  const userId = req.user?.id;

  try {
    if (!username) {
      return res.status(400).json({ message: "Username query parameter is required." });
    }

    const users = await User.find({
      userName: { $regex: username, $options: "i" },  // 'i' for case-insensitive search
      _id: { $ne: userId },  // Exclude the authenticated user's ID
    }).select("fullName userName avatar");  // Only return relevant fields

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error during search:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};
