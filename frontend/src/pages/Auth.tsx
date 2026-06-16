import LoginComponent from "../component/LoginComponent";
import SignUpComponent from "../component/SignUpComponent";
import api from "../utils/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  interface FormData {
    email: string;
    password: string;
  }

  interface RegisterFormData {
    name: string;
    email: string;
    password: string;
  }

  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState<boolean>(true);

  const handleLogin = async (formData: FormData) => {
    if (formData.email.trim() == "" || formData.password.trim() == "") {
      return alert("Form Incomplete");
    }
    try {
      const res = await api.post("/auth/login", formData);
      alert(res.data.message);
      navigate("/home");
    } catch (error: any) {
      alert(error?.response?.data?.message);
    }
  };

  const handleSignUp = async (registerFormData: RegisterFormData) => {
    if (
      registerFormData.email.trim() == "" ||
      registerFormData.password.trim() == "" ||
      registerFormData.name.trim() == ""
    ) {
      return alert("Form Incomplete");
    }
    try {
      const res = await api.post("/auth/register", registerFormData);
      alert(res.data.message);
      setIsSignIn(true);
    } catch (error: any) {
      alert(error?.response?.data?.message);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-12 bg-slate-50 font-sans antialiased">
      {/* Left Column: Visual branding/marketing sidebar */}
      <div className="hidden lg:flex lg:col-span-5 xl:col-span-4 bg-indigo-900 flex-col justify-between p-12 text-white relative overflow-hidden">
        {/* Geometric pattern background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

        {/* Brand Logo Layout */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 font-bold text-xl tracking-wide">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-indigo-900 font-extrabold shadow-sm">
              P
            </span>
            <span>
              Plot<span className="text-indigo-300 font-medium">Task</span>
            </span>
          </div>
        </div>

        {/* Brandline & Value Propositions */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
              Bring order to your team's chaos.
            </h1>
            <p className="text-indigo-200 text-sm max-w-sm">
              The central workspace to plot roadmaps, track daily tasks, and
              ship features faster.
            </p>
          </div>

          {/* Quick Mini Feature Checklist */}
          <ul className="space-y-3 text-sm text-indigo-100 border-t border-indigo-800/60 pt-6">
            <li className="flex items-center gap-2">
              <svg
                className="h-4 w-4 text-indigo-400 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Plot Interactive Roadmaps
            </li>
            <li className="flex items-center gap-2">
              <svg
                className="h-4 w-4 text-indigo-400 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Track Tasks & Sprint Progress
            </li>
            <li className="flex items-center gap-2">
              <svg
                className="h-4 w-4 text-indigo-400 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Real-time Team Collaboration
            </li>
          </ul>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-indigo-300">
          © 2026 PlotTask Inc. All rights reserved.
        </div>
      </div>

      {/* Right Column: Dynamic Form Container */}
      <div className="col-span-1 lg:col-span-7 xl:col-span-8 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Dynamic Component Swap */}
          {isSignIn ? (
            <LoginComponent onLogin={handleLogin} />
          ) : (
            <SignUpComponent SignUp={handleSignUp} />
          )}

          {/* Router Switching Panel */}
          <div className="mt-4 text-center">
            <p className="text-sm text-slate-600">
              {isSignIn ? "New to the platform?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsSignIn(!isSignIn)}
                className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors focus:outline-none focus:underline"
              >
                {isSignIn ? "Create a workspace" : "Sign in to workspace"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
