import Activity from "../models/Activity.js";

export const getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate("user", "name email role")
      .populate("project", "title")
      .populate("task", "title")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProjectActivities = async (req, res) => {
  try {
    const activities = await Activity.find({
      project: req.params.projectId,
    })
      .populate("user", "name email role")
      .populate("project", "title")
      .populate("task", "title")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
