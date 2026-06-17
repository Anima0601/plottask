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

export const getMyStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      assignedProjects,
      assignedTasks,
      pendingTasks,
      inProgressTasks,
      reviewTasks,
      completedTasks,
      overdueTasks,
    ] = await Promise.all([
      Project.countDocuments({
        member: userId,
      }),

      Task.countDocuments({
        assignee: userId,
      }),

      Task.countDocuments({
        assignee: userId,
        status: "todo",
      }),

      Task.countDocuments({
        assignee: userId,
        status: "in-progress",
      }),

      Task.countDocuments({
        assignee: userId,
        status: "review",
      }),

      Task.countDocuments({
        assignee: userId,
        status: "done",
      }),

      Task.countDocuments({
        assignee: userId,
        dueDate: { $lt: new Date() },
        status: { $ne: "done" },
      }),
    ]);

    return res.status(200).json({
      assignedProjects,
      assignedTasks,
      pendingTasks,
      inProgressTasks,
      reviewTasks,
      completedTasks,
      overdueTasks,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};