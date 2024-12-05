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

    // Log the notification details
    // console.log('Notification created:', notification);

    // Emit the notification to the specific user via Socket.IO
    req.io.to(userId).emit('notification', notification);

    res.status(201).json(notification);
  } catch (error) {
    console.error('Failed to create notification:', error);
    res.status(500).json({ message: 'Failed to create notification.' });
  }
};

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