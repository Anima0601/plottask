import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { updateTask } from "../../store/slices/taskSlice";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Project {
  _id: string;
  title: string;
  member: User[];
}

interface Task {
  _id: string;
  title: string;
  description?: string;
  project: {
    _id: string;
    title: string;
  };
  assignee?: string | User;
  status: "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high";
  dueDate?: string;
}

interface UpdateTaskModalProps {
  open: boolean;
  onClose: () => void;
  task: Task;
  selectedProject: Project;
}

const UpdateTaskModal = ({
  open,
  onClose,
  task,
  selectedProject,
}: UpdateTaskModalProps) => {
  const dispatch = useAppDispatch();

  const { loading, error } = useAppSelector((state) => state.task);

  const [taskData, setTaskData] = useState<{
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    status: "todo" | "in-progress" | "review" | "done";
    assignedTo: string;
    dueDate: string;
    attachments: FileList | null;
  }>({
    title: "",
    description: "",
    priority: "medium",
    status: "todo",
    assignedTo: "",
    dueDate: "",
    attachments: null,
  });

  // Load existing task data into form
  useEffect(() => {
    if (!task) return;

    let assigneeId = "";

    if (typeof task.assignee === "string") {
      assigneeId = task.assignee;
    } else if (task.assignee?._id) {
      assigneeId = task.assignee._id;
    }

    setTaskData({
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "medium",
      status: task.status || "todo",
      assignedTo: assigneeId,
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().substring(0, 10)
        : "",
      attachments: null,
    });
  }, [task]);

  if (!open) return null;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", taskData.title);
    formData.append("description", taskData.description);
    formData.append("priority", taskData.priority);
    formData.append("status", taskData.status);
    formData.append("dueDate", taskData.dueDate);

    // Backend expects "assignee"
    if (taskData.assignedTo) {
      formData.append("assignee", taskData.assignedTo);
    }

    // Add new attachments
    if (taskData.attachments) {
      Array.from(taskData.attachments).forEach((file) => {
        formData.append("attachments", file);
      });
    }

    try {
      await dispatch(
        updateTask({
          taskId: task._id,
          taskData: formData,
        }),
      ).unwrap();

      onClose();
    } catch (error) {
      console.error("Update task failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="relative z-[10000] w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-800">Update Task</h2>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="cursor-pointer text-xl font-semibold leading-none text-slate-400 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            &times;
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdateTask} className="space-y-4">
          {/* Title */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Title
            </label>

            <input
              type="text"
              name="title"
              required
              value={taskData.title}
              onChange={handleInputChange}
              placeholder="Task title"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Description
            </label>

            <textarea
              name="description"
              rows={3}
              value={taskData.description}
              onChange={handleInputChange}
              placeholder="Task description..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Priority + Status */}
          <div className="grid grid-cols-2 gap-3">
            {/* Priority */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Priority
              </label>

              <select
                name="priority"
                value={taskData.priority}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs focus:border-indigo-500 focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Status
              </label>

              <select
                name="status"
                value={taskData.status}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs focus:border-indigo-500 focus:outline-none"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          {/* Assignee + Due Date */}
          <div className="grid grid-cols-2 gap-3">
            {/* Assignee */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Assign To
              </label>

              <select
                name="assignedTo"
                value={taskData.assignedTo}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs focus:border-indigo-500 focus:outline-none"
              >
                <option value="">Unassigned</option>

                {selectedProject.member?.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Due Date
              </label>

              <input
                type="date"
                name="dueDate"
                value={taskData.dueDate}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-300 px-2.5 py-2 text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Attachments */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Add Attachments
            </label>

            <input
              type="file"
              multiple
              onChange={(e) =>
                setTaskData((prev) => ({
                  ...prev,
                  attachments: e.target.files,
                }))
              }
              className="w-full cursor-pointer text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="cursor-pointer rounded-lg border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTaskModal;
