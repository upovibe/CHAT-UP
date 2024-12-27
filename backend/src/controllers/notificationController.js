import Notification from '../models/notification.js';

// Create a new Notification
export const createNotification = async (req, res) => {
  const { userId, message, type } = req.body;

  try {
    // Save the notification in the database
    const notification = await Notification.create({
      userId,
      message,
      type,
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error('Failed to create notification:', error);
    res.status(500).json({ message: 'Failed to create notification.' });
  }
};

// Get all active (non-deleted) notifications for the authenticated user
export const getNotifications = async (req, res) => {
  const userId = req.user.id; // Authenticated user's ID

  try {
    const notifications = await Notification.find({ userId, deleted: false }) // Exclude deleted notifications
      .sort({ createdAt: -1 })
      .populate('userId', 'fullName userName avatar');

    res.status(200).json({ notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching notifications." });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  const userId = req.user.id; // Authenticated user's ID

  try {
    // Update all unread notifications for the user
    await Notification.updateMany(
      { userId, read: false, deleted: false },
      { $set: { read: true } }
    );

    res.status(200).json({ message: "All notifications marked as read." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while marking notifications as read." });
  }
};

// Clear (soft delete) all notifications for the authenticated user
export const clearNotifications = async (req, res) => {
  const userId = req.user.id; // Authenticated user's ID

  try {
    // Soft delete notifications by setting the 'deleted' field to true
    await Notification.updateMany(
      { userId },
      { $set: { deleted: true } }
    );

    res.status(200).json({ message: "All notifications cleared successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while clearing notifications." });
  }
};

// Clear (soft delete) a specific notification
export const clearNotification = async (req, res) => {
  const { notificationId } = req.body; // Notification ID to be cleared
  const userId = req.user.id; // Authenticated user's ID

  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId }, // Ensure the notification belongs to the user
      { $set: { deleted: true } },
      { new: true } // Return the updated document
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.status(200).json({ message: "Notification cleared successfully.", notification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while clearing the notification." });
  }
};
