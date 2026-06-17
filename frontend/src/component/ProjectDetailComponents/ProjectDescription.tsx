import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  createdBy: string;
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
  // Format Date Safely Utility
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

  // Badge Color Mappers
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
    <div className="mx-auto max-w-7xl bg-slate-50 font-sans antialiased p-4 sm:p-6 lg:p-8">
      {/* Back/Header Meta Area */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <span
            onClick={() => {
              navigate("/home");
            }}
          >
            Projects
          </span>
          <span>/</span>
          <span className="text-slate-600 font-semibold">
            {selectedProject.title}
          </span>
        </div>
        <span className="text-xs text-slate-400">
          Last updated: {formatDate(selectedProject.updatedAt)}
        </span>
      </div>

      {/* Main Responsive Grid split layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* LEFT COLUMN: Core Content (8 Sections Wide) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            {/* Project Title Title */}
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight sm:text-3xl">
              {selectedProject.title}
            </h1>

            {/* Description Block */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Description
              </h4>
              <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">
                {selectedProject.description ||
                  "No content summary provided for this project description block."}
              </p>
            </div>
          </div>

          {/* Attachments Subsection */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Attachments ({selectedProject.attachments?.length || 0})
            </h3>

            {!selectedProject.attachments ||
            selectedProject.attachments.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                No asset files linked to this item.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {selectedProject.attachments.map((file, i) => (
                  <a
                    key={i}
                    href={file.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50 transition-all group"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden pr-2">
                      {/* Paperclip Icon SVG */}
                      <svg
                        className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-indigo-500"
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
                        <p className="text-xs font-semibold text-slate-700 truncate group-hover:text-indigo-600">
                          {file.fileName}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {formatDate(file.uploadedAt)}
                        </p>
                      </div>
                    </div>
                    {/* Arrow Download Target Button visual cue */}
                    <svg
                      className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-500 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v1M12 12V3m0 9l4-4m-4 4L8 8"
                      />
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar Metadata Panel (4 Sections Wide) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            {/* Quick Properties Group */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                Properties
              </h3>

              {/* Status Row */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-500">Status</span>
                <span
                  className={`rounded-full border px-2.5 py-0.5 font-semibold capitalize ${getStatusBadge(selectedProject.status)}`}
                >
                  {selectedProject.status}
                </span>
              </div>

              {/* Priority Row */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-500">Priority</span>
                <span
                  className={`rounded-full border px-2.5 py-0.5 font-semibold capitalize ${getPriorityBadge(selectedProject.priority)}`}
                >
                  {selectedProject.priority}
                </span>
              </div>

              {/* Visibility Row */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-500">Visibility</span>
                <span className="rounded font-mono px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-bold capitalize">
                  {selectedProject.visibility}
                </span>
              </div>
            </div>

            {/* Timelines Group */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Dates
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Starts:</span>
                  <span className="font-semibold text-slate-700">
                    {formatDate(selectedProject.startDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target End:</span>
                  <span className="font-semibold text-slate-700">
                    {formatDate(selectedProject.endDate)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                  <span>Created:</span>
                  <span>{formatDate(selectedProject.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Team Members Allocation Row */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Team Assignees
                </h3>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 h-5 w-5 rounded-full flex items-center justify-center">
                  {selectedProject.member?.length || 0}
                </span>
              </div>

              {!selectedProject.member ||
              selectedProject.member.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  No assigned team members.
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedProject.member.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      {/* Avatar Round Circle */}
                      <div className="h-6 w-6 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 text-[10px] font-extrabold flex items-center justify-center uppercase shrink-0">
                        {user.name ? user.name.trim().charAt(0) : "U"}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-semibold text-slate-800 truncate">
                          {user.name}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDescription;
