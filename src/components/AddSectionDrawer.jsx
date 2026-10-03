import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useResume } from "../context/ResumeContext";
import { OPTIONAL_SECTIONS } from "../data/sections";
import {
  Search,
  X,
  Plus,
  Check,
  Award,
  Users,
  Trophy,
  GitPullRequest,
  BookOpen,
  Languages,
  Heart,
  Sparkles,
  BookMarked,
  CheckCircle2,
} from "lucide-react";

const ICON_MAP = {
  Award,
  Users,
  Trophy,
  GitPullRequest,
  BookOpen,
  Languages,
  Heart,
  Sparkles,
  BookMarked,
  CheckCircle2,
};

export default function AddSectionDrawer({ isOpen, onClose }) {
  const { state, dispatch, ACTIONS } = useResume();
  const [query, setQuery] = useState("");
  const activeOptional = state.activeOptional || [];

  const filtered = OPTIONAL_SECTIONS.filter((sec) => {
    const q = query.toLowerCase();
    return (
      sec.label.toLowerCase().includes(q) ||
      sec.description.toLowerCase().includes(q)
    );
  });

  const handleToggle = (secId) => {
    dispatch({ type: ACTIONS.TOGGLE_OPTIONAL_SECTION, payload: secId });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="glass p-5 rounded-[var(--radius)] max-w-xl w-full max-h-[85vh] flex flex-col border border-[var(--border-glass)] shadow-2xl"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-glass)] mb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>✨ Add Resume Sections</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent)]/20 text-[var(--accent-light)] font-mono">
                    {activeOptional.length} Active
                  </span>
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Expand your resume with specialized sections. Added sections can be edited or removed at any time.
                </p>
              </div>
              <button
                type="button"
                className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                onClick={onClose}
              >
                <X size={18} />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mb-3">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />
              <input
                type="text"
                className="form-input !pl-9 !py-2 !text-xs"
                placeholder="Search sections (e.g. Certifications, Publications, Languages...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>

            {/* Section List */}
            <div className="overflow-y-auto space-y-2.5 pr-1 flex-1 min-h-[280px]">
              {filtered.length === 0 ? (
                <div className="text-center py-10 text-[var(--text-muted)] text-xs">
                  No matching sections found for "{query}".
                </div>
              ) : (
                filtered.map((sec) => {
                  const isAdded = activeOptional.includes(sec.id);
                  const IconComponent = ICON_MAP[sec.icon] || Sparkles;

                  return (
                    <div
                      key={sec.id}
                      onClick={() => handleToggle(sec.id)}
                      className={`p-3 rounded-[var(--radius-xs)] border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isAdded
                          ? "bg-[var(--accent)]/15 border-[var(--accent)] shadow-[0_0_15px_var(--accent-glow)]"
                          : "bg-[var(--bg-glass-strong)] border-[var(--border-glass)] hover:border-white/20 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            isAdded
                              ? "bg-[var(--accent)] text-white"
                              : "bg-white/5 text-[var(--text-secondary)]"
                          }`}
                        >
                          <IconComponent size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white flex items-center gap-2">
                            <span>{sec.label}</span>
                          </div>
                          <p className="text-[11px] text-[var(--text-muted)] mt-0.5 line-clamp-1">
                            {sec.description}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`btn btn-sm !py-1 !px-3 shrink-0 ${
                          isAdded ? "btn-neon" : "btn-outline"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggle(sec.id);
                        }}
                      >
                        {isAdded ? (
                          <>
                            <Check size={12} className="inline mr-1" /> Added
                          </>
                        ) : (
                          <>
                            <Plus size={12} className="inline mr-1" /> Add
                          </>
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-[var(--border-glass)] mt-3 flex justify-end">
              <button
                type="button"
                className="btn btn-neon btn-sm !px-5"
                onClick={onClose}
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
