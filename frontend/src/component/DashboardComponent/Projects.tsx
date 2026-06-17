import { useNavigate } from "react-router-dom";
interface Project {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  startDate: string;
  endDate: string;
  visibility: string;
  createdBy: string;
}

interface projectProp {
  projects: Project[];
}

const Projects = ({ projects }: projectProp) => {
  const navigate = useNavigate();
  const getPriorityStyle = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "done":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "in progress":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Active Projects
        </h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
          {projects.length} Total
        </span>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 rounded-xl border border-dashed border-slate-300 bg-white">
          <p className="text-sm text-slate-500">
            No active projects running in this workspace.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((proj) => (
            <div
              key={proj._id}
              onClick={() => navigate(`/projects/${proj._id}`)}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-hover hover:shadow-md"
            >
              <div>
                {/* Header Row */}
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold text-slate-900 text-lg leading-snug">
                    {proj.title}
                  </h3>
                  <span className="text-xs text-slate-400 font-medium capitalize bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    {proj.visibility}
                  </span>
                </div>

                {/* Description */}
                <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                  {proj.description ||
                    "No description provided for this project."}
                </p>

                {/* Context Badges */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusStyle(proj.status)}`}
                  >
                    {proj.status}
                  </span>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getPriorityStyle(proj.priority)}`}
                  >
                    {proj.priority} Priority
                  </span>
                </div>
              </div>

              {/* Card Footer Dates */}
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                <div>
                  <span className="font-medium text-slate-400">Starts:</span>{" "}
                  {new Date(proj.startDate).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <div>
                  <span className="font-medium text-slate-400">Ends:</span>{" "}
                  {new Date(proj.endDate).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
