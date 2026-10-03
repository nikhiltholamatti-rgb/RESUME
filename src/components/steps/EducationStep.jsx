import { useResume } from "../../context/ResumeContext";
import { Plus } from "lucide-react";

export default function EducationStep() {
  const { state, dispatch, ACTIONS } = useResume();
  const education = state.education || [];

  const upd = (id, f, v) =>
    dispatch({ type: ACTIONS.UPDATE_EDUCATION, payload: { id, data: { [f]: v } } });

  return (
    <div className="space-y-5">
      {education.length === 0 && (
        <div
          style={{
            padding: "24px 16px",
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.02)",
            borderRadius: "var(--radius-xs)",
            border: "1px dashed var(--border-glass)",
            marginBottom: "16px",
          }}
        >
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            No education entries added yet.
          </p>
        </div>
      )}

      {education.map((edu, i) => (
        <div key={edu.id} className="p-5 rounded-[var(--radius-xs)] bg-[var(--bg-glass)] border border-[var(--border-glass)] relative">
          <button
            type="button"
            className="item-delete"
            title="Delete education"
            onClick={() => dispatch({ type: ACTIONS.REMOVE_EDUCATION, payload: edu.id })}
          >
            ✕
          </button>
          <p className="text-xs mb-3 font-semibold text-white/90">
            Education #{i + 1}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-white/90 mb-2">College / University *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Stanford University or IIT Bombay"
                value={edu.college}
                onChange={(e) => upd(edu.id, "college", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-2">Degree</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. B.S. or B.Tech"
                value={edu.degree}
                onChange={(e) => upd(edu.id, "degree", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-2">Branch / Major</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Computer Science & AI"
                value={edu.branch}
                onChange={(e) => upd(edu.id, "branch", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-2">Start Year</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 2020"
                value={edu.startYear}
                onChange={(e) => upd(edu.id, "startYear", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-2">End Year (or Expected)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 2024"
                value={edu.endYear}
                onChange={(e) => upd(edu.id, "endYear", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-white/90 mb-2">CGPA / GPA (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 3.9 / 4.0 or 8.8 / 10"
                value={edu.cgpa}
                onChange={(e) => upd(edu.id, "cgpa", e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="w-full py-3 mt-4 border-2 border-dashed border-white/20 hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 text-xs font-semibold rounded-lg text-[var(--accent-light)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        onClick={() => dispatch({ type: ACTIONS.ADD_EDUCATION })}
      >
        <Plus size={14} /> Add Education
      </button>
    </div>
  );
}
