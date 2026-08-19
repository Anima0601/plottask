import Project from "../models/Project.js";
import { logActivity } from "../utils/activityLogger.js";
import Notification from "../models/Notification.js";
export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      member,
      status,
      priority,
      startDate,
      endDate,
      visibility,
    } = req.body;

    console.log(req.body);
    console.log(req.body.member);

    const uploadFiles =
      req.files?.map((file) => ({
        fileName: file.originalname,
        fileUrl: file.path,
        uploadedAt: new Date(),
      })) || [];

    const project = await Project.create({
      title,
      description,
      member,
      status,
      priority,
      startDate,
      endDate,
      visibility,
      attachments: uploadFiles,
      createdBy: req.user._id,
    });

    await logActivity({
      project: project._id,
      user: req.user._id,
      action: `Created Project: ${project.title}`,
    });

    if (project.member?.length) {
      await Notification.insertMany(
        project.member
          .filter((memberId) => memberId.toString() !== req.user._id.toString())
          .map((memberId) => ({
            user: memberId,
            project: project._id,
            title: "Added to Project",
            message: `${req.user.name} added you to project "${project.title}"`,
          })),
      );
    }

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProjects = async (req, res) => {
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

    if (req.query.createdBy) {
      query.createdBy = req.query.createdBy;
    }

    if (req.query.visibility) {
      query.visibility = req.query.visibility;
    }

    query.$or = [
      {
        visibility: "public",
      },
      {
        visibility: "team",
      },
      {
        visibility: "private",
        member: req.user._id,
      },
      {
        createdBy: req.user._id,
      },
    ];

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalProjects = await Project.countDocuments(query);

    const projects = await Project.find(query)
      .populate("createdBy", "name email")
      .populate("member", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      page,
      limit,
      totalProjects,
      totalPages: Math.ceil(totalProjects / limit),
      projects,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("member", " name email");
    if (!project) {
      return res.status(404).json({ message: "Not Found" });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const {
      title,
      description,
      status,
      priority,
      startDate,
      endDate,
      visibility,
      member,
    } = req.body;

    // Update normal project fields
    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (status !== undefined) project.status = status;
    if (priority !== undefined) project.priority = priority;
    if (startDate !== undefined) project.startDate = startDate;
    if (endDate !== undefined) project.endDate = endDate;
    if (visibility !== undefined) project.visibility = visibility;

    // Update members
    if (member !== undefined) {
      let members;

      try {
        members = JSON.parse(member);
      } catch {
        members = Array.isArray(member) ? member : [member];
      }

      project.member = members;
    }

    // New attachments
    const uploadedFiles =
      req.files?.map((file) => ({
        fileName: file.originalname,
        fileUrl: file.path,
        uploadedAt: new Date(),
      })) || [];

    if (uploadedFiles.length > 0) {
      project.attachments.push(...uploadedFiles);
    }

    await project.save();

    await logActivity({
      project: project._id,
      user: req.user._id,
      action: `Updated Project: ${project.title}`,
    });

    const updatedProject = await Project.findById(project._id).populate(
      "member",
      "name email role",
    );

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("UPDATE PROJECT ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Not Found" });
    }
    await project.deleteOne();
    res.status(200).json({ message: "Project Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project Does Not Exist" });
    }
    if (project.member.includes(userId)) {
      return res.status(400).json({ message: "User Already Added" });
    }

    project.member.push(userId);

    await project.save();
    await logActivity({
      project: project._id,
      user: req.user._id,
      action: `Added Member ${userId}`,
    });

    await Notification.create({
      user: userId,
      project: project._id,
      title: "Project Membership",
      message: `You were added to project ${project.title}`,
    });

    res.status(200).json({
      success: true,
      message: "Member added",
      members: project.member,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllMembers = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "member",
      "name email role",
    );
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(project.member);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    project.member = project.member.filter(
      (m) => m.toString() !== req.params.userId,
    );

    await project.save();

    await logActivity({
      project: project._id,
      user: req.user._id,
      action: `Removed Member ${req.params.userId}`,
    });

    res.status(200).json({
      success: true,
      message: "Member removed",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
