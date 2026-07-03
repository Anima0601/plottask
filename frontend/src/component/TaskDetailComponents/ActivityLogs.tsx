interface Activity {
  _id: string;
  action: string;
  createdAt: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
}

interface ActivityLogsProps {
  activities: Activity[];
  loading: boolean;
}

const ActivityLogs = ({ activities, loading }: ActivityLogsProps) => {
  // Clean date formatter utility
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
      {/* Dynamic Activity Header Block */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          History Timeline
        </h3>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
          {activities?.length || 0}
        </span>
      </div>

      {/* Loading Skeleton Transition Engine */}
      {loading ? (
        <div className="space-y-4 animate-pulse pt-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-6 w-6 rounded-full bg-slate-200 shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 w-2/3 bg-slate-200 rounded" />
                <div className="h-2.5 w-1/4 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : !activities || activities.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-xs italic text-slate-400">
            No organizational workspace history recorded yet.
          </p>
        </div>
      ) : (
        <div className="relative pt-2">
          {/* Vertical Timeline Vector Anchor Line */}
          <div className="absolute left-[13px] top-3 bottom-3 w-px bg-slate-200" />

          <div className="space-y-5">
            {activities.map((activity) => {
              const initial = activity.user?.name
                ? activity.user.name.trim().charAt(0).toUpperCase()
                : "U";

              return (
                <div
                  key={activity._id}
                  className="relative flex items-start gap-4 group"
                >
                  {/* Miniature User Avatar Dot */}
                  <div className="relative z-10 h-7 w-7 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center uppercase shrink-0 shadow-sm">
                    {initial}
                  </div>

                  {/* Operational Content Log Metadata */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                      <p className="text-xs text-slate-600 leading-relaxed">
                        <span className="font-semibold text-slate-800 mr-1">
                          {activity.user?.name || "System automated"}
                        </span>
                        <span className="text-slate-500 italic font-mono bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 text-[11px] mr-1">
                          {activity.action}
                        </span>
                      </p>
                      <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap shrink-0">
                        {formatTime(activity.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLogs;
