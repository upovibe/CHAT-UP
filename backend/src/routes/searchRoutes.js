import express from "express";
import { searchUsers } from "../controllers/searchController.js";

const router = express.Router();

// Route to search users by username
router.get("/search", searchUsers);

export default router;
