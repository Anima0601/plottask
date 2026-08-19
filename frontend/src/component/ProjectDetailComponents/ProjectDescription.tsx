import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { deleteProject } from "../../store/slices/projectSlice";
import { useToast } from "../../context/ToastContext";
import CreateTaskModal from "./CreateTaskModal";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  createdBy: string | User;
  member: User[];

  status: "planning" | "active" | "completed";
  priority: "low" | "medium" | "high";

  startDate: string;
  endDate: string;

  visibility: "private" | "team" | "public";

  attachments: {
    fileName: string;
    fileUrl: string;
    uploadedAt: string;
  }[];

  createdAt: string;
  updatedAt: string;
}

interface ProjectProp {
  selectedProject: Project;
}

const ProjectDescription = ({ selectedProject }: ProjectProp) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  const confirmDeleteProject = async () => {
    try {
      setIsDeleting(true);
      await dispatch(deleteProject(selectedProject._id)).unwrap();
      toast("Project deleted successfully!", "success");

      setIsDeleteModalOpen(false);
      navigate("/home");
    } catch (error) {
      toast(
        typeof error === "string" ? error : "Failed to delete project",
        "error",
      );
      console.error("Delete project failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
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

  const getStatusBadge = (status: Project["status"]) => {
    switch (status) {
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "active":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getPriorityBadge = (priority: Project["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER BAR ================= */}
      <div className="flex flex-col gap-3 border-b border-slate-200/80 pb-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span
            className="cursor-pointer text-slate-500 transition-colors hover:text-slate-700"
            onClick={() => navigate("/home")}
          >
            Projects
          </span>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-800 truncate max-w-[280px]">
            {selectedProject.title}
          </span>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
          <span className="text-xs text-slate-400">
            Last updated: {formatDate(selectedProject.updatedAt)}
          </span>

          {isAdmin && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="cursor-pointer rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-indigo-500"
              >
                + Add Task
              </button>

              <button
                onClick={() =>
                  navigate(`/projects/${selectedProject._id}/edit`)
                }
                className="cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50"
              >
                Edit
              </button>

              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="cursor-pointer rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* ================= LEFT COLUMN ================= */}
        <div className="space-y-6 lg:col-span-8">
          {/* Project Title & Description */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {selectedProject.title}
            </h1>

            <div className="space-y-2 pt-1 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-2">
                Description
              </h4>
              <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-600">
                {selectedProject.description ||
                  "No content summary provided for this project description block."}
              </p>
            </div>
          </div>

          {/* Attachments Section */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Attachments ({selectedProject.attachments?.length || 0})
              </h3>
            </div>

            {!selectedProject.attachments ||
            selectedProject.attachments.length === 0 ? (
              <p className="text-xs italic text-slate-400 py-1">
                No asset files linked to this item.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {selectedProject.attachments.map((file, index) => (
                  <a
                    key={index}
                    href={file.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between rounded-lg border border-slate-200 p-3 transition-all hover:border-indigo-300 hover:bg-slate-50/60"
                  >
                    <div className="flex min-w-0 items-center gap-2.5 pr-2">
                      <svg
                        className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-indigo-600 transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.414a6 6 0 108.486 8.486L20.5 13"
                        />
                      </svg>

                      <div className="truncate">
                        <p className="truncate text-xs font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
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

        {/* ================= RIGHT COLUMN ================= */}
        <div className="space-y-6 lg:col-span-4">
          {/* Properties & Members */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-5">
            <h3 className="border-b border-slate-100 pb-2.5 text-xs font-bold uppercase tracking-wider text-slate-400">
              Properties
            </h3>

            {/* Status */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-500">Status</span>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${getStatusBadge(
                  selectedProject.status,
                )}`}
              >
                {selectedProject.status}
              </span>
            </div>

            {/* Priority */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-500">Priority</span>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${getPriorityBadge(
                  selectedProject.priority,
                )}`}
              >
                {selectedProject.priority}
              </span>
            </div>

            {/* Members Block */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  Members
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                  {selectedProject.member?.length || 0}
                </span>
              </div>

              {selectedProject.member && selectedProject.member.length > 0 ? (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {selectedProject.member.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center gap-2.5 rounded-lg border border-slate-100 bg-slate-50/50 p-2 transition-colors hover:bg-slate-50"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 border border-indigo-200 uppercase">
                        {member.name
                          ? member.name.charAt(0).toUpperCase()
                          : "U"}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-slate-800">
                          {member.name}
                        </p>
                        <p className="truncate text-[10px] text-slate-400">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs italic text-slate-400 py-1">
                  No members assigned.
                </p>
              )}
            </div>
          </div>

          {/* Project Timeline Panel */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
            <h3 className="border-b border-slate-100 pb-2.5 text-xs font-bold uppercase tracking-wider text-slate-400">
              Project Timeline
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-500">Start Date</span>
                <span className="font-semibold text-slate-700">
                  {formatDate(selectedProject.startDate)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-500">End Date</span>
                <span className="font-semibold text-slate-700">
                  {formatDate(selectedProject.endDate)}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-medium text-slate-500">Visibility</span>
                <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold capitalize text-slate-600">
                  {selectedProject.visibility}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Creation Modal */}
      <CreateTaskModal
        open={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        selectedProject={selectedProject}
      />

      {/* ================= CUSTOM DELETE CONFIRMATION MODAL ================= */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
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
                  Delete Project
                </h3>
                <p className="text-xs text-slate-500">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-800">
                "{selectedProject.title}"
              </span>
              ? All associated tasks, files, and activity logs will be
              permanently removed.
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
                onClick={confirmDeleteProject}
                className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500 shadow-2xs transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {isDeleting ? "Deleting..." : "Delete Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDescription;
