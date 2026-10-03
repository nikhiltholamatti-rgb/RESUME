import { useState } from "react";
import { useResume } from "../../context/ResumeContext";
import PhotoUploader from "../PhotoUploader";
import { Plus } from "lucide-react";

const LINK_TYPES = ["LinkedIn", "GitHub", "Portfolio", "Other"];

function isValidUrl(url) {
  if (!url) return true;
  return /^https:\/\/.+/.test(url);
}

export default function PersonalStep() {
  const { state, dispatch, ACTIONS } = useResume();
  const info = state.personalInfo;
  const links = state.links || [];
  const [touched, setTouched] = useState({});

  const update = (f, v) =>
    dispatch({ type: ACTIONS.UPDATE_PERSONAL, payload: { [f]: v } });

  const isEmailValid = !info.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email);

  return (
    <div className="space-y-5">
      {/* Optional Profile Photo Uploader & Cropper */}
      <PhotoUploader />

      {/* Basic Contact Info Card */}
      <div className="p-5 rounded-[var(--radius-xs)] bg-[var(--bg-glass)] border border-[var(--border-glass)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-white/90 mb-2" htmlFor="fullName">
              Full Name *
            </label>
            <input
              id="fullName"
              type="text"
              className={`form-input ${touched.fullName && !info.fullName.trim() ? "error" : ""}`}
              placeholder="e.g. Alex Morgan"
              value={info.fullName}
              onBlur={() => setTouched((p) => ({ ...p, fullName: true }))}
              onChange={(e) => update("fullName", e.target.value)}
            />
            {touched.fullName && !info.fullName.trim() && (
              <p className="form-error">Full name is required.</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-white/90 mb-2">Headline / Job Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Senior Full-Stack Engineer | Distributed Systems"
              value={info.headline}
              onChange={(e) => update("headline", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/90 mb-2" htmlFor="email">
              Email *
            </label>
            <input
              id="email"
              type="email"
              className={`form-input ${touched.email && (!info.email.trim() || !isEmailValid) ? "error" : ""}`}
              placeholder="e.g. alex.morgan@email.com"
              value={info.email}
              onBlur={() => setTouched((p) => ({ ...p, email: true }))}
              onChange={(e) => update("email", e.target.value)}
            />
            {touched.email && !info.email.trim() && (
              <p className="form-error">Email address is required.</p>
            )}
            {touched.email && info.email.trim() && !isEmailValid && (
              <p className="form-error">Please enter a valid email address.</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/90 mb-2">Phone</label>
            <input
              type="tel"
              className="form-input"
              placeholder="e.g. +1 (555) 234-5678"
              value={info.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-white/90 mb-2">City, Country</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. San Francisco, CA"
              value={info.city}
              onChange={(e) => update("city", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Professional Links Card */}
      <div className="p-5 rounded-[var(--radius-xs)] bg-[var(--bg-glass)] border border-[var(--border-glass)]">
        <label className="block text-xs font-semibold text-white/90 mb-2">
          Websites & Professional Profiles
        </label>
        <p className="text-xs text-[var(--text-muted)] mb-3">
          Add links to your LinkedIn, GitHub, portfolio, or personal website.
        </p>

        {links.map((link) => {
          const hasUrl = Boolean(link.url && link.url.trim().length > 0);
          const valid = isValidUrl(link.url);

          return (
            <div key={link.id} className="flex gap-2.5 mb-3 items-start">
              <select
                className="form-input !w-32 shrink-0 cursor-pointer text-xs"
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
                  className={`form-input text-xs ${hasUrl && !valid ? "error" : ""}`}
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
                className="btn btn-danger-sm !py-2 text-xs"
                title="Remove link"
                onClick={() => dispatch({ type: ACTIONS.REMOVE_LINK, payload: link.id })}
              >
                ✕
              </button>
            </div>
          );
        })}

        <button
          type="button"
          className="w-full py-2.5 mt-2 border-2 border-dashed border-white/20 hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 text-xs font-semibold rounded-lg text-[var(--accent-light)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          onClick={() => dispatch({ type: ACTIONS.ADD_LINK })}
        >
          <Plus size={14} /> Add Profile Link
        </button>
      </div>
    </div>
  );
}
