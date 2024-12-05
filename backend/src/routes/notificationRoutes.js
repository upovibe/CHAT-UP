import express from 'express';
import { protectRoute } from "../middleware/authMiddleware.js";
import { getNotifications, markAllAsRead } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', protectRoute, getNotifications);
router.post('/mark-all-as-read', protectRoute, markAllAsRead); 

export default router;

