import { useState } from "react";
import { useResume } from "../../context/ResumeContext";

const GROUPS = [
  { key: "languages", label: "Programming Languages", ph: "e.g. TypeScript, Python, Go (press Enter or comma)" },
  { key: "web", label: "Frameworks & Libraries", ph: "e.g. React, Next.js, Node.js, Tailwind CSS" },
  { key: "databases", label: "Databases & Storage", ph: "e.g. PostgreSQL, Redis, MongoDB, Supabase" },
  { key: "tools", label: "Tools & Cloud Platforms", ph: "e.g. Docker, AWS, Git, Kubernetes, Figma" },
];

function TagInput({ tags = [], onChange, placeholder }) {
  const [val, setVal] = useState("");

  function add() {
    const rawTokens = val.split(/[,\n]/);
    const newTags = rawTokens
      .map((t) => t.trim())
      .filter((t) => t.length > 0 && !tags.includes(t));

    if (newTags.length > 0) {
      onChange([...tags, ...newTags]);
    }
    setVal("");
  }

  return (
    <div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {tags.map((t, i) => (
            <span key={`${t}-${i}`} className="tag text-xs">
              {t}
              <button
                type="button"
                className="tag-remove ml-1 hover:text-white"
                title={`Remove ${t}`}
                onClick={() => onChange(tags.filter((_, j) => j !== i))}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <input
        type="text"
        className="form-input"
        placeholder={placeholder}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add();
          }
        }}
        onBlur={add}
      />
    </div>
  );
}

export default function SkillsStep() {
  const { state, dispatch, ACTIONS } = useResume();
  const skills = state.skills || {};

  return (
    <div id="skills" className="space-y-4">
      <div className="p-5 rounded-[var(--radius-xs)] bg-[var(--bg-glass)] border border-[var(--border-glass)] space-y-4">
        {GROUPS.map((g) => (
          <div key={g.key}>
            <label className="block text-xs font-semibold text-white/90 mb-2">{g.label}</label>
            <TagInput
              tags={skills[g.key] || []}
              placeholder={g.ph}
              onChange={(newTags) =>
                dispatch({
                  type: ACTIONS.SET_SKILLS,
                  payload: { [g.key]: newTags },
                })
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
