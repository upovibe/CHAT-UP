import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: null,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    isGroupChat: {
      type: Boolean,
      default: false, // Determines if it's a group chat or one-on-one
    },
    lastMessage: {
      type: String,
      default: null, // Store the last message for quick preview
    },
    lastMessageAt: {
      type: Date,
      default: null, // Timestamp for the last message
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
