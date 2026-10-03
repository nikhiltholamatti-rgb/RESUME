import { useResume } from "../../context/ResumeContext";

export default function AchievementsStep() {
  const { state, dispatch, ACTIONS } = useResume();
  const achievements = state.achievements || [];

  return (
    <>
      <h2 className="step-title">Achievements & Honors</h2>
      <p className="step-subtitle">
        Awards, certifications, hackathons, publications, or key recognitions.
      </p>

      {achievements.length === 0 && (
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
            No achievements added yet. Showcase your top honors, awards, or certifications.
          </p>
        </div>
      )}

      {achievements.map((ach, idx) => (
        <div key={ach.id} className="repeatable-item">
          <button
            type="button"
            className="item-delete"
            title="Delete achievement"
            onClick={() => dispatch({ type: ACTIONS.REMOVE_ACHIEVEMENT, payload: ach.id })}
          >
            ✕
          </button>
          <p className="text-xs mb-2 font-medium" style={{ color: "var(--text-muted)" }}>
            Achievement #{idx + 1}
          </p>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. AWS Certified Solutions Architect – Associate (2024)"
            value={ach.text}
            onChange={(e) =>
              dispatch({
                type: ACTIONS.UPDATE_ACHIEVEMENT,
                payload: { id: ach.id, text: e.target.value },
              })
            }
          />
        </div>
      ))}

      <button
        type="button"
        className="btn btn-ghost w-full"
        onClick={() => dispatch({ type: ACTIONS.ADD_ACHIEVEMENT })}
      >
        + Add Achievement
      </button>
    </>
  );
}
