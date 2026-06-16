import Comment from "../models/Comment.js";
import Task from "../models/Task.js";
import { logActivity } from "../utils/activityLogger.js";

export const addComment = async (req, res) => {
  try {
    const { message } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const comment = await Comment.create({
      task: req.params.id,
      user: req.user._id,
      message,
    });

    await logActivity({
      project: task.project,
      task: task._id,
      user: req.user._id,
      action: "Added Comment",
    });
    
    if (task.assignee && task.assignee.toString() !== req.user._id.toString()) {
      await Notification.create({
        user: task.assignee,
        project: task.project,
        task: task._id,
        title: "New Comment",
        message: `New comment on task "${task.title}"`,
      });
    }

    res.status(201).json({
      success: true,
      message: "Comment added",
      comment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      task: req.params.id,
    })
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (
      comment.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await comment.deleteOne();

    await logActivity({
      task: comment.task,
      user: req.user._id,
      action: "Deleted Comment",
    });

    res.status(200).json({
      success: true,
      message: "Comment deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};