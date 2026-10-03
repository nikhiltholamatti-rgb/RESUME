import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useResume } from "../context/ResumeContext";
import { fetchUserResumes, deleteResumeFromCloud, fetchResumeById } from "../utils/resumeStorage";
import Background3D from "../components/scene/Background3D";
import MagneticButton from "../components/MagneticButton";
import { Plus, Trash2, Edit3, LogOut, ArrowLeft, FileText, CheckCircle2, Clock, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { dispatch, ACTIONS } = useResume();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { replace: true });
      return;
    }

    if (user) {
      loadResumes();
    }
  }, [user, authLoading, navigate]);

  const loadResumes = async () => {
    setLoading(true);
    const list = await fetchUserResumes(user.id);
    setResumes(list);
    setLoading(false);
  };

  const handleCreateNew = () => {
    dispatch({ type: ACTIONS.RESET });
    navigate("/app");
  };

  const handleOpenResume = async (resumeId) => {
    const fullResume = await fetchResumeById(resumeId, user.id);
    if (fullResume && fullResume.data) {
      // Load saved state
      if (fullResume.data.personalInfo) {
        dispatch({ type: ACTIONS.UPDATE_PERSONAL, payload: fullResume.data.personalInfo });
      }
      if (fullResume.data.selectedTemplate) {
        dispatch({ type: ACTIONS.SET_TEMPLATE, payload: fullResume.data.selectedTemplate });
      }
      if (fullResume.data.fontFamily) {
        dispatch({ type: ACTIONS.SET_FONT_FAMILY, payload: fullResume.data.fontFamily });
      }
      if (fullResume.data.accentColor) {
        dispatch({ type: ACTIONS.SET_ACCENT_COLOR, payload: fullResume.data.accentColor });
      }
      if (fullResume.data.summary) {
        dispatch({ type: ACTIONS.SET_SUMMARY, payload: fullResume.data.summary });
      }
      if (fullResume.data.skills) {
        dispatch({ type: ACTIONS.SET_SKILLS, payload: fullResume.data.skills });
      }
      if (Array.isArray(fullResume.data.experience)) {
        // clear and repopulate
        fullResume.data.experience.forEach(exp => {
          dispatch({ type: ACTIONS.ADD_EXPERIENCE });
          dispatch({ type: ACTIONS.UPDATE_EXPERIENCE, payload: { id: exp.id, data: exp } });
        });
      }
      if (Array.isArray(fullResume.data.projects)) {
        fullResume.data.projects.forEach(p => {
          dispatch({ type: ACTIONS.ADD_PROJECT });
          dispatch({ type: ACTIONS.UPDATE_PROJECT, payload: { id: p.id, data: p } });
        });
      }
      if (Array.isArray(fullResume.data.education)) {
        fullResume.data.education.forEach(e => {
          dispatch({ type: ACTIONS.ADD_EDUCATION });
          dispatch({ type: ACTIONS.UPDATE_EDUCATION, payload: { id: e.id, data: e } });
        });
      }
      if (Array.isArray(fullResume.data.activeOptional)) {
        fullResume.data.activeOptional.forEach(secId => {
          dispatch({ type: ACTIONS.TOGGLE_OPTIONAL_SECTION, payload: secId });
          if (Array.isArray(fullResume.data[secId])) {
            fullResume.data[secId].forEach(item => {
              dispatch({ type: ACTIONS.ADD_SECTION_ITEM, payload: { sectionId: secId, item } });
            });
          }
        });
      }
      navigate("/app");
    } else {
      navigate("/app");
    }
  };

  const handleDelete = async (e, resumeId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    setDeletingId(resumeId);
    await deleteResumeFromCloud(resumeId, user.id);
    setResumes((prev) => prev.filter((r) => r.id !== resumeId));
    setDeletingId(null);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="app-wrapper min-h-screen">
      <Background3D />

      <div className="app-content max-w-6xl mx-auto py-6 px-4">
        {/* Top Navbar */}
        <header className="flex items-center justify-between pb-6 mb-8 border-b border-[var(--border-glass)]">
          <div className="flex items-center gap-3">
            <Link
              to="/app"
              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-lg hover:scale-105 transition-transform"
              style={{
                background: "var(--gradient-accent)",
                boxShadow: "0 0 20px var(--accent-glow)",
              }}
            >
              CV
            </Link>
            <div>
              <h1 className="text-xl font-black text-white flex items-center gap-2">
                <span>ResumeForge</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[var(--accent)]/20 text-[var(--accent-light)] border border-[var(--accent)]/30">
                  Cloud Dashboard
                </span>
              </h1>
              <p className="text-xs text-[var(--text-muted)]">
                Logged in as <span className="text-white font-medium">{user?.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/app"
              className="btn btn-outline btn-sm flex items-center gap-1.5"
            >
              <ArrowLeft size={14} /> Back to Editor
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="btn btn-outline btn-sm flex items-center gap-1.5 text-red-400 hover:text-red-300 hover:border-red-500/50"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </header>

        {/* Dashboard Main Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Your Resumes</span>
              <Sparkles size={18} className="text-[var(--accent-light)]" />
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Manage your saved ATS resumes, modify profiles, or craft a new role-tailored version.
            </p>
          </div>

          <MagneticButton
            type="button"
            className="btn btn-neon flex items-center gap-2"
            onClick={handleCreateNew}
          >
            <Plus size={16} /> Create New Resume
          </MagneticButton>
        </div>

        {/* Resumes Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-10 h-10 rounded-full border-2 border-[var(--border-glass)] border-t-[var(--accent)] animate-spin mb-3" />
            <p className="text-xs text-[var(--text-muted)]">Loading your cloud resumes...</p>
          </div>
        ) : resumes.length === 0 ? (
          <div className="glass p-12 text-center rounded-[var(--radius)] border border-[var(--border-glass)]">
            <div className="w-16 h-16 rounded-2xl bg-white/5 mx-auto flex items-center justify-center text-[var(--accent-light)] mb-4">
              <FileText size={32} />
            </div>
            <h3 className="text-base font-bold text-white mb-1">No Resumes Saved Yet</h3>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto mb-6">
              Start building your first ATS-optimized resume. All changes autosave to your cloud account.
            </p>
            <MagneticButton
              type="button"
              className="btn btn-neon !py-2.5 !px-6"
              onClick={handleCreateNew}
            >
              <Plus size={16} className="inline mr-1" /> Open Resume Builder
            </MagneticButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {resumes.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onClick={() => handleOpenResume(item.id)}
                className="glass p-5 rounded-[var(--radius)] border border-[var(--border-glass)] hover:border-[var(--accent)]/50 cursor-pointer flex flex-col justify-between transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/15 border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent-light)] group-hover:scale-105 transition-transform">
                      <FileText size={20} />
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/5 text-[var(--text-muted)] border border-white/10">
                      {item.template_id || "classic"}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white group-hover:text-[var(--accent-light)] transition-colors line-clamp-1">
                    {item.title || "Untitled Resume"}
                  </h4>

                  <div className="flex items-center gap-2 mt-2 text-[11px] text-[var(--text-muted)]">
                    <Clock size={12} />
                    <span>
                      {item.updated_at
                        ? new Date(item.updated_at).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Recently updated"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-[var(--border-glass)]">
                  <span className="text-xs text-[var(--accent-light)] font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <Edit3 size={13} /> Edit Resume
                  </span>

                  <button
                    type="button"
                    disabled={deletingId === item.id}
                    onClick={(e) => handleDelete(e, item.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete resume"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
