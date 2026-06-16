import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
