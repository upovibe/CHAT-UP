import express from 'express';
import { signup, login, logout, updateProfile, checkAuth, updateVisibilityPreferences, getVisibilityPreferences } from '../controllers/authController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

// signUp routes
router.post('/signup', signup)

// Login routes
router.post('/login', login)

// Logout routes
router.post('/logout', logout)

// Update profile routes
router.put('/update-profile', protectRoute, updateProfile);

// Check Authentication routes
router.get('/status', protectRoute, checkAuth);

// Update visibility preferences route
router.put('/visibility-preferences', protectRoute, updateVisibilityPreferences);

// Get visibility preferences route
router.get('/visibility-preferences', protectRoute, getVisibilityPreferences);

export default router;