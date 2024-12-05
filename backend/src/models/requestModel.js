import mongoose from "mongoose";
const { Schema } = mongoose;

// Define the friend request schema
const friendRequestSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending", 
        "accepted", 
        "rejected", 
        "cancelled",
        "expired"
      ],
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Indexes for efficient queries
friendRequestSchema.index({ senderId: 1, receiverId: 1 });
friendRequestSchema.index({ status: 1 }); // Index for filtering based on status (pending, accepted, etc.)
friendRequestSchema.index({ expiryDate: 1 }); // Index for filtering based on expiry date

// Create the model from the schema
const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);

export default FriendRequest;
