import { useParams } from "react-router-dom";
import ProjectDescription from "../component/ProjectDetailComponents/ProjectDescription";
import { useAppSelector } from "../store/hook";
import Navbar from "../component/Navbar";
import TaskList from "../component/ProjectDetailComponents/TaskList";
import { useEffect } from "react";
import { useAppDispatch } from "../store/hook";
import { getTask } from "../store/slices/taskSlice";
const ProjectDetail = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getTask());
  }, [dispatch]);
  const { projectId } = useParams();
  const { projects } = useAppSelector((state) => state.project);
  const selectedProject = projects.find((proj) => proj._id === projectId);
  const { tasks } = useAppSelector((state) => state.task);
  console.log(tasks);
  const selectedTasks = tasks.filter((task) => task.project._id == projectId);
  if (!selectedProject) {
    return <div>Project not found</div>;
  }
  return (
    <div>
      <Navbar />
      <ProjectDescription selectedProject={selectedProject} />
      <TaskList taskList={selectedTasks} />
    </div>
  );
};

export default ProjectDetail;
