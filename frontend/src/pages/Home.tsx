import { useEffect, useState } from "react";
import Dashboard from "../component/DashboardComponent/Dashboard";
import Projects from "../component/DashboardComponent/Projects";
import Navbar from "../component/Navbar";
import MyDashboardStats from "../component/DashboardComponent/myDashboardStats";
import api from "../utils/api";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { getProjects } from "../store/slices/projectSlice";

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
          /* Tailored Layout Loading Skeleton Animation Frame */
          <div className="space-y-8 animate-pulse">
            {/* My Personal Space Skeleton */}
            <div className="h-6 w-40 bg-slate-200 rounded"></div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-24 bg-slate-200 rounded-xl"></div>
              ))}
            </div>

            {/* Team Workspace Overview Skeleton */}
            <div className="h-6 w-32 bg-slate-200 rounded mt-12"></div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 bg-slate-200 rounded-xl"></div>
              ))}
            </div>

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
            {/* 1. Personal Metrics Panel (Renders safely when data populates) */}
            {myStats && <MyDashboardStats stats={myStats} />}

            {/* 2. Global Organization Workspace Dashboard Stats Block */}
            <Dashboard stats={statsResponse} />

            {/* 3. Project List Grid Block populated via Redux toolkit store selectors */}
            <Projects projects={projects} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
