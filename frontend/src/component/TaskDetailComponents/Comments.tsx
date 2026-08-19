import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { addComment, deleteComment } from "../../store/slices/commentSlice";
import type { Comment } from "../../store/slices/commentSlice";

interface CommentsProps {
  taskId: string;
  comments: Comment[];
  loading: boolean;
}

const Comments = ({ taskId, comments, loading }: CommentsProps) => {
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  const { user } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!message.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await dispatch(
        addComment({
          taskId,
          message: message.trim(),
        }),
      ).unwrap();
      setMessage("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Cmd+Enter or Ctrl+Enter
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const confirmDelete = async () => {
    if (!commentToDelete) return;
    try {
      await dispatch(deleteComment(commentToDelete)).unwrap();
      setCommentToDelete(null);
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Activity & Discussion
          </h3>
          <span className="rounded-full bg-indigo-50 border border-indigo-100/80 px-2 py-0.5 text-[11px] font-bold text-indigo-600">
            {comments?.length || 0}
          </span>
        </div>
      </div>

      {/* Add Comment Box */}
      <div className="flex items-start gap-3.5">
        <div className="h-8 w-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs ring-2 ring-indigo-50 mt-0.5">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>

        <div className="flex-1 space-y-2">
          <div className="relative rounded-lg border border-slate-200 bg-slate-50/30 transition-all focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write a comment or update (Ctrl/⌘ + Enter to post)..."
              className="w-full resize-none bg-transparent p-3 text-xs leading-relaxed text-slate-800 placeholder-slate-400 outline-none"
              rows={3}
            />
            <div className="flex items-center justify-between border-t border-slate-100/80 px-3 py-2 bg-slate-50/50 rounded-b-lg">
              <span className="text-[10px] text-slate-400 font-medium">
                Markdown supported
              </span>
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={!message.trim() || isSubmitting}
                className="cursor-pointer rounded-md bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSubmitting ? "Posting..." : "Comment"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4 pt-2">
        {loading ? (
          <div className="space-y-4 py-2">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-start gap-3 animate-pulse">
                <div className="h-8 w-8 rounded-full bg-slate-200 shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-28 rounded bg-slate-200"></div>
                  <div className="h-14 rounded-lg bg-slate-100"></div>
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center bg-slate-50/30">
            <svg
              className="mx-auto h-6 w-6 text-slate-300 mb-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-xs font-medium text-slate-400">
              No comments posted yet. Start the thread above.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => {
              const initial = comment.user?.name
                ? comment.user.name.trim().charAt(0).toUpperCase()
                : "U";

              const isOwner = comment.user?._id === user?.id;
              const isAdmin = user?.role === "admin";
              const canDelete = isOwner || isAdmin;

              return (
                <div
                  key={comment._id}
                  className="group relative flex items-start gap-3 transition-all"
                >
                  {/* User Avatar */}
                  <div className="h-8 w-8 shrink-0 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 uppercase shadow-2xs mt-0.5">
                    {initial}
                  </div>

                  {/* Comment Body Wrapper */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-800">
                          {comment.user?.name || "Unknown User"}
                        </span>

                        {isOwner && (
                          <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[9px] font-semibold text-slate-600">
                            You
                          </span>
                        )}

                        {isAdmin && comment.user?._id !== user?.id && (
                          <span className="rounded bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 text-[9px] font-semibold text-indigo-600">
                            Admin
                          </span>
                        )}

                        <span className="text-[10px] text-slate-400 font-medium">
                          •{" "}
                          {new Date(comment.createdAt).toLocaleString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </div>

                      {/* Delete action button (reveals nicely on hover or remains accessible) */}
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => setCommentToDelete(comment._id)}
                          className="cursor-pointer text-[11px] font-medium text-slate-400 opacity-0 group-hover:opacity-100 hover:text-rose-600 transition-all p-1"
                          title="Delete comment"
                        >
                          <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                    </div>

                    <div className="rounded-xl border border-slate-200/70 bg-slate-50/50 p-3 shadow-2xs hover:bg-slate-50 transition-colors">
                      <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap break-words">
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

      {/* Delete Confirmation Modal */}
      {commentToDelete && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Delete Comment
                </h4>
                <p className="text-xs text-slate-500">
                  Are you sure you want to remove this comment?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCommentToDelete(null)}
                className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="cursor-pointer rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-rose-500 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comments;
