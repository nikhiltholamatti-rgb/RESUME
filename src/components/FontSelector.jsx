import { useResume } from "../context/ResumeContext";
import { FONT_OPTIONS } from "../data/fonts";
import { Type } from "lucide-react";

export default function FontSelector({ className = "" }) {
  const { state, dispatch, ACTIONS } = useResume();
  const currentFont = state.fontFamily || "inter";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5 whitespace-nowrap">
        <Type size={14} className="text-[var(--accent-light)]" />
        Font:
      </span>
      <select
        value={currentFont}
        onChange={(e) => dispatch({ type: ACTIONS.SET_FONT_FAMILY, payload: e.target.value })}
        className="form-input !py-1 !px-2.5 !text-xs !w-auto cursor-pointer bg-[var(--bg-glass-strong)] border-[var(--border-glass)] text-[var(--text-primary)] rounded-[var(--radius-xs)] outline-none focus:border-[var(--accent)]"
        title="Choose typography for your resume"
      >
        {FONT_OPTIONS.map((group) => (
          <optgroup key={group.category} label={group.category} className="bg-[#0f1026] text-gray-300 font-sans font-semibold">
            {group.fonts.map((f) => (
              <option
                key={f.id}
                value={f.id}
                style={{ fontFamily: f.stack }}
                className="bg-[#0f1026] text-white py-1"
              >
                {f.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
