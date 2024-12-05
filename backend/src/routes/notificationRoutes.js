import express from 'express';
import { protectRoute } from "../middleware/authMiddleware.js";
import { getNotifications, markAllAsRead, createNotification } from '../controllers/notificationController.js';

const router = express.Router();

router.post('/', protectRoute, createNotification);
router.get('/', protectRoute, getNotifications);
router.post('/mark-all-as-read', protectRoute, markAllAsRead); 

export default router;

