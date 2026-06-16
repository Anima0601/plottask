import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  getAllMembers,
  removeMember,
} from "../controllers/projectController.js";
import { protect, authorizeUser } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeUser("admin", "manager"),
  upload.array("attachments", 5),
  createProject,
);

router.get("/", protect, getProjects);

router.get("/:id", protect, getProjectById);

router.put(
  "/:id",
  protect,
  authorizeUser("admin", "manager"),
  upload.array("attachments", 5),
  updateProject,
);

router.delete("/:id", protect, authorizeUser("admin"), deleteProject);

router.post(
  "/:id/members",
  protect,
  authorizeUser("admin", "manager"),
  addMember,
);

router.get("/:id/members", protect, getAllMembers);

router.delete(
  "/:id/members/:userId",
  protect,
  authorizeUser("admin", "manager"),
  removeMember,
);

export default router;
