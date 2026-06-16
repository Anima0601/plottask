interface Stats {
  totalProjects: number;
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  reviewTasks: number;
  doneTasks: number;
}

interface statsProp {
  stats: Stats;
}

const Dashboard = ({ stats }: statsProp) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Overview
        </h2>
        <p className="text-sm text-slate-500">
          Real-time breakdown of workspace progress.
        </p>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {/* Total Projects Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Projects
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {stats.totalProjects}
          </p>
        </div>

        {/* Total Tasks Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Tasks
          </p>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {stats.totalTasks}
          </p>
        </div>

        {/* Todo Tasks Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            To Do
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-600">
            {stats.todoTasks}
          </p>
        </div>

        {/* In Progress Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            In Progress
          </p>
          <p className="mt-2 text-3xl font-bold text-amber-600">
            {stats.inProgressTasks}
          </p>
        </div>

        {/* Under Review Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            In Review
          </p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {stats.reviewTasks}
          </p>
        </div>

        {/* Completed Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Completed
          </p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {stats.doneTasks}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
