import Comment from "../models/Comment.js";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import Notification from "../models/Notification.js";
import { logActivity } from "../utils/activityLogger.js";

export const addComment = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        message: "Comment message is required",
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const project = await Project.findById(task.project);

    const isMember = project.member.some(
      (member) => member.toString() === req.user._id.toString(),
    );

    if (!isMember) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const comment = await Comment.create({
      task: task._id,
      user: req.user._id,
      message,
    });

    await logActivity({
      project: task.project,
      task: task._id,
      user: req.user._id,
      action: "Added Comment",
    });

  const recipients = new Set();

  project.member.forEach((memberId) => {
    if (memberId.toString() !== req.user._id.toString()) {
      recipients.add(memberId.toString());
    }
  });

  if (project.createdBy.toString() !== req.user._id.toString()) {
    recipients.add(project.createdBy.toString());
  }

  for (const userId of recipients) {
    await Notification.create({
      user: userId,
      project: task.project,
      task: task._id,
      title: "New Comment",
      message: `${req.user.name} commented on "${task.title}"`,
    });

  }
    const populatedComment = await Comment.findById(comment._id).populate(
      "user",
      "name email role",
    );

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: populatedComment,
    }); 
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const project = await Project.findById(task.project);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // ADMIN can always view comments
    if (req.user.role === "admin") {
      const comments = await Comment.find({
        task: req.params.id,
      })
        .populate("user", "name email role")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        comments,
      });
    }

    // Check project membership
    const isMember = project.member.some(
      (member) => member.toString() === req.user._id.toString(),
    );

    // Project creator can view comments
    const isCreator = project.createdBy?.toString() === req.user._id.toString();

    if (!isMember && !isCreator) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const comments = await Comment.find({
      task: req.params.id,
    })
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error("GET COMMENTS ERROR:", error);

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
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
