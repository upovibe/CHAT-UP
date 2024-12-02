import mongoose from "mongoose";
import BlockedUser from "../models/blockedUserModel.js";

// Block a User
export const blockUser = async (req, res) => {
  const { userId } = req.body;
  const blockerId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const existingBlock = await BlockedUser.findOne({
      blocker: blockerId,
      blocked: userId,
    });

    if (existingBlock) {
      return res.status(400).json({ message: "User already blocked" });
    }

    const block = new BlockedUser({ blocker: blockerId, blocked: userId });
    await block.save();

    res.status(201).json({ message: "User blocked successfully", block });
  } catch (error) {
    res.status(500).json({ message: "Error blocking user", error: error.message });
  }
};

// Unblock a User
export const unblockUser = async (req, res) => {
  const { userId } = req.body;
  const blockerId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const block = await BlockedUser.findOneAndDelete({
      blocker: blockerId,
      blocked: userId,
    });

    if (!block) {
      return res.status(404).json({ message: "Block relationship not found" });
    }

    res.status(200).json({ message: "User unblocked successfully" });
  } catch (error) {
    res.status  .status(500).json({ message: "Error unblocking user", error: error.message });
  }
};
