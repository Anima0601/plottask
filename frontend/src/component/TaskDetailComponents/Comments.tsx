import { useState } from "react";
import { useAppDispatch } from "../../store/hook";
import { addComment } from "../../store/slices/commentSlice";
import type { Comment } from "../../store/slices/commentSlice";

interface CommentsProps {
  taskId: string;
  comments: Comment[];
  loading: boolean;
}

const Comments = ({ taskId, comments, loading }: CommentsProps) => {
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!message.trim()) return;

    dispatch(
      addComment({
        taskId,
        message,
      }),
    );

    setMessage("");
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
      {/* Header section with Counter pill */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Comments
        </h3>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
          {comments?.length || 0}
        </span>
      </div>

      {/* Input Box Container Area */}
      <div className="flex items-start gap-3">
        {/* Fake Avatar showing active user placeholder */}
        <div className="h-8 w-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm mt-1">
          U
        </div>

        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a comment or internal note..."
            className="w-full rounded-lg border border-slate-200 p-3 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-colors shadow-inner"
            rows={3}
          />

          <div className="mt-2 flex justify-end">
            <button
              onClick={handleSubmit}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all active:scale-[0.98]"
            >
              Save Comment
            </button>
          </div>
        </div>
      </div>

      {/* Separator between editor and stream */}
      {comments?.length > 0 && (
        <div className="border-t border-slate-100 my-2" />
      )}

      {/* Comments Activity Stream */}
      {loading ? (
        <div className="space-y-3 animate-pulse py-4">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 bg-slate-200 rounded-full"></div>
            <div className="h-4 w-32 bg-slate-200 rounded"></div>
          </div>
          <div className="h-12 bg-slate-100 rounded-lg ml-10"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-xs text-slate-400 italic">
            No comments posted yet. Start the conversation above.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {comments.map((comment) => {
            const initial = comment.user?.name
              ? comment.user.name.trim().charAt(0).toUpperCase()
              : "U";

            return (
              <div
                key={comment._id}
                className="flex items-start gap-3 group transition-colors"
              >
                {/* User Avatar Circle */}
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-50 to-slate-200 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-700 uppercase shadow-inner shrink-0 mt-0.5">
                  {initial}
                </div>

                {/* Comment Thread Content Wrapper */}
                <div className="flex-1 overflow-hidden space-y-1">
                  {/* Metadata Header Block */}
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-800 tracking-tight">
                      {comment.user?.name || "Unknown User"}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(comment.createdAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Comment Message Body Card */}
                  <div className="rounded-lg border border-slate-100 bg-slate-50/50 px-3.5 py-2.5">
                    <p className="text-xs leading-relaxed text-slate-600 whitespace-pre-wrap">
                      {comment.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Comments;
