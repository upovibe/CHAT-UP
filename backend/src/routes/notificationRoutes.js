import express from 'express';
import { protectRoute } from "../middleware/authMiddleware.js";
import { 
  getNotifications, 
  markAllAsRead, 
  createNotification, 
  clearNotifications, 
  clearNotification 
} from '../controllers/notificationController.js';

const router = express.Router();

// Create a new notification
router.post('/', protectRoute, createNotification);

// Get all active (non-deleted) notifications
router.get('/', protectRoute, getNotifications);

// Mark all notifications as read
router.post('/mark-all-as-read', protectRoute, markAllAsRead);

// Clear (soft delete) all notifications
router.post('/clear-all', protectRoute, clearNotifications);

// Clear (soft delete) a specific notification
router.post('/clear', protectRoute, clearNotification);

export default router;
