import Activity from "../models/Activity.js";

export const logActivity = async ({
  project = null,
  task = null,
  user,
  action,
}) => {
  try {
    await Activity.create({
      project,
      task,
      user,
      action,
    });
  } catch (error) {
    console.error("Activity Log Error:", error);
  }
};
