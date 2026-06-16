import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  redirectAdmin,
} from "../controllers/authController.js";
import { protect, authorizeUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getProfile);
router.post("/logout", logoutUser);
router.get("/admin", protect, authorizeUser("admin"), redirectAdmin);

export default router;
