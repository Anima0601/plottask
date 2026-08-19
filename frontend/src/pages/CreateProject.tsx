import { useState, useEffect } from "react";
import Navbar from "../component/Navbar";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { getUsers } from "../store/slices/userSlice";
import { createProject } from "../store/slices/projectSlice";
import { useToast } from "../context/ToastContext"; // Adjust path to ToastContext

const CreateProject = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const { users, loading: usersLoading } = useAppSelector(
    (state) => state.user,
  );

  const { loading } = useAppSelector((state) => state.project);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "planning",
    priority: "medium",
    visibility: "private",
    startDate: "",
    endDate: "",
    member: [] as string[],
  });

  const [files, setFiles] = useState<FileList | null>(null);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleMemberToggle = (userId: string) => {
    const isSelected = formData.member.includes(userId);
    const updatedMembers = isSelected
      ? formData.member.filter((id) => id !== userId)
      : [...formData.member, userId];

    setFormData({ ...formData, member: updatedMembers });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast("Project title is required", "warning");
      return;
    }

    try {
      const submissionData = new FormData();

      submissionData.append("title", formData.title);
      submissionData.append("description", formData.description);
      submissionData.append("status", formData.status);
      submissionData.append("priority", formData.priority);
      submissionData.append("visibility", formData.visibility);
      submissionData.append("startDate", formData.startDate);
      submissionData.append("endDate", formData.endDate);

      formData.member.forEach((id) => {
        submissionData.append("member", id);
      });

      if (files) {
        Array.from(files).forEach((file) => {
          submissionData.append("attachments", file);
        });
      }

      await dispatch(createProject(submissionData)).unwrap();

      toast("Project created successfully!", "success");

      setTimeout(() => {
        navigate("/home");
      }, 800);
    } catch (error) {
      toast(
        typeof error === "string" ? error : "Failed to create project",
        "error",
      );
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <form
          onSubmit={handleFormSubmit}
          className="grid grid-cols-1 gap-8 lg:grid-cols-12"
        >
          {/* LEFT WING SECTION: Primary Metadata Input Parameters (7 Columns wide) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Create New Project
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Define core configurations and boundaries for this operational
                  space.
                </p>
              </div>

              {/* Title Form Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Project Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Social Media Platform Replatforming"
                  className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-inner"
                />
              </div>

              {/* Description Form Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide comprehensive objectives, specifications, and contextual scope summary notes..."
                  className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-inner resize-none"
                />
              </div>

              {/* Document Uploader Box */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Project Assets & Attachments
                </label>
                <div className="relative border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl p-5 bg-slate-50/50 transition-colors text-center cursor-pointer group">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setFiles(e.target.files)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-1">
                    <svg
                      className="mx-auto h-8 w-8 text-slate-400 group-hover:text-indigo-500 transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="text-xs font-semibold text-slate-700">
                      Click to upload or drag files here
                    </p>
                    <p className="text-[10px] text-slate-400">
                      PDF, images, charts, or docs up to 25MB total
                    </p>
                  </div>
                </div>
                {files && files.length > 0 && (
                  <div className="mt-2 text-xs font-medium text-indigo-600 bg-indigo-50/60 border border-indigo-100 rounded-lg px-3 py-2 flex items-center gap-2">
                    📎 {files.length} staging items ready for initialization
                    upload.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT WING SECTION: System Parameters Properties & Allocation (5 Columns wide) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                Operational Attributes
              </h3>

              {/* Status Row */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 transition-colors shadow-sm"
                >
                  <option value="planning">📋 Planning Stage</option>
                  <option value="active">⚡ Active Execution</option>
                  <option value="completed">✅ Done / Finished</option>
                </select>
              </div>

              {/* Priority Row */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Priority Matrix Tier
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 transition-colors shadow-sm"
                >
                  <option value="low">🟢 Low Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="high">🔴 High Critical Tier</option>
                </select>
              </div>

              {/* Visibility Row */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Visibility Bounds
                </label>
                <select
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 transition-colors shadow-sm"
                >
                  <option value="private">🔒 Private (Invitation Only)</option>
                  <option value="team">👥 Team Bound</option>
                  <option value="public">🌐 Public (Workspace Global)</option>
                </select>
              </div>

              {/* Calendar Bounds Row */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-medium text-slate-700 outline-none focus:border-indigo-500 transition-colors shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                    Target End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-medium text-slate-700 outline-none focus:border-indigo-500 transition-colors shadow-sm"
                  />
                </div>
              </div>

              {/* Team Members Selection */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                    Assign Workspace Members
                  </label>
                  <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">
                    {formData.member.length} Selected
                  </span>
                </div>

                <div className="h-44 rounded-lg border border-slate-200 bg-slate-50/30 overflow-y-auto p-2 space-y-1.5">
                  {usersLoading ? (
                    <p className="text-center text-xs text-slate-400 py-4 animate-pulse">
                      Loading member directory...
                    </p>
                  ) : users.length === 0 ? (
                    <p className="text-center text-xs text-slate-400 py-4 italic">
                      No users found.
                    </p>
                  ) : (
                    users.map((user) => {
                      const selected = formData.member.includes(user._id);
                      return (
                        <div
                          key={user._id}
                          onClick={() => handleMemberToggle(user._id)}
                          className={`flex items-center justify-between p-2 rounded-md border text-xs cursor-pointer transition-all select-none ${
                            selected
                              ? "bg-indigo-50/80 border-indigo-200 text-indigo-900 shadow-sm"
                              : "bg-white border-slate-100 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-5 w-5 rounded-full text-[9px] font-bold flex items-center justify-center uppercase border ${
                                selected
                                  ? "bg-indigo-600 text-white border-indigo-600"
                                  : "bg-slate-100 text-slate-500 border-slate-200"
                              }`}
                            >
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold">{user.name}</p>
                              <p className="text-[10px] text-slate-400 font-medium">
                                {user.email}
                              </p>
                            </div>
                          </div>
                          {selected && (
                            <svg
                              className="h-4 w-4 text-indigo-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => navigate("/home")}
                  className="flex-1 text-center text-xs font-bold text-slate-600 border border-slate-200 rounded-lg py-2.5 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 text-center text-xs font-bold text-white bg-indigo-600 rounded-lg py-2.5 hover:bg-indigo-500 shadow-sm shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating..." : "Create Project"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateProject;
