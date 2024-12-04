import mongoose from "mongoose";
const { Schema } = mongoose;

// Define the friend request schema
const friendRequestSchema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "canceled", "expired"],
      default: "pending",
    },
    createdAt: { type: Date, default: Date.now },
    canceledAt: { type: Date, default: null },
    expiryDate: { type: Date, required: true },
  },
  { timestamps: true }
);

friendRequestSchema.index({ senderId: 1, receiverId: 1 });
friendRequestSchema.index({ status: 1 }); // Index for efficient status-based filtering (pending, accepted, etc.)
friendRequestSchema.index({ expiryDate: 1 }); // Index for efficient querying by expiry date

// Create the model from the schema
const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);

export default FriendRequest;
