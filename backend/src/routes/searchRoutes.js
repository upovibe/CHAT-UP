import express from "express";
import { searchUsers } from "../controllers/searchController.js";
import { protectRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to search users by username
router.get("/search", protectRoute, searchUsers);

export default router;
