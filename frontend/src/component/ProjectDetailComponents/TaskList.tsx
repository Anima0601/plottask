import { useNavigate } from "react-router-dom";

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high";
  dueDate?: string;
}

interface TaskProp {
  taskList: Task[];
}

const TaskList = ({ taskList }: TaskProp) => {
  const navigate = useNavigate();

  // Helper Utility for formatting due dates smoothly
  const formatDueDate = (dateString?: string) => {
    if (!dateString) return "No due date";
    const d = new Date(dateString);
    return isNaN(d.getTime())
      ? "No due date"
      : d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  // Color Mapping logic to harmonize with your Dashboard stats
  const getStatusBadgeStyle = (status: Task["status"]) => {
    switch (status) {
      case "done":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "review":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "in-progress":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getPriorityBadgeStyle = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-rose-50 text-rose-700 border-rose-100";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-slate-50 text-slate-500 border-slate-200";
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
      {/* Component Header Block */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Project Tasks
          </h3>
          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600">
            {taskList?.length || 0}
          </span>
        </div>
      </div>

      {/* Task Rows List Framework */}
      {!taskList || taskList.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xs text-slate-400 italic">
            No tasks assigned to this project execution board.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {taskList.map((task) => (
            <div
              key={task._id}
              onClick={() => navigate(`/tasks/${task._id}`)}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0 group hover:bg-slate-50/40 px-2 -mx-2 rounded-lg transition-colors cursor-pointer"
            >
              {/* Left Segment: Bullet Dot, Title and Description */}
              <div className="flex items-start gap-3 flex-1 overflow-hidden">
                {/* Minimal view-only indicator dot instead of a checkbox */}
                <span
                  className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
                    task.status === "done" ? "bg-slate-300" : "bg-indigo-500"
                  }`}
                />

                <div className="space-y-0.5 overflow-hidden">
                  <h4
                    className={`text-sm font-semibold tracking-tight transition-colors group-hover:text-indigo-600 ${
                      task.status === "done"
                        ? "text-slate-400 line-through decoration-slate-300"
                        : "text-slate-800"
                    }`}
                  >
                    {task.title}
                  </h4>
                  {task.description && (
                    <p
                      className={`text-xs line-clamp-1 leading-relaxed ${
                        task.status === "done"
                          ? "text-slate-300"
                          : "text-slate-500"
                      }`}
                    >
                      {task.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Segment: Meta Badges Row (Status, Priority, Due Date) */}
              <div className="flex items-center justify-start sm:justify-end gap-3 flex-wrap sm:flex-nowrap shrink-0 ml-4 sm:ml-0">
                {/* Priority Indicator Pill */}
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${getPriorityBadgeStyle(
                    task.priority,
                  )}`}
                >
                  {task.priority}
                </span>

                {/* Status Indicator Pill */}
                <span
                  className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${getStatusBadgeStyle(
                    task.status,
                  )}`}
                >
                  {task.status === "in-progress" ? "In Progress" : task.status}
                </span>

                {/* Due Date Indicator */}
                <div className="flex items-center gap-1 text-[11px] text-slate-400 min-w-[75px] sm:justify-end font-medium">
                  <svg
                    className="h-3 w-3 text-slate-400 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span
                    className={
                      task.status !== "done" && task.priority === "high"
                        ? "text-rose-600 font-semibold"
                        : ""
                    }
                  >
                    {formatDueDate(task.dueDate)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
