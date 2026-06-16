import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Public Landing Navbar */}
      <nav className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 font-bold text-lg tracking-wide text-slate-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-extrabold text-sm shadow-sm">
              P
            </span>
            <span>
              Plot<span className="text-indigo-600 font-medium">Task</span>
            </span>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/auth")}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-100 hover:bg-indigo-500 transition-colors"
            >
              Create a Workspace
            </button>
          </div>
        </div>
      </nav>

      {/* Main Hero Container */}
      <main className="mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8 text-center lg:pt-24">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Subtle Tagline Badge */}
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
            Introducing PlotTask 1.0
          </span>

          {/* Main Headline */}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-slate-900 leading-[1.15]">
            The engineering workspace to{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              plot roadmaps
            </span>{" "}
            and track tasks.
          </h1>

          {/* Supporting Subtext */}
          <p className="mx-auto max-w-2xl text-lg text-slate-600 leading-relaxed">
            Streamline your team's development cycles. Manage code milestones,
            visualize sprint timelines, and align your product roadmap all in
            one blazing-fast workspace.
          </p>

          {/* Action Callouts */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/auth")}
              className="w-full sm:w-auto rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-md shadow-indigo-100 hover:bg-indigo-500 transition-all active:scale-[0.98]"
            >
              Get Started for Free
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="w-full sm:w-auto rounded-lg bg-white border border-slate-300 px-6 py-3 text-base font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              Sign In to Existing Workspace
            </button>
          </div>
        </div>

        {/* Mock Product Dashboard Visual Preview */}
        <div className="mt-16 sm:mt-20 lg:mt-24 mx-auto max-w-5xl rounded-xl border border-slate-200/80 bg-white p-4 shadow-xl shadow-slate-100 relative overflow-hidden">
          {/* Fading bottom overlay for that polished marketing page effect */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

          {/* Simulated UI Window Header Controls */}
          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3 mb-6">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400"></span>
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
            <span className="ml-4 text-xs font-mono text-slate-400 select-none">
              plottask.io/workspace/dashboard
            </span>
          </div>

          {/* --- Mock Dashboard Structure --- */}
          <div className="space-y-6 text-left px-2 sm:px-4">
            {/* 1. Mock Mini Stats Grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Active Sprint
                </span>
                <p className="text-xl font-bold text-slate-800 mt-0.5">
                  Sprint #42
                </p>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Tasks Done
                </span>
                <p className="text-xl font-bold text-emerald-600 mt-0.5">
                  24 / 31
                </p>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Team Velocity
                </span>
                <p className="text-xl font-bold text-indigo-600 mt-0.5">94%</p>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Days Remaining
                </span>
                <p className="text-xl font-bold text-amber-600 mt-0.5">
                  3 Days
                </p>
              </div>
            </div>

            {/* 2. Mock Kanban Sprint Board columns */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Sprint Backlog Preview
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Column 1: In Progress */}
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-amber-500"></span>{" "}
                      In Progress
                    </span>
                    <span className="text-[10px] font-bold bg-slate-200/60 text-slate-600 px-1.5 py-0.5 rounded">
                      2
                    </span>
                  </div>

                  {/* Task Card */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200/60 shadow-sm space-y-2">
                    <span className="text-[10px] font-bold bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded">
                      High
                    </span>
                    <h5 className="text-xs font-bold text-slate-800">
                      Integrate Stripe Webhooks
                    </h5>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      Handle asynchronous customer payment receipts.
                    </p>
                  </div>
                  {/* Task Card */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200/60 shadow-sm space-y-2">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      Low
                    </span>
                    <h5 className="text-xs font-bold text-slate-800">
                      Refactor Navbar Component
                    </h5>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      Extract clean dynamic viewport wrappers.
                    </p>
                  </div>
                </div>

                {/* Column 2: In Review */}
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>{" "}
                      Under Review
                    </span>
                    <span className="text-[10px] font-bold bg-slate-200/60 text-slate-600 px-1.5 py-0.5 rounded">
                      1
                    </span>
                  </div>

                  {/* Task Card */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200/60 shadow-sm space-y-2">
                    <span className="text-[10px] font-bold bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded">
                      Medium
                    </span>
                    <h5 className="text-xs font-bold text-slate-800">
                      Setup Global Redis Cache
                    </h5>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      Cache heavily accessed authorization routes.
                    </p>
                  </div>
                </div>

                {/* Column 3: Completed */}
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>{" "}
                      Completed
                    </span>
                    <span className="text-[10px] font-bold bg-slate-200/60 text-slate-600 px-1.5 py-0.5 rounded">
                      4
                    </span>
                  </div>

                  {/* Task Card */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200/60 shadow-sm opacity-60 space-y-2 line-through decoration-slate-300">
                    <h5 className="text-xs font-bold text-slate-700">
                      Design Auth Form Layout
                    </h5>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      Craft responsive mobile authentication blocks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* --- End Mock Dashboard Structure --- */}
        </div>
      </main>

      {/* Basic Landing Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-400 relative z-20">
        © 2026 PlotTask Inc. Built for fast-moving engineering teams.
      </footer>
    </div>
  );
};

export default Hero;
