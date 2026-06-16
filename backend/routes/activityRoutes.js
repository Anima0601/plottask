import express from "express";

import {
  getAllActivities,
  getProjectActivities,
} from "../controllers/activityController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllActivities);

router.get("/project/:projectId", protect, getProjectActivities);

export default router;
