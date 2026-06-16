import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";

import Hero from "./pages/Hero";
import Auth from "./pages/Auth";
import Home from "./pages/Home";

import { useAppDispatch } from "./store/hook";
import { getCurrentUser } from "./store/slices/authSlice";

import ProtectedRoute from "./component/ProtectedRoute";
import PublicRoute from "./component/PublicRoute";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return (
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
    </Routes>
  );
};

export default App;
