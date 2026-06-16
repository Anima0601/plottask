import { useEffect, useState } from "react";
import Dashboard from "../component/Dashboard";
import Projects from "../component/Projects";
import Navbar from "../component/Navbar";
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

const Home = () => {
  const [statsResponse, setStatsResponse] = useState<Stats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { projects } = useAppSelector((state) => state.project);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getProjects());
    const callResponse = async () => {
      try {
        handleStats();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    callResponse();
  }, []);

  const handleStats = async () => {
    try {
      const res = await api.get("/dashboard/stats");
      setStatsResponse(res.data);
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
          /* Clean Modern Loading Skeleton Frame */
          <div className="space-y-8 animate-pulse">
            <div className="h-6 w-32 bg-slate-200 rounded"></div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 bg-slate-200 rounded-xl"></div>
              ))}
            </div>
            <div className="h-6 w-40 bg-slate-200 rounded mt-12"></div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-40 bg-slate-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Dashboard Stats Block */}
            <Dashboard stats={statsResponse} />

            {/* Project List Grid Block */}
            <Projects projects={projects} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
