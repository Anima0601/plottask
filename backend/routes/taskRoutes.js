import express from "express";
import {createTask,getTasks,getTaskById,updateTask,deleteTask} from "../controllers/taskController.js";
import {protect,authorizeUser} from "../middleware/authMiddleware.js"
import upload from "../middleware/uploadMiddleware.js"
import { addComment, getComments } from "../controllers/commentController.js";

const router = express.Router();

router.post("/",protect,authorizeUser("admin","manager"),upload.array("attachments",5),createTask);
router.get("/",protect,getTasks);
router.get("/:id",protect,getTaskById);
router.put("/:id",protect,authorizeUser("admin","manager"),upload.array("attachments",5),updateTask);
router.delete("/:id",protect,authorizeUser("admin"),deleteTask);

router.post(
  "/:id/comments",
  protect,
  addComment,
);


router.get(
  "/:id/comments",
  protect,
  getComments,
);
export default router;
