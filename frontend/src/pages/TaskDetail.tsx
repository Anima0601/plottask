import { useAppDispatch } from "../store/hook";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTaskById } from "../store/slices/taskSlice";
import { useAppSelector } from "../store/hook";
import TaskDescription from "../component/TaskDetailComponents/TaskDescription";
import Navbar from "../component/Navbar";
import Comments from "../component/TaskDetailComponents/Comments";
import { getComments } from "../store/slices/commentSlice";

const TaskDetail = () => {
  const dispatch = useAppDispatch();
  const { taskId } = useParams();

  const { selectedTask, loading, error } = useAppSelector(
    (state) => state.task,
  );
  const { comments, loading: commentLoading } = useAppSelector(
    (state) => state.comment,
  );

  useEffect(() => {
    if (taskId) {
      dispatch(getTaskById(taskId));
      dispatch(getComments(taskId));
    }
  }, [dispatch, taskId]);


  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 font-sans antialiased">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-white font-extrabold text-xl shadow-md">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-lg bg-indigo-400 opacity-20"></span>
            P
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-800">
              Loading ticket details...
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Fetching from PlotTask boards.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error === "Access denied") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans antialiased px-4">
        <div className="max-w-md w-full rounded-2xl border border-rose-100 bg-white p-8 shadow-sm text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 border border-rose-100 text-xl shadow-sm">
            🔒
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Access Restricted
            </h2>
            <p className="text-sm leading-relaxed text-slate-500">
              You are not an assigned member of this project workspace and do
              not have operational clearance to view this task card.
            </p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm shadow-indigo-100 hover:bg-indigo-500 transition-all active:scale-[0.98]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!selectedTask) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans antialiased">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <div className="rounded-xl border border-slate-200 bg-white p-12 shadow-sm max-w-md mx-auto space-y-2">
            <div className="text-xl">🔍</div>
            <p className="text-sm font-semibold text-slate-800">
              Task record not found
            </p>
            <p className="text-xs text-slate-400">
              This ticket may have been deleted or archived by an administrator.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Main Layout containing Title, Description, and Sidebar properties */}
          <TaskDescription selectedTask={selectedTask} />

          {/* 🛠️ UI CORRECTION: Activity blocks nested to follow the 8-column main container format */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
  
              {/* Comments Feed Section */}
              <Comments
                taskId={taskId!}
                comments={comments}
                loading={commentLoading}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TaskDetail;
