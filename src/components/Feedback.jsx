import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import {
  Star,
  MessageSquare,
  Send,
  Trash2,
  AlertCircle,
  CheckCircle2,
  LogIn,
  Loader2,
  Sparkles,
  MessageCircle,
} from "lucide-react";

const PAGE_SIZE = 20;

/**
 * Format timestamp into relative time ("just now", "2 hours ago", "3 days ago")
 */
function formatRelativeTime(dateString) {
  if (!dateString) return "just now";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "recently";
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 30) return "just now";
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return diffInMonths === 1 ? "1 month ago" : `${diffInMonths} months ago`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return diffInYears === 1 ? "1 year ago" : `${diffInYears} years ago`;
  } catch {
    return "recently";
  }
}

export default function Feedback({ id = "feedback" }) {
  const { user } = useAuth();

  // Feedback list state
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Deletion state
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  // Track mounted state
  const isMountedRef = useRef(true);

  // Fetch initial feedback list
  useEffect(() => {
    isMountedRef.current = true;

    async function fetchInitialFeedback() {
      setLoading(true);
      setFetchError(null);
      try {
        const { data, error } = await supabase
          .from("feedback")
          .select("*")
          .order("created_at", { ascending: false })
          .range(0, PAGE_SIZE - 1);

        if (!isMountedRef.current) return;

        if (error) {
          console.error("Error fetching feedback:", error.message);
          setFetchError("Unable to load feedback at this time.");
        } else {
          setFeedbacks(data || []);
          if (!data || data.length < PAGE_SIZE) {
            setHasMore(false);
          }
        }
      } catch (err) {
        if (!isMountedRef.current) return;
        console.error("Unexpected error fetching feedback:", err);
        setFetchError("Failed to connect to feedback service.");
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    }

    fetchInitialFeedback();

    // Subscribe to Supabase Realtime INSERT & DELETE events
    const channel = supabase
      .channel("public:feedback")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "feedback" },
        (payload) => {
          if (payload.new) {
            setFeedbacks((prev) => {
              // Deduplicate if already present
              if (prev.some((item) => item.id === payload.new.id)) {
                return prev;
              }
              return [payload.new, ...prev];
            });
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "feedback" },
        (payload) => {
          if (payload.old?.id) {
            setFeedbacks((prev) =>
              prev.filter((item) => item.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      isMountedRef.current = false;
      supabase.removeChannel(channel);
    };
  }, []);

  // Load more items
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    try {
      const from = feedbacks.length;
      const to = from + PAGE_SIZE - 1;

      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        console.error("Error loading more feedback:", error.message);
      } else {
        if (!data || data.length === 0) {
          setHasMore(false);
        } else {
          setFeedbacks((prev) => {
            const existingIds = new Set(prev.map((f) => f.id));
            const newItems = data.filter((f) => !existingIds.has(f.id));
            return [...prev, ...newItems];
          });
          if (data.length < PAGE_SIZE) {
            setHasMore(false);
          }
        }
      }
    } catch (err) {
      console.error("Unexpected error in handleLoadMore:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || isSubmitting) return;

    setSubmitError(null);
    setSubmitSuccess(false);

    const trimmedMessage = message.trim();

    // Validation
    if (rating < 1 || rating > 5) {
      setSubmitError("Please select a star rating (1 to 5).");
      return;
    }

    if (trimmedMessage.length < 5) {
      setSubmitError("Feedback must be at least 5 characters long.");
      return;
    }

    if (trimmedMessage.length > 500) {
      setSubmitError("Feedback cannot exceed 500 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const resolvedUserName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "Anonymous";

      const resolvedAvatarUrl =
        user.user_metadata?.avatar_url || user.user_metadata?.picture || null;

      const newRecord = {
        user_id: user.id,
        user_name: resolvedUserName,
        avatar_url: resolvedAvatarUrl,
        rating,
        message: trimmedMessage,
      };

      const { data, error } = await supabase
        .from("feedback")
        .insert([newRecord])
        .select();

      if (error) {
        console.error("Feedback submission error:", error.message);
        setSubmitError(error.message || "Failed to submit feedback.");
      } else {
        // Reset form
        setRating(0);
        setHoverRating(0);
        setMessage("");
        setSubmitSuccess(true);

        // Optimistically add to state if insert succeeded and not already inserted by Realtime
        if (data && data.length > 0) {
          const inserted = data[0];
          setFeedbacks((prev) => {
            if (prev.some((f) => f.id === inserted.id)) return prev;
            return [inserted, ...prev];
          });
        }

        // Auto-dismiss success notification after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      }
    } catch (err) {
      console.error("Unexpected feedback submission error:", err);
      setSubmitError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete feedback handler
  const handleDelete = async (feedbackId) => {
    if (!user || deletingId) return;

    setDeletingId(feedbackId);
    setDeleteError(null);

    try {
      const { error } = await supabase
        .from("feedback")
        .delete()
        .eq("id", feedbackId)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error deleting feedback:", error.message);
        setDeleteError("Failed to delete feedback. Please try again.");
      } else {
        setFeedbacks((prev) => prev.filter((item) => item.id !== feedbackId));
        setConfirmDeleteId(null);
      }
    } catch (err) {
      console.error("Unexpected delete error:", err);
      setDeleteError("An unexpected error occurred while deleting.");
    } finally {
      setDeletingId(null);
    }
  };

  // Compute average rating
  const averageRating = useMemo(() => {
    if (feedbacks.length === 0) return null;
    const sum = feedbacks.reduce((acc, f) => acc + (f.rating || 0), 0);
    return (sum / feedbacks.length).toFixed(1);
  }, [feedbacks]);

  return (
    <section id={id} className="w-full mt-16 pt-8 pb-4 scroll-mt-24">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[var(--accent-light)] mb-3">
          <Sparkles size={13} className="text-indigo-400" />
          <span>Community Wall</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          What people say
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-2">
          Discover how job seekers and engineers build standout resumes with ResumeForge.
        </p>

        {averageRating && (
          <div className="inline-flex items-center gap-2 mt-4 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
            <div className="flex items-center text-amber-400">
              <Star size={14} className="fill-amber-400 text-amber-400" />
            </div>
            <span className="font-bold text-white">{averageRating} / 5.0</span>
            <span className="text-[var(--text-muted)]">
              • {feedbacks.length} {feedbacks.length === 1 ? "review" : "reviews"}
            </span>
          </div>
        )}
      </div>

      {/* Main Content Layout: Form Card & Feedback Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Feedback Form or Sign In Prompt */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <div className="glass p-6 rounded-[var(--radius)] border border-[var(--border-glass)] relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <MessageCircle size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Leave Feedback</h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Your thoughts help us improve
                </p>
              </div>
            </div>

            {user ? (
              /* Authenticated User Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Active user badge */}
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.02] border border-white/5">
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="User avatar"
                      className="w-7 h-7 rounded-full object-cover border border-white/10"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {(
                        user.user_metadata?.full_name ||
                        user.email ||
                        "U"
                      )[0].toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-white truncate">
                      {user.user_metadata?.full_name ||
                        user.email?.split("@")[0]}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)] truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Star Rating Selector */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                    Rating <span className="text-rose-400">*</span>
                  </label>
                  <div className="flex items-center gap-1.5" role="group" aria-label="Rating selector">
                    {[1, 2, 3, 4, 5].map((starVal) => {
                      const isFilled =
                        (hoverRating || rating) >= starVal;
                      return (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() => setRating(starVal)}
                          onMouseEnter={() => setHoverRating(starVal)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 rounded-md hover:bg-white/5 transition-transform active:scale-90 focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer"
                          aria-label={`Rate ${starVal} out of 5 stars`}
                        >
                          <Star
                            size={22}
                            className={`transition-colors ${
                              isFilled
                                ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                                : "text-gray-600 hover:text-gray-400"
                            }`}
                          />
                        </button>
                      );
                    })}
                    <span className="text-xs font-medium text-[var(--text-muted)] ml-2">
                      {hoverRating || rating ? (
                        <span className="text-amber-300 font-semibold">
                          {hoverRating || rating} / 5
                        </span>
                      ) : (
                        "Tap to rate"
                      )}
                    </span>
                  </div>
                </div>

                {/* Textarea */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="feedback-message"
                      className="block text-xs font-semibold text-[var(--text-secondary)]"
                    >
                      Message <span className="text-rose-400">*</span>
                    </label>
                    <span
                      className={`text-[11px] font-mono ${
                        message.length > 500
                          ? "text-rose-400 font-bold"
                          : message.length < 5 && message.length > 0
                          ? "text-amber-400"
                          : "text-[var(--text-dim)]"
                      }`}
                    >
                      {message.length}/500
                    </span>
                  </div>
                  <textarea
                    id="feedback-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={500}
                    placeholder="Share what you liked, how your resume turned out, or suggestions for new templates..."
                    className="w-full px-3.5 py-2.5 rounded-[var(--radius-xs)] bg-[var(--bg-input)] border border-[var(--border-glass)] text-white text-xs placeholder:text-[var(--text-dim)] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-y min-h-[95px] max-h-[220px]"
                  />
                  {message.length > 0 && message.length < 5 && (
                    <p className="text-[10px] text-amber-400 mt-1">
                      Minimum 5 characters required ({5 - message.length} more needed).
                    </p>
                  )}
                </div>

                {/* Feedback Alerts */}
                {submitError && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
                    <AlertCircle size={15} className="shrink-0 mt-0.5" />
                    <span>{submitError}</span>
                  </div>
                )}

                {submitSuccess && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2 animate-fadeIn">
                    <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
                    <span>Thank you! Your feedback has been published.</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    rating === 0 ||
                    message.trim().length < 5 ||
                    message.trim().length > 500
                  }
                  className="w-full btn btn-neon !py-2.5 !px-4 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin text-white" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Submit feedback</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Guest State: Sign-in CTA */
              <div className="text-center py-6 px-2 space-y-4">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <LogIn size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    Have thoughts to share?
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Sign in to leave your rating, review templates, and join our public wall of feedback.
                  </p>
                </div>
                <Link
                  to="/login"
                  className="w-full btn btn-neon !py-2.5 !px-4 text-xs font-semibold flex items-center justify-center gap-2 shadow-lg"
                >
                  <LogIn size={14} />
                  <span>Sign in to leave feedback</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Feedback List Stream */}
        <div className="lg:col-span-8 space-y-4">
          {/* Global delete error notification if any */}
          {deleteError && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertCircle size={15} />
                {deleteError}
              </span>
              <button
                type="button"
                onClick={() => setDeleteError(null)}
                className="text-rose-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* Fetch error display */}
          {fetchError && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{fetchError}</span>
            </div>
          )}

          {/* Loading Skeleton State */}
          {loading && feedbacks.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="glass p-5 rounded-[var(--radius-sm)] border border-[var(--border-glass)] animate-pulse space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5" />
                    <div className="space-y-1.5 flex-1">
                      <div className="w-24 h-3 rounded bg-white/10" />
                      <div className="w-16 h-2 rounded bg-white/5" />
                    </div>
                  </div>
                  <div className="w-20 h-3 rounded bg-white/10" />
                  <div className="space-y-1.5 pt-1">
                    <div className="w-full h-2.5 rounded bg-white/5" />
                    <div className="w-4/5 h-2.5 rounded bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : feedbacks.length === 0 ? (
            /* Empty State */
            <div className="glass p-12 rounded-[var(--radius)] border border-dashed border-[var(--border-glass)] text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-white/5 flex items-center justify-center text-[var(--text-muted)]">
                <MessageSquare size={26} />
              </div>
              <h4 className="text-base font-bold text-white">
                No feedback yet, be the first!
              </h4>
              <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
                Share your resume building journey and help other job seekers build ATS-optimized resumes.
              </p>
            </div>
          ) : (
            /* List of Feedback Cards */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {feedbacks.map((item) => {
                const isOwner = user && item.user_id === user.id;
                const isConfirming = confirmDeleteId === item.id;
                const isCurrentlyDeleting = deletingId === item.id;

                return (
                  <div
                    key={item.id}
                    className="glass p-5 rounded-[var(--radius-sm)] border border-[var(--border-glass)] hover:border-white/15 transition-all flex flex-col justify-between group relative overflow-hidden"
                  >
                    {/* Top Row: User Avatar, Name, Timestamp & Delete Action */}
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {item.avatar_url ? (
                            <img
                              src={item.avatar_url}
                              alt={item.user_name || "User"}
                              className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                if (e.currentTarget.nextElementSibling) {
                                  e.currentTarget.nextElementSibling.style.display =
                                    "flex";
                                }
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-sm shrink-0 ${
                              item.avatar_url ? "hidden" : "flex"
                            }`}
                          >
                            {(item.user_name || "U")[0].toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-white truncate">
                              {item.user_name || "Anonymous"}
                            </h4>
                            <p className="text-[11px] text-[var(--text-muted)]">
                              {formatRelativeTime(item.created_at)}
                            </p>
                          </div>
                        </div>

                        {/* Owner Delete Button with Confirmation Step */}
                        {isOwner && (
                          <div className="shrink-0">
                            {isConfirming ? (
                              <div className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/25 px-2 py-1 rounded-md">
                                <span className="text-[10px] text-rose-300 font-medium">
                                  Delete?
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(item.id)}
                                  disabled={isCurrentlyDeleting}
                                  className="text-[10px] font-bold text-rose-300 hover:text-white px-1.5 py-0.5 rounded bg-rose-500/30 hover:bg-rose-500/50 transition-colors disabled:opacity-50"
                                >
                                  {isCurrentlyDeleting ? "..." : "Yes"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(null)}
                                  disabled={isCurrentlyDeleting}
                                  className="text-[10px] text-gray-400 hover:text-gray-200 px-1 py-0.5 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(item.id)}
                                className="opacity-70 group-hover:opacity-100 p-1.5 rounded-md text-[var(--text-dim)] hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                                title="Delete your feedback"
                                aria-label="Delete this feedback"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Star Rating Display */}
                      <div className="flex items-center gap-1 mb-2.5" aria-label={`${item.rating} out of 5 stars`}>
                        {[1, 2, 3, 4, 5].map((starIdx) => (
                          <Star
                            key={starIdx}
                            size={14}
                            className={
                              starIdx <= (item.rating || 0)
                                ? "text-amber-400 fill-amber-400"
                                : "text-gray-700"
                            }
                          />
                        ))}
                      </div>

                      {/* Plain-text Message: Rendered safely without dangerouslySetInnerHTML */}
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap break-words">
                        {item.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Load More Button */}
          {hasMore && feedbacks.length >= PAGE_SIZE && (
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="btn btn-outline !py-2 !px-5 text-xs font-semibold inline-flex items-center gap-2 hover:bg-white/5 cursor-pointer disabled:opacity-50"
              >
                {loadingMore ? (
                  <>
                    <Loader2 size={14} className="animate-spin text-indigo-400" />
                    <span>Loading more...</span>
                  </>
                ) : (
                  <span>Load more feedback</span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
