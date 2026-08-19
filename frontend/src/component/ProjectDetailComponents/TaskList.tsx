import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UpdateTaskModal from "./UpdateTaskModal";
import { useAppSelector } from "../../store/hook";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Task {
  _id: string;
  title: string;
  description?: string;
  project: {
    _id: string;
    title: string;
  };
  assignee?: string | User;
  status: "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high";
  dueDate?: string;
}

interface TaskListProps {
  taskList: Task[];
}

const TaskList = ({ taskList }: TaskListProps) => {
  const navigate = useNavigate();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const { projects } = useAppSelector((state) => state.project);

  const handleTaskClick = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };

  const handleEditTask = (
    e: React.MouseEvent<HTMLButtonElement>,
    task: Task,
  ) => {
    // VERY IMPORTANT
    // Prevent task row click
    e.stopPropagation();

    setSelectedTask(task);
    setIsUpdateModalOpen(true);
  };

  const selectedProject = selectedTask
    ? projects.find((project) => project._id === selectedTask.project._id)
    : null;

  return (
    <>
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Project Tasks
          </h2>

          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
            {taskList.length}
          </span>
        </div>

        {/* Tasks */}
        <div>
          {taskList.map((task) => (
            <div
              key={task._id}
              onClick={() => handleTaskClick(task._id)}
              className="group flex cursor-pointer items-center justify-between border-b border-slate-100 px-6 py-4 transition-colors hover:bg-slate-50 last:border-b-0"
            >
              {/* Left side */}
              <div className="flex min-w-0 items-center gap-3">
                {/* Status dot */}
                <div className="h-2 w-2 shrink-0 rounded-full bg-indigo-500" />

                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-slate-800 group-hover:text-indigo-600">
                    {task.title}
                  </h3>

                  {task.description && (
                    <p className="mt-1 truncate text-xs text-slate-400">
                      {task.description}
                    </p>
                  )}

                  <div className="mt-2 flex items-center gap-2">
                    {/* Status */}
                    <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold capitalize text-indigo-600">
                      {task.status}
                    </span>

                    {/* Priority */}
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold capitalize ${
                        task.priority === "high"
                          ? "border-rose-200 bg-rose-50 text-rose-600"
                          : task.priority === "medium"
                            ? "border-amber-200 bg-amber-50 text-amber-600"
                            : "border-slate-200 bg-slate-50 text-slate-600"
                      }`}
                    >
                      {task.priority}
                    </span>

                    {/* Assignee */}
                    {task.assignee && (
                      <span className="text-[10px] text-slate-400">
                        {typeof task.assignee === "string"
                          ? task.assignee
                          : task.assignee.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Edit button */}
              <button
                type="button"
                title="Edit task"
                onClick={(e) => handleEditTask(e, task)}
                className="ml-4 shrink-0 rounded-lg border border-slate-200 bg-white p-2 text-slate-400 opacity-70 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 group-hover:opacity-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 7.125L16.875 4.5"
                  />
                </svg>
              </button>
            </div>
          ))}

          {taskList.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-xs italic text-slate-400">No tasks found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Update Task Modal */}
      {selectedTask && selectedProject && (
        <UpdateTaskModal
          open={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
          selectedProject={selectedProject}
        />
      )}
    </>
  );
};

export default TaskList;
