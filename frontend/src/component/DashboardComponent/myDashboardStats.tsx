interface MyDashboardStatsInterface {
  assignedProjects: number;
  assignedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  reviewTasks: number;
  completedTasks: number;
  overdueTasks: number;
}

interface MyDashboardStatsProp {
  stats: MyDashboardStatsInterface;
}

const MyDashboardStats = ({ stats }: MyDashboardStatsProp) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          My Personal Space
        </h2>
        <p className="text-sm text-slate-500">
          Your direct assignments, tasks, and deadlines across all current
          boards.
        </p>
      </div>

      {/* Grid Layout Container */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
        {/* Assigned Projects */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            My Projects
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {stats.assignedProjects}
          </p>
        </div>

        {/* Assigned Tasks */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            My Tasks
          </p>
          <p className="mt-2 text-2xl font-bold text-indigo-600">
            {stats.assignedTasks}
          </p>
        </div>

        {/* Overdue Tasks (High Priority Warning Callout) */}
        <div
          className={`rounded-xl border p-4 shadow-sm transition-colors ${
            stats.overdueTasks > 0
              ? "border-rose-200 bg-rose-50/50"
              : "border-slate-200 bg-white"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Overdue
          </p>
          <p
            className={`mt-2 text-2xl font-bold ${stats.overdueTasks > 0 ? "text-rose-600 animate-pulse" : "text-slate-900"}`}
          >
            {stats.overdueTasks}
          </p>
        </div>

        {/* Pending Tasks */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Pending
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-600">
            {stats.pendingTasks}
          </p>
        </div>

        {/* In Progress */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            In Progress
          </p>
          <p className="mt-2 text-2xl font-bold text-amber-600">
            {stats.inProgressTasks}
          </p>
        </div>

        {/* Under Review */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Under Review
          </p>
          <p className="mt-2 text-2xl font-bold text-blue-600">
            {stats.reviewTasks}
          </p>
        </div>

        {/* Completed */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Completed
          </p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {stats.completedTasks}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyDashboardStats;
