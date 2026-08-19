import Project from "../models/Project.js";
import Task from "../models/Task.js";
import Notification from "../models/Notification.js";
import { logActivity } from "../utils/activityLogger.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, project, assignee, status, priority, dueDate } =
      req.body;

    const uploadedFiles = req.files?.map((file) => ({
      fileName: file.originalname,
      fileUrl: file.path,
      uploadedAt: new Date(),
    }));

    const projectData = await Project.findById(project);

    if (!projectData) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (
      assignee &&
      !projectData.member.some((member) => member.toString() === assignee)
    ) {
      return res.status(400).json({
        message: "Assignee not part of project",
      });
    }
    const task = await Task.create({
      title,
      description,
      project,
      assignee,
      status,
      priority,
      dueDate,
      attachments: uploadedFiles,
      createdBy: req.user._id,
    });

    await logActivity({
      project: task.project,
      task: task._id,
      user: req.user._id,
      action: `Created Task: ${task.title}`,
    });

    try {
      if (assignee) {
        await Notification.create({
          user: assignee,
          project,
          task: task._id,
          title: "Task Assigned",
          message: `You have been assigned task "${title}"`,
        });
      }
    } catch (err) {
      console.error("Notification creation failed:", err);
    }

    res
      .status(201)
      .json({ success: true, message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const query = {};

    if (req.query.search) {
      query.title = {
        $regex: req.query.search,
        $options: "i",
      };
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.priority) {
      query.priority = req.query.priority;
    }

    if (req.query.assignee) {
      query.assignee = req.query.assignee;
    }

    if (req.query.project) {
      query.project = req.query.project;
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalTasks = await Task.countDocuments(query);

    const tasks = await Task.find(query)
      .populate("project", "title")
      .populate("assignee", "name email")
      .populate("createdBy", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      page,
      limit,
      totalTasks,
      totalPages: Math.ceil(totalTasks / limit),
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("project", "title member")
      .populate("assignee", "name email")
      .populate("createdBy", "name email");
    if (!task) {
      return res.status(404).json({ message: "Task Not Found" });
    }
    const isMember = task.project.member.some(
      (member) => member.toString() === req.user._id.toString(),
    );

    const isCreator =
      task.project.createdBy?.toString() === req.user._id.toString();

    if (!isMember && !isCreator && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const projectData = await Project.findById(task.project);

    if (!projectData) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Check new assignee
    if (
      req.body.assignee &&
      !projectData.member.some(
        (member) => member.toString() === req.body.assignee.toString(),
      )
    ) {
      return res.status(400).json({
        message: "Assignee not part of project",
      });
    }

    const uploadedFiles =
      req.files?.map((file) => ({
        fileName: file.originalname,
        fileUrl: file.path,
        uploadedAt: new Date(),
      })) || [];

    const oldStatus = task.status;
    const oldAssignee = task.assignee?.toString();

    // Update task fields
    Object.assign(task, req.body);

    // Add new attachments
    if (uploadedFiles.length > 0) {
      task.attachments.push(...uploadedFiles);
    }

    await task.save();

    // Activity log
    if (req.body.status && oldStatus !== task.status) {
      await logActivity({
        project: task.project,
        task: task._id,
        user: req.user._id,
        action: `Moved Task from ${oldStatus} to ${task.status}`,
      });
    } else {
      await logActivity({
        project: task.project,
        task: task._id,
        user: req.user._id,
        action: `Updated Task: ${task.title}`,
      });
    }

    // Notify new assignee
    if (req.body.assignee && req.body.assignee.toString() !== oldAssignee) {
      await Notification.create({
        user: req.body.assignee,
        project: task.project,
        task: task._id,
        title: "Task Assigned",
        message: `You have been assigned task "${task.title}"`,
      });
    }

    const updatedTask = await Task.findById(task._id)
      .populate("project", "title")
      .populate("assignee", "name email")
      .populate("createdBy", "name email");

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("UPDATE TASK ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Not Found" });
    }
    await task.deleteOne();
    await logActivity({
      project: task.project,
      task: task._id,
      user: req.user._id,
      action: `Deleted Task: ${task.title}`,
    });
    res.status(200).json({ message: "Task Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
