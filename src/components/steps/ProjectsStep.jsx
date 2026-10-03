import { useResume } from "../../context/ResumeContext";
import { Plus } from "lucide-react";
import AutoGrowTextarea from "../AutoGrowTextarea";

export default function ProjectsStep() {
  const { state, dispatch, ACTIONS } = useResume();
  const projects = state.projects || [];

  const upd = (id, f, v) =>
    dispatch({ type: ACTIONS.UPDATE_PROJECT, payload: { id, data: { [f]: v } } });

  function updateBullet(id, bi, v) {
    const p = projects.find((x) => x.id === id);
    if (!p) return;
    const b = [...(p.bullets || [""])];
    b[bi] = v;
    upd(id, "bullets", b);
  }

  function addBullet(id) {
    const p = projects.find((x) => x.id === id);
    if (!p) return;
    upd(id, "bullets", [...(p.bullets || []), ""]);
  }

  function removeBullet(id, bi) {
    const p = projects.find((x) => x.id === id);
    if (!p) return;
    upd(id, "bullets", p.bullets.filter((_, i) => i !== bi));
  }

  return (
    <div className="space-y-5">
      {projects.length === 0 && (
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
            No projects added yet. Click "+ Add Project" to highlight your work.
          </p>
        </div>
      )}

      {projects.map((proj, idx) => (
        <div key={proj.id} className="p-5 rounded-[var(--radius-xs)] bg-[var(--bg-glass)] border border-[var(--border-glass)] relative">
          <button
            type="button"
            className="item-delete"
            title="Delete project"
            onClick={() => dispatch({ type: ACTIONS.REMOVE_PROJECT, payload: proj.id })}
          >
            ✕
          </button>
          <p className="text-xs mb-3 font-semibold text-white/90">
            Project #{idx + 1}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-white/90 mb-2">Project Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. CloudPulse — Real-Time Telemetry Dashboard"
                value={proj.name}
                onChange={(e) => upd(proj.id, "name", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-white/90 mb-2">Technologies Used</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. React, TypeScript, GraphQL, Tailwind CSS, Docker"
                value={proj.techStack}
                onChange={(e) => upd(proj.id, "techStack", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-2">Live Deployment URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://cloudpulse.dev"
                value={proj.liveLink}
                onChange={(e) => upd(proj.id, "liveLink", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-2">Source Code / GitHub URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://github.com/username/project"
                value={proj.githubLink}
                onChange={(e) => upd(proj.id, "githubLink", e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-white/90 mb-2">Impact & Architecture Bullets</label>
            {(proj.bullets || [""]).map((b, bi) => (
              <div key={bi} className="flex gap-2 mb-2 items-start">
                <span className="mt-2 text-xs text-[var(--text-muted)]">•</span>
                <AutoGrowTextarea
                  minRows={2}
                  className="flex-1"
                  placeholder="e.g. Architected streaming data pipeline processing 10k events/sec with 99.9% uptime."
                  value={b}
                  onChange={(e) => updateBullet(proj.id, bi, e.target.value)}
                />
                {(proj.bullets || []).length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger-sm mt-1"
                    title="Remove bullet"
                    onClick={() => removeBullet(proj.id, bi)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn btn-ghost btn-sm mt-1 text-xs"
              onClick={() => addBullet(proj.id)}
            >
              + Add Bullet
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="w-full py-3 mt-4 border-2 border-dashed border-white/20 hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 text-xs font-semibold rounded-lg text-[var(--accent-light)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        onClick={() => dispatch({ type: ACTIONS.ADD_PROJECT })}
      >
        <Plus size={14} /> Add Project
      </button>
    </div>
  );
}
