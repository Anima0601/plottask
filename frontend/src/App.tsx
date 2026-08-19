import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { ToastProvider } from "./context/ToastContext";

import Hero from "./pages/Hero";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import ProjectDetail from "./pages/ProjectDetail";
import TaskDetail from "./pages/TaskDetail";
import CreateProject from "./pages/CreateProject";
import EditProject from "./pages/EditProject";

import { useAppDispatch } from "./store/hook";
import { getCurrentUser } from "./store/slices/authSlice";

import ProtectedRoute from "./component/RoutesComponent/ProtectedRoute";
import PublicRoute from "./component/RoutesComponent/PublicRoute";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return (
    <ToastProvider>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Hero />
            </PublicRoute>
          }
        />

        <Route
          path="/auth"
          element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          }
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:projectId/edit"
          element={
            <ProtectedRoute>
              <EditProject />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:projectId"
          element={
            <ProtectedRoute>
              <ProjectDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks/:taskId"
          element={
            <ProtectedRoute>
              <TaskDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/create"
          element={
            <ProtectedRoute>
              <CreateProject />
            </ProtectedRoute>
          }
        />
      </Routes>
    </ToastProvider>
  );
};

export default App;
