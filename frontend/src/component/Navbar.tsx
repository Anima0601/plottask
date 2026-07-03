import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { logoutUser } from "../store/slices/authSlice";
import {
  getNotifications,
  markAllAsRead,
} from "../store/slices/notificationSlice";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { notifications } = useAppSelector((state) => state.notification);

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  const hasNotifications = unreadCount > 0;

  // Effect A: Load notifications on mount
  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  // Effect B: Handle dropdown click-outside closing routine
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        <div
          className="flex items-center gap-2 font-bold text-lg tracking-wide text-slate-900 select-none cursor-pointer"
          onClick={() => navigate("/home")}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-extrabold text-sm shadow-sm shadow-indigo-100">
            P
          </span>
          <span>
            Plot<span className="text-indigo-600 font-medium">Task</span>
          </span>
        </div>

        {/* User Actions & Profile Panel */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Greeting Text Block */}
          {user?.name && (
            <span className="text-sm font-medium text-slate-600 border-r border-slate-200 pr-4 hidden sm:inline-block">
              Hi,{" "}
              <span className="font-semibold text-slate-800">{user.name}</span>
            </span>
          )}

          {/* 🔔 Interactive Notification Bell Box Dropdown Context */}
          <div className="relative flex items-center" ref={notificationRef}>
            <button
              type="button"
              onClick={() => setShowNotifications((prev) => !prev)}
              className={`relative p-2 rounded-lg transition-colors group focus:outline-none ${
                showNotifications
                  ? "text-slate-600 bg-slate-50"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              <svg
                className="h-5 w-5 transition-transform group-hover:rotate-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>

              {/* Alert Count Pill Badge */}
              {hasNotifications && !showNotifications && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Board Modal Overlay */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-3 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden divide-y divide-slate-100">
                <div className="flex items-center justify-between bg-slate-50/50 px-4 py-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Notifications
                  </h3>
                  {hasNotifications && (
                    <button
                      type="button"
                      onClick={() => dispatch(markAllAsRead())}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 hover:underline transition-colors focus:outline-none"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 bg-white">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-xs font-medium text-slate-400 text-center italic">
                      No updates or alerts recorded yet.
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`px-4 py-3 text-left transition-colors relative ${
                          !notification.isRead
                            ? "bg-indigo-50/40 hover:bg-indigo-50/70"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        {/* Unread Indicator Dot */}
                        {!notification.isRead && (
                          <span className="absolute left-2 top-4.5 h-1.5 w-1.5 rounded-full bg-indigo-600" />
                        )}

                        <div className={!notification.isRead ? "pl-1" : ""}>
                          <p className="text-xs font-bold text-slate-800 tracking-tight">
                            {notification.title}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="mt-2 text-[9px] font-semibold text-slate-400">
                            {new Date(notification.createdAt).toLocaleString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Styled Logout Action Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors group px-2 py-1 rounded-md hover:bg-rose-50/50"
          >
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
          <div className="relative group cursor-pointer ml-1">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-50 to-slate-200 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-700 uppercase shadow-inner transition-colors group-hover:border-indigo-400">
              {userInitial}
            </div>
            <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
