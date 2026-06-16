import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hook";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { loading, isAuthenticated } = useAppSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 font-sans antialiased">
        <div className="flex flex-col items-center space-y-4">
          {/* Animated Brand Pulse Indicator */}
          <div className="relative flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-white font-extrabold text-xl shadow-md">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-lg bg-indigo-400 opacity-20"></span>
            P
          </div>

          {/* Supporting Text */}
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-800">
              Verifying session...
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Securing your PlotTask workspace.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
