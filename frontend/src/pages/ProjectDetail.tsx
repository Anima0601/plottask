import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";

import ProjectDescription from "../component/ProjectDetailComponents/ProjectDescription";
import TaskList from "../component/ProjectDetailComponents/TaskList";
import ActivityLogs from "../component/ProjectDetailComponents/ActivityLogs";
import Navbar from "../component/Navbar";

import { useAppSelector, useAppDispatch } from "../store/hook";
import { getTask } from "../store/slices/taskSlice";
import api from "../utils/api";

interface Activity {
  _id: string;
  action: string;
  createdAt: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
}

const ProjectDetail = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);

  const { projects } = useAppSelector((state) => state.project);
  const { tasks } = useAppSelector((state) => state.task);

  const selectedProject = projects.find((proj) => proj._id === projectId);

  useEffect(() => {
    dispatch(getTask());
  }, [dispatch]);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!projectId) return;

      try {
        setActivityLoading(true);
        const res = await api.get(`/activities/project/${projectId}`);
        setActivities(res.data);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
        setActivities([]);
      } finally {
        setActivityLoading(false);
      }
    };

    fetchActivities();
  }, [projectId]);

  const selectedTasks = useMemo(() => {
    if (!projectId || !tasks) return [];
    return tasks.filter((task) => {
      const pId =
        typeof task.project === "object" ? task.project?._id : task.project;
      return pId === projectId;
    });
  }, [tasks, projectId]);

  if (!selectedProject) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans antialiased">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-2xs space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-xl font-bold text-rose-500">
              !
            </div>
            <h2 className="text-lg font-bold text-slate-800">
              Project Not Found
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              The project you are looking for doesn't exist or you don't have
              access to view it.
            </p>
            <button
              onClick={() => navigate("/home")}
              className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-indigo-500 cursor-pointer"
            >
              Back to Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased pb-12">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-8">
        <section>
          <ProjectDescription selectedProject={selectedProject} />
        </section>

        <section>
          <TaskList taskList={selectedTasks} />
        </section>

        <section>
          <ActivityLogs activities={activities} loading={activityLoading} />
        </section>
      </main>
    </div>
  );
};

export default ProjectDetail;
