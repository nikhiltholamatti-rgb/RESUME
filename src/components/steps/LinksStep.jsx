import { useResume } from "../../context/ResumeContext";

const LINK_TYPES = ["LinkedIn", "GitHub", "Portfolio", "Other"];

function isValidUrl(url) {
  if (!url) return true;
  return /^https:\/\/.+/.test(url);
}

export default function LinksStep() {
  const { state, dispatch, ACTIONS } = useResume();
  const links = state.links || [];

  return (
    <>
      <h2 className="step-title">Links & Portfolios</h2>
      <p className="step-subtitle">
        Add links to your professional profiles and work — each on its own row.
      </p>

      {links.length === 0 && (
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
            No links added yet. Click "+ Add Link" below to add LinkedIn, GitHub, or Portfolio.
          </p>
        </div>
      )}

      {links.map((link) => {
        const hasUrl = Boolean(link.url && link.url.trim().length > 0);
        const valid = isValidUrl(link.url);

        return (
          <div key={link.id} className="flex gap-2.5 mb-3 items-start">
            <select
              className="form-input"
              style={{ width: "130px", flexShrink: 0 }}
              value={link.type}
              onChange={(e) =>
                dispatch({
                  type: ACTIONS.UPDATE_LINK,
                  payload: { id: link.id, data: { type: e.target.value } },
                })
              }
            >
              {LINK_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <div className="flex-1">
              <input
                type="url"
                className={`form-input ${hasUrl && !valid ? "error" : ""}`}
                autoComplete="off"
                placeholder="https://..."
                value={link.url}
                onChange={(e) =>
                  dispatch({
                    type: ACTIONS.UPDATE_LINK,
                    payload: { id: link.id, data: { url: e.target.value } },
                  })
                }
              />
              {hasUrl && !valid && (
                <p className="form-error">URL must start with https://</p>
              )}
            </div>

            <button
              type="button"
              className="btn btn-danger-sm"
              style={{ marginTop: "4px" }}
              title="Remove link"
              onClick={() =>
                dispatch({ type: ACTIONS.REMOVE_LINK, payload: link.id })
              }
            >
              ✕
            </button>
          </div>
        );
      })}

      <button
        type="button"
        className="btn btn-ghost w-full"
        onClick={() => dispatch({ type: ACTIONS.ADD_LINK })}
      >
        + Add Link
      </button>
    </>
  );
}
