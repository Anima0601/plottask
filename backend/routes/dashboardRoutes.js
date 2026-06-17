import express from "express";
import {
  getDashboardStats,
  getMyStats,
} from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, getDashboardStats);
router.get("/mystats", protect,getMyStats);

export default router;
