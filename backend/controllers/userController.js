import User from "../models/User.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "member" }, "name email role");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
