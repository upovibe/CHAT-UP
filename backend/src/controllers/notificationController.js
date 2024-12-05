import Notification from '../models/notification.js';

// Get all notifications for the authenticated user
export const getNotifications = async (req, res) => {
  const userId = req.user.id; // Authenticated user's ID

  try {
    const notifications = await Notification.find({ userId })
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
      { userId, read: false },
      { $set: { read: true } } 
    );

    res.status(200).json({ message: "All notifications marked as read." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while marking notifications as read." });
  }
};