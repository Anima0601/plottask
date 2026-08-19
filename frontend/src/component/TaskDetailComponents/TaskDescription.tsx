import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { deleteTask } from "../../store/slices/taskSlice";
import { useToast } from "../../context/ToastContext"; // Adjust path to match your ToastContext

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Project {
  _id: string;
  title: string;
}

export interface Attachment {
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  project: Project;
  assignee?: string | User;
  createdBy: string | User;
  status: "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high";
  dueDate?: string;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

interface TaskProps {
  selectedTask: Task;
}

const TaskDescription = ({ selectedTask }: TaskProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { user } = useAppSelector((state) => state.auth);
  const { loading } = useAppSelector((state) => state.task);

  const isAdmin = user?.role === "admin";

  const assignee =
    typeof selectedTask.assignee === "string"
      ? selectedTask.assignee
      : selectedTask.assignee?.name || "Unassigned";

  const createdBy =
    typeof selectedTask.createdBy === "string"
      ? selectedTask.createdBy
      : selectedTask.createdBy?.name || "Unknown";

  const confirmDeleteTask = async () => {
    try {
      setIsDeleting(true);

      await dispatch(deleteTask(selectedTask._id)).unwrap();
      toast("Task deleted successfully!", "success");

      setIsDeleteModalOpen(false);

      setTimeout(() => {
        navigate(`/projects/${selectedTask.project._id}`);
      }, 500);
    } catch (error) {
      toast(
        typeof error === "string" ? error : "Failed to delete task",
        "error",
      );
      console.error("Delete task failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "None";
    const d = new Date(dateString);
    return isNaN(d.getTime())
      ? "Invalid Date"
      : d.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  };

  const getStatusColor = () => {
    switch (selectedTask.status) {
      case "done":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 uppercase";
      case "review":
        return "bg-blue-50 text-blue-700 border-blue-200 uppercase";
      case "in-progress":
        return "bg-amber-50 text-amber-700 border-amber-200 uppercase";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 uppercase";
    }
  };

  const getPriorityColor = () => {
    switch (selectedTask.priority) {
      case "high":
        return "bg-rose-50 text-rose-700 border-rose-100 capitalize";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-100 capitalize";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200 capitalize";
    }
  };

  return (
    <div className="mx-auto max-w-7xl bg-slate-50 font-sans antialiased p-4 sm:p-6 lg:p-8">
      {/* Upper Context Breadcrumbs Bar with Delete Control */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4 text-xs border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-2 text-slate-400 font-medium">
          <span
            className="cursor-pointer hover:text-slate-600 transition-colors"
            onClick={() => navigate(`/projects/${selectedTask.project._id}`)}
          >
            {selectedTask.project.title}
          </span>
          <span>/</span>
          <span className="text-slate-600 font-semibold truncate max-w-[280px]">
            {selectedTask.title}
          </span>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={loading || isDeleting}
            className="cursor-pointer rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            {isDeleting ? "Deleting..." : "Delete Task"}
          </button>
        )}
      </div>

      {/* Two-Column Workspace Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* LEFT COMPONENT: Core Ticket Context Info (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-6">
            {/* Ticket Header Title */}
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight sm:text-3xl leading-snug">
              {selectedTask.title}
            </h1>

            {/* Description Text Container Area */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Description
              </h3>
              <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4 min-h-[120px]">
                <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
                  {selectedTask.description ||
                    "No summary overview descriptive context filled for this ticket."}
                </p>
              </div>
            </div>
          </div>

          {/* Attachments Display Section */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Attachments ({selectedTask.attachments?.length || 0})
            </h3>

            {selectedTask.attachments.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                No asset documentation uploaded.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {selectedTask.attachments.map((file, index) => (
                  <a
                    key={index}
                    href={file.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50/60 transition-all group"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden pr-2">
                      <svg
                        className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-indigo-500 transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.414a6 6 0 108.486 8.486L20.5 13"
                        />
                      </svg>
                      <div className="truncate">
                        <p className="text-xs font-semibold text-slate-700 truncate group-hover:text-indigo-600 transition-colors">
                          {file.fileName}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {formatDate(file.uploadedAt)}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COMPONENT: Quick-Properties Panel Sidebar (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-5">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                Details
              </h3>

              {/* Status Row */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-400 uppercase tracking-wide text-[10px]">
                  Status
                </span>
                <span
                  className={`rounded border px-2.5 py-0.5 text-[10px] font-bold ${getStatusColor()}`}
                >
                  {selectedTask.status}
                </span>
              </div>

              {/* Priority Row */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-400 uppercase tracking-wide text-[10px]">
                  Priority
                </span>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getPriorityColor()}`}
                >
                  {selectedTask.priority}
                </span>
              </div>

              {/* Assignee Field */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="font-semibold text-slate-400 uppercase tracking-wide text-[10px]">
                  Assignee
                </span>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 text-[9px] font-bold flex items-center justify-center uppercase">
                    {assignee.charAt(0)}
                  </div>
                  <span className="font-medium text-slate-700">{assignee}</span>
                </div>
              </div>

              {/* Creator Field */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-400 uppercase tracking-wide text-[10px]">
                  Reporter
                </span>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[9px] font-bold flex items-center justify-center uppercase">
                    {createdBy.charAt(0)}
                  </div>
                  <span className="font-medium text-slate-700">
                    {createdBy}
                  </span>
                </div>
              </div>
            </div>

            {/* Time Metrics Logs */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Dates & Deadlines
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Due Date:</span>
                  <span
                    className={`font-semibold ${selectedTask.status !== "done" && selectedTask.priority === "high" ? "text-rose-600" : "text-slate-700"}`}
                  >
                    {formatDate(selectedTask.dueDate)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Created:</span>
                  <span>{formatDate(selectedTask.createdAt)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Updated:</span>
                  <span>{formatDate(selectedTask.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Tailwind Deletion Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Delete Task
                </h3>
                <p className="text-xs text-slate-500">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-800">
                "{selectedTask.title}"
              </span>
              ? It will be permanently removed from this project.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setIsDeleteModalOpen(false)}
                className="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDeleteTask}
                className="cursor-pointer rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 shadow-2xs transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {isDeleting ? "Deleting..." : "Delete Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDescription;
