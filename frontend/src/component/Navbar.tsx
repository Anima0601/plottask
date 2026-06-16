const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8 shadow-sm">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 font-bold text-lg tracking-wide text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-extrabold text-sm shadow-sm">
            P
          </span>
          <span>
            Plot<span className="text-indigo-600 font-medium">Task</span>
          </span>
        </div>

        {/* User Profile Avatar Placeholder */}
        <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-xs font-semibold text-slate-600 uppercase">
          U
        </div>
      </div>
    </header>
  );
};

export default Navbar;
