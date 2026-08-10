import React, { useState } from "react";
import { useAppDispatch } from "../../store/hook";
import { createTask } from "../../store/slices/taskSlice";

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

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  selectedProject: Project;
}

const CreateTaskModal = ({
  open,
  onClose,
  selectedProject,
}: CreateTaskModalProps) => {
  const dispatch = useAppDispatch();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignedTo: "",
    dueDate: "",
    attachments: null as FileList | null,
  });

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

  const resetForm = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "medium",
      assignedTo: "",
      dueDate: "",
      attachments: null,
    });
  };

  const handleCreateTaskSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("project", selectedProject._id);
      formData.append("title", taskData.title);
      formData.append("description", taskData.description);
      formData.append("priority", taskData.priority);

      // Every newly created task starts in To Do
      formData.append("status", "todo");

      if (taskData.assignedTo) {
        formData.append("assignee", taskData.assignedTo);
      }

      if (taskData.dueDate) {
        formData.append("dueDate", taskData.dueDate);
      }

      if (taskData.attachments) {
        Array.from(taskData.attachments).forEach((file) => {
          formData.append("attachments", file);
        });
      }

      await dispatch(createTask(formData)).unwrap();

      resetForm();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-bold text-slate-800">Create Task</h2>

          <button
            type="button"
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="text-2xl text-slate-400 hover:text-slate-700"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleCreateTaskSubmit} className="space-y-5 p-6">
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
              placeholder="Enter task title"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Description
            </label>

            <textarea
              rows={4}
              name="description"
              value={taskData.description}
              onChange={handleInputChange}
              placeholder="Describe the task..."
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          {/* Priority + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Priority
              </label>

              <select
                name="priority"
                value={taskData.priority}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Initial Status
              </label>

              <div className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-500">
                To Do
              </div>
            </div>
          </div>

          {/* Assignee + Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Assign To
              </label>

              <select
                name="assignedTo"
                value={taskData.assignedTo}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">Unassigned</option>

                {selectedProject.member.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Due Date
              </label>

              <input
                type="date"
                name="dueDate"
                value={taskData.dueDate}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Attachments */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Attachments
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
              className="w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-indigo-600 hover:file:bg-indigo-100"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
