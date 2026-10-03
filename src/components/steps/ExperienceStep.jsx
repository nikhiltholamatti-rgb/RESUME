import { useResume } from "../../context/ResumeContext";
import { GraduationCap, Plus } from "lucide-react";
import AutoGrowTextarea from "../AutoGrowTextarea";

export default function ExperienceStep() {
  const { state, dispatch, ACTIONS } = useResume();
  const experience = state.experience || [];
  const isFresher = Boolean(state.isFresher);

  const upd = (id, f, v) =>
    dispatch({ type: ACTIONS.UPDATE_EXPERIENCE, payload: { id, data: { [f]: v } } });

  function updateBullet(id, bi, v) {
    const exp = experience.find((x) => x.id === id);
    if (!exp) return;
    const b = [...(exp.bullets || [""])];
    b[bi] = v;
    upd(id, "bullets", b);
  }

  function addBullet(id) {
    const exp = experience.find((x) => x.id === id);
    if (!exp) return;
    upd(id, "bullets", [...(exp.bullets || []), ""]);
  }

  function removeBullet(id, bi) {
    const exp = experience.find((x) => x.id === id);
    if (!exp) return;
    upd(id, "bullets", exp.bullets.filter((_, i) => i !== bi));
  }

  return (
    <div className="space-y-5">
      {/* "I'm a fresher" Toggle */}
      <div id="experience" className="p-3.5 rounded-[var(--radius-xs)] bg-[var(--bg-glass-strong)] border border-[var(--border-glass)] flex items-center justify-between">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-white">
          <input
            type="checkbox"
            checked={isFresher}
            onChange={(e) =>
              dispatch({ type: ACTIONS.SET_IS_FRESHER, payload: e.target.checked })
            }
            className="w-4 h-4 rounded text-[var(--accent)] bg-black/30 border-white/20 focus:ring-0 cursor-pointer"
          />
          <GraduationCap size={15} className="text-[var(--accent-light)]" />
          <span>I'm a fresher (student / recent graduate with no work history)</span>
        </label>
        {isFresher && (
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Optional
          </span>
        )}
      </div>

      {isFresher && experience.length === 0 ? (
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
            🎓 Fresher mode active. Work experience is optional and will be skipped in validation. You can still add internships or student projects below if desired.
          </p>
        </div>
      ) : experience.length === 0 ? (
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
            No work experience added yet. Add full-time positions, freelance roles, or internships.
          </p>
        </div>
      ) : null}

      {experience.map((exp, idx) => (
        <div key={exp.id} className="p-5 rounded-[var(--radius-xs)] bg-[var(--bg-glass)] border border-[var(--border-glass)] relative">
          <button
            type="button"
            className="item-delete"
            title="Delete experience entry"
            onClick={() => dispatch({ type: ACTIONS.REMOVE_EXPERIENCE, payload: exp.id })}
          >
            ✕
          </button>
          <p className="text-xs mb-3 font-semibold text-white/90">
            Position #{idx + 1}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-2">Company / Organization *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Stripe or Google"
                value={exp.company}
                onChange={(e) => upd(exp.id, "company", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-2">Role / Job Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Software Engineer II"
                value={exp.role}
                onChange={(e) => upd(exp.id, "role", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-white/90 mb-2">Duration / Period</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Jun 2022 – Present or Jan 2021 – May 2022"
                value={exp.duration}
                onChange={(e) => upd(exp.id, "duration", e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-white/90 mb-2">Responsibilities & Quantified Impact</label>
            {(exp.bullets || [""]).map((b, bi) => (
              <div key={bi} className="flex gap-2 mb-2 items-start">
                <span className="mt-2 text-xs text-[var(--text-muted)]">•</span>
                <AutoGrowTextarea
                  minRows={2}
                  className="flex-1"
                  placeholder="e.g. Led migration to Next.js reducing page load latency by 45% for 2M monthly visitors."
                  value={b}
                  onChange={(e) => updateBullet(exp.id, bi, e.target.value)}
                />
                {(exp.bullets || []).length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger-sm mt-1"
                    title="Remove bullet"
                    onClick={() => removeBullet(exp.id, bi)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn btn-ghost btn-sm mt-1 text-xs"
              onClick={() => addBullet(exp.id)}
            >
              + Add Bullet
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="w-full py-3 mt-4 border-2 border-dashed border-white/20 hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 text-xs font-semibold rounded-lg text-[var(--accent-light)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        onClick={() => dispatch({ type: ACTIONS.ADD_EXPERIENCE })}
      >
        <Plus size={14} /> Add Experience
      </button>
    </div>
  );
}
