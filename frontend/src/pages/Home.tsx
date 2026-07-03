import { useEffect, useState } from "react";
import Dashboard from "../component/DashboardComponent/Dashboard";
import Projects from "../component/DashboardComponent/Projects";
import Navbar from "../component/Navbar";
import MyDashboardStats from "../component/DashboardComponent/myDashboardStats";
import api from "../utils/api";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { getProjects } from "../store/slices/projectSlice";
import { useNavigate } from "react-router-dom";

interface Stats {
  totalProjects: number;
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  reviewTasks: number;
  doneTasks: number;
}

interface MyDashboardStats {
  assignedProjects: number;
  assignedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  reviewTasks: number;
  completedTasks: number;
  overdueTasks: number;
}

const Home = () => {
  const [statsResponse, setStatsResponse] = useState<Stats | null>(null);
  const [myStats, setMyStats] = useState<MyDashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { projects } = useAppSelector((state) => state.project);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProjects());
    const callResponse = async () => {
      try {
        await Promise.all([handleStats(), handleMyStats()]);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    callResponse();
  }, [dispatch]);

  const handleStats = async () => {
    try {
      const res = await api.get("/dashboard/stats");
      setStatsResponse(res.data);
    } catch (error: any) {
      console.log(error?.response?.data?.message);
    }
  };

  const handleMyStats = async () => {
    try {
      const res = await api.get("/dashboard/mystats");
      setMyStats(res.data);
    } catch (error: any) {
      console.log(error?.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      {/* Isolated Global Navbar */}
      <Navbar />

      {/* Main Content Dashboard Frame */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading || !statsResponse ? (
          /* Role-Adaptive Loading Skeleton Animation Frame */
          <div className="space-y-8 animate-pulse">
            {/* My Personal Space Skeleton (Visible to Everyone) */}
            <div className="h-6 w-40 bg-slate-200 rounded"></div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-24 bg-slate-200 rounded-xl"></div>
              ))}
            </div>

            {/* 🔒 Dynamic Skeleton Rule: Only shimmer the Overview metrics if user is an admin */}
            {user?.role === "admin" && (
              <>
                <div className="h-6 w-32 bg-slate-200 rounded mt-12"></div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-24 bg-slate-200 rounded-xl"></div>
                  ))}
                </div>
              </>
            )}

            {/* Active Projects Cards Skeleton */}
            <div className="h-6 w-36 bg-slate-200 rounded mt-12"></div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-44 bg-slate-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* 1. Personal Metrics Panel (Always visible to all members and users) */}
            {myStats && <MyDashboardStats stats={myStats} />}

            {/* 2. 🔒 ADMIN GUARD: Global Organization Workspace Breakdown Metrics Box */}
            {user?.role === "admin" && <Dashboard stats={statsResponse} />}

            {/* 3. Projects Sub-Layout Container with Header Actions Row */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Active Projects
                  </h2>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                    {projects?.length || 0} Total
                  </span>
                </div>

                {/* Admin Guarded Creation CTA */}
                {user?.role === "admin" && (
                  <button
                    onClick={() => navigate("/projects/create")}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-indigo-100 hover:bg-indigo-500 transition-all active:scale-[0.98]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 stroke-[2.5]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Create Project
                  </button>
                )}
              </div>

              {/* Project List Grid Block */}
              <Projects projects={projects} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
