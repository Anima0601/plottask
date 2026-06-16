import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { logoutUser } from "../store/slices/authSlice";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  const userInitial = user?.name
    ? user.name.trim().charAt(0).toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md px-4 py-3.5 sm:px-6 lg:px-8 shadow-sm">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 font-bold text-lg tracking-wide text-slate-900 select-none">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-extrabold text-sm shadow-sm shadow-indigo-100">
            P
          </span>
          <span>
            Plot<span className="text-indigo-600 font-medium">Task</span>
          </span>
        </div>

        {/* User Actions & Profile Panel */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Greeting Text Block (Safely split out of the logout clickable element) */}
          {user?.name && (
            <span className="text-sm font-medium text-slate-600 border-r border-slate-200 pr-4 hidden sm:inline-block">
              Hi,{" "}
              <span className="font-semibold text-slate-800">{user.name}</span>
            </span>
          )}

          {/* Styled Logout Action Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors group px-2 py-1 rounded-md hover:bg-rose-50/50"
          >
            {/* Minimal Logout Icon SVG */}
            <svg
              className="h-3.5 w-3.5 text-slate-400 group-hover:text-rose-500 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>

          {/* Dynamic User Profile Avatar */}
          <div className="relative group cursor-pointer">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-50 to-slate-200 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-700 uppercase shadow-inner transition-colors group-hover:border-indigo-400">
              {userInitial}
            </div>
            {/* Tiny green online status dot */}
            <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
