import express from "express";
import { getUsers } from "../controllers/userController.js";
import { protect, authorizeUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeUser("admin"), getUsers);

export default router;
