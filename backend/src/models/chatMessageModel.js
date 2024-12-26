import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  text: {
    type: String,
  },
  attachments: [
    {
      url: {
        type: String,
      },
      type: {
        type: String,
        enum: ["image"],
      },
    },
  ],
}, { timestamps: true });

const ChatMessage = mongoose.model("ChatMessage", chatSchema);
export default ChatMessage;