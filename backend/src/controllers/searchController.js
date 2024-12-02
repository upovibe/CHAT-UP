import User from "../models/userModel.js";

// Search users by username
export const searchUsers = async (req, res) => {
  const { username } = req.query;  // Assume the search term is passed as a query parameter

  try {
    if (!username) {
      return res.status(400).json({ message: "Username query parameter is required." });
    }

    // Use regular expression to search users by username (case-insensitive)
    const users = await User.find({
      userName: { $regex: username, $options: "i" },  // 'i' for case-insensitive search
    }).select("fullName userName avatar");  // Only return relevant fields

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error during search:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};
