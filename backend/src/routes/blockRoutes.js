import express from "express";
import { blockUser, unblockUser } from "../controllers/blockController.js";
import { protectRoute } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post("/block", protectRoute, blockUser);
router.post("/unblock", protectRoute, unblockUser);

export default router;