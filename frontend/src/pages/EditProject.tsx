import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hook";
import {
  getProjectById,
  updateProject,
  addMember,
} from "../store/slices/projectSlice";
import { getUsers } from "../store/slices/userSlice";
import Navbar from "../component/Navbar";

interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
}

const EditProject = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { selectedProject, loading, error } = useAppSelector(
    (state) => state.project,
  );
  const { user } = useAppSelector((state) => state.auth);
  const { users } = useAppSelector((state) => state.user);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "planning",
    priority: "medium",
    startDate: "",
    endDate: "",
    visibility: "private",
  });

  const [attachments, setAttachments] = useState<FileList | null>(null);

  // Store full User objects for immediate local rendering
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);

  // Admin access check
  useEffect(() => {
    if (user && selectedProject) {
      const isAdmin = user.role === "admin";
      if (!isAdmin) {
        navigate("/home");
      }
    }
  }, [user, selectedProject, navigate]);

  // Fetch Project & User Data
  useEffect(() => {
    if (projectId) {
      dispatch(getProjectById(projectId));
    }
    dispatch(getUsers());
  }, [dispatch, projectId]);

  // Populate form and member state on initial load
  useEffect(() => {
    if (!selectedProject) return;

    setFormData({
      title: selectedProject.title || "",
      description: selectedProject.description || "",
      status: selectedProject.status || "planning",
      priority: selectedProject.priority || "medium",
      startDate: selectedProject.startDate
        ? new Date(selectedProject.startDate).toISOString().substring(0, 10)
        : "",
      endDate: selectedProject.endDate
        ? new Date(selectedProject.endDate).toISOString().substring(0, 10)
        : "",
      visibility: selectedProject.visibility || "private",
    });

    // Populate existing members as full objects
    if (selectedProject.member) {
      setSelectedMembers(selectedProject.member as unknown as User[]);
    }
  }, [selectedProject]);

  // Available users filtered against currently selected members
  const availableUsers = users.filter(
    (u) => !selectedMembers.some((m) => m._id === u._id),
  );

  // Add Member Action & Immediate UI State Update
  const handleAddMember = async (selectedUser: User) => {
    if (!selectedProject?._id) return;

    try {
      await dispatch(
        addMember({
          projectId: selectedProject._id,
          userId: selectedUser._id,
        }),
      ).unwrap();

      // Instantly update local state so the UI reflects the addition
      setSelectedMembers((prev) => {
        if (prev.some((m) => m._id === selectedUser._id)) {
          return prev;
        }
        return [...prev, selectedUser];
      });
    } catch (err) {
      console.error("Failed to add member:", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return;

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("status", formData.status);
    data.append("priority", formData.priority);
    data.append("startDate", formData.startDate);
    data.append("endDate", formData.endDate);
    data.append("visibility", formData.visibility);

    // Send updated list of member IDs
    data.append("member", JSON.stringify(selectedMembers.map((m) => m._id)));

    if (attachments) {
      Array.from(attachments).forEach((file) => {
        data.append("attachments", file);
      });
    }

    try {
      await dispatch(
        updateProject({
          projectId,
          projectData: data,
        }),
      ).unwrap();

      navigate(`/projects/${projectId}`);
    } catch (err) {
      console.error("Project update failed:", err);
    }
  };

  if (loading && !selectedProject) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-xs text-xs font-semibold text-slate-600">
            <svg
              className="h-4 w-4 animate-spin text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Loading project details...
          </div>
        </div>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <div className="flex flex-1 items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm space-y-3">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 font-bold text-sm">
              ?
            </div>
            <h2 className="text-base font-bold text-slate-800">
              Project Not Found
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              The project you are looking to edit could not be retrieved.
            </p>
            <button
              onClick={() => navigate("/home")}
              className="mt-2 w-full rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500 transition-colors cursor-pointer"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased pb-16">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-4 flex items-center gap-2 text-xs font-medium text-slate-400">
          <span
            onClick={() => navigate("/home")}
            className="cursor-pointer hover:text-slate-600 transition-colors"
          >
            Projects
          </span>
          <span>/</span>
          <span
            onClick={() => navigate(`/projects/${projectId}`)}
            className="cursor-pointer hover:text-slate-600 transition-colors truncate max-w-[200px]"
          >
            {selectedProject.title}
          </span>
          <span>/</span>
          <span className="text-slate-600 font-semibold">Settings</span>
        </div>

        {/* Header Block */}
        <div className="mb-8 border-b border-slate-200/80 pb-5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Edit Project
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Update configuration, access control, and metadata for this
            workspace.
          </p>
        </div>

        {/* Error Callout */}
        {error && (
          <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-4 text-xs font-medium text-rose-700 shadow-2xs">
            <svg
              className="h-4 w-4 shrink-0 text-rose-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Information */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2.5">
              General Details
            </h3>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Project Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. Website Redesign"
                className="w-full rounded-lg border border-slate-300 bg-slate-50/30 px-3.5 py-2 text-xs font-medium text-slate-800 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Brief summary of the goals and scopes..."
                className="w-full rounded-lg border border-slate-300 bg-slate-50/30 px-3.5 py-2 text-xs font-medium text-slate-800 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Section 2: Properties & Access */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2.5">
              Properties & Access
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50/30 px-3 py-2 text-xs font-semibold text-slate-700 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50/30 px-3 py-2 text-xs font-semibold text-slate-700 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Visibility
                </label>
                <select
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50/30 px-3 py-2 text-xs font-semibold text-slate-700 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="private">Private (Only Me)</option>
                  <option value="team">Team (Project Members)</option>
                  <option value="public">Public (Workspace)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Project Members */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Project Members
              </h3>
              <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                {selectedMembers.length} active
              </span>
            </div>

            {/* Dropdown Selector to Add Member */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Add Member
              </label>
              <select
                value=""
                onChange={(e) => {
                  const targetUser = availableUsers.find(
                    (u) => u._id === e.target.value,
                  );
                  if (targetUser) handleAddMember(targetUser);
                }}
                className="w-full rounded-lg border border-slate-300 bg-slate-50/30 px-3 py-2 text-xs font-medium text-slate-800 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Select a user to add...</option>
                {availableUsers.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Active Selected Members Grid */}
            <div className="space-y-2 pt-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Assigned Team
              </p>

              {selectedMembers.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">
                  No members assigned yet. Select users above to assign them.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {selectedMembers.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-3 transition-all"
                    >
                      <div className="flex items-center gap-3 overflow-hidden pr-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 border border-indigo-200 uppercase">
                          {member.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-semibold text-slate-800 truncate">
                            {member.name}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {member.email}
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Timelines */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2.5">
              Timelines
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50/30 px-3 py-2 text-xs font-medium text-slate-800 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Target End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50/30 px-3 py-2 text-xs font-medium text-slate-800 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Attachments */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2.5">
              New Attachments
            </h3>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Upload Files
              </label>
              <input
                type="file"
                multiple
                onChange={(e) => setAttachments(e.target.files)}
                className="w-full cursor-pointer text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100 transition-all"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Newly uploaded files will be appended to existing project
                attachments.
              </p>

              {/* File Pill Preview */}
              {attachments && attachments.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {Array.from(attachments).map((file, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 border border-slate-200"
                    >
                      📎 {file.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(`/projects/${projectId}`)}
              disabled={loading}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {loading ? "Updating Project..." : "Update Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProject;
