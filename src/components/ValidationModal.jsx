import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X, ArrowRight } from "lucide-react";
import { SECTIONS } from "../data/sections";

export default function ValidationModal({ isOpen, errors = [], onClose, onNavigateToSection }) {
  if (!isOpen || errors.length === 0) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="glass p-6 rounded-[var(--radius)] max-w-md w-full border border-red-500/40 shadow-2xl bg-[#0f0e1e]/90"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-3 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2.5 text-red-400 font-bold text-base">
              <AlertCircle size={20} className="shrink-0" />
              <span>Mandatory Sections Incomplete</span>
            </div>
            <button
              type="button"
              className="text-gray-400 hover:text-white"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </div>

          <p className="text-xs text-[var(--text-secondary)] mb-4">
            To build an ATS-compliant and complete resume, please fill out the following required information:
          </p>

          {/* List of Missing Fields */}
          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {errors.map((err, idx) => {
              const sec = SECTIONS.find((s) => s.id === err.sectionId);
              return (
                <div
                  key={idx}
                  onClick={() => onNavigateToSection(err)}
                  className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 hover:border-red-500/50 hover:bg-red-500/15 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      {sec?.label || "Section"}
                    </span>
                    <span className="text-[11px] text-red-300">
                      {err.message}
                    </span>
                  </div>
                  <span className="text-xs text-red-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Fix <ArrowRight size={12} />
                  </span>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
            <button
              type="button"
              className="btn btn-outline btn-sm !px-4"
              onClick={onClose}
            >
              I'll complete them now
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
