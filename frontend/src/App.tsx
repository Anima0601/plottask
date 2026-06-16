import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Hero from "./pages/Hero";
import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "./store/hook";
import { getCurrentUser } from "./store/slices/authSlice";
import ProtectedRoute from "./component/ProtectedRoute";
const App = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);
  return (
    <div>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </div>
  );
};
export default App;
