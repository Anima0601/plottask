import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();

    const totalTasks = await Task.countDocuments();

    const todoTasks = await Task.countDocuments({
      status: "todo",
    });

    const inProgressTasks = await Task.countDocuments({
      status: "in-progress",
    });

    const reviewTasks = await Task.countDocuments({
      status: "review",
    });

    const doneTasks = await Task.countDocuments({
      status: "done",
    });

    res.status(200).json({
      success: true,
      totalProjects,
      totalTasks,
      todoTasks,
      inProgressTasks,
      reviewTasks,
      doneTasks,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
