import { useRef, useState, useEffect } from "react";
import { useResume } from "../context/ResumeContext";
import { TEMPLATES } from "./templates/templateData";
import TemplateRenderer from "./templates/TemplateRenderer";
import TiltCard from "./TiltCard";
import FontSelector from "./FontSelector";
import StylePanel from "./StylePanel";
import { Check } from "lucide-react";

const ACCENT_SWATCHES = [
  { name: "Electric Indigo", hex: "#6366f1" },
  { name: "Cyber Cyan", hex: "#06b6d4" },
  { name: "Emerald Glow", hex: "#10b981" },
  { name: "Amber Flare", hex: "#f59e0b" },
  { name: "Neon Pink", hex: "#ec4899" },
  { name: "Royal Violet", hex: "#8b5cf6" },
  { name: "Deep Navy", hex: "#1e3a5f" },
  { name: "Slate Noir", hex: "#1e293b" },
];

function MiniPreview({ templateId, data, accentColor }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.28);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setScale(entry.contentRect.width / 794);
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="tpl-card-preview">
      <div
        className="tpl-card-preview-inner"
        style={{
          transform: `scale(${scale})`,
        }}
      >
        <TemplateRenderer
          templateId={templateId}
          data={data}
          accentColor={accentColor}
        />
      </div>
    </div>
  );
}

export default function TemplateGallery() {
  const { state, dispatch, ACTIONS } = useResume();
  const selectedTpl = state.selectedTemplate || "classic";
  const accentColor = state.accentColor || "#6366f1";

  // Build live preview data from user state with fallback for empty fields
  const previewData = {
    personalInfo: {
      fullName: state.personalInfo?.fullName?.trim() || "Your Name",
      headline: state.personalInfo?.headline?.trim() || "Full-Stack Engineer",
      email: state.personalInfo?.email?.trim() || "alex@example.com",
      phone: state.personalInfo?.phone?.trim() || "+1 (555) 234-5678",
      city: state.personalInfo?.city?.trim() || "San Francisco, CA",
    },
    links:
      state.links?.length > 0
        ? state.links
        : [
            { id: "p-lnk-1", type: "LinkedIn", url: "https://linkedin.com" },
            { id: "p-lnk-2", type: "GitHub", url: "https://github.com" },
          ],
    summary:
      state.summary?.trim() ||
      "Innovative software engineer specialized in building resilient web applications, modern interfaces, and cloud architectures.",
    education:
      state.education?.length > 0
        ? state.education
        : [
            {
              id: "p-edu-1",
              college: "Stanford University",
              degree: "B.S.",
              branch: "Computer Science",
              startYear: "2019",
              endYear: "2023",
              cgpa: "3.9",
            },
          ],
    skills: Object.values(state.skills || {}).some((arr) => arr.length > 0)
      ? state.skills
      : {
          languages: ["TypeScript", "Python", "Go"],
          web: ["React", "Next.js", "Tailwind CSS"],
          databases: ["PostgreSQL", "Redis"],
          tools: ["Docker", "AWS", "Git"],
        },
    projects:
      state.projects?.length > 0
        ? state.projects
        : [
            {
              id: "p-prj-1",
              name: "Real-Time Telemetry System",
              techStack: "React, Node.js, WebSockets",
              liveLink: "https://demo.dev",
              githubLink: "https://github.com",
              bullets: [
                "Engineered streaming pipeline processing 10,000 events/sec with sub-50ms latency.",
              ],
            },
          ],
    experience:
      state.experience?.length > 0
        ? state.experience
        : [
            {
              id: "p-exp-1",
              company: "Apex Technologies",
              role: "Software Engineer",
              duration: "2022 – Present",
              bullets: [
                "Spearheaded design system migration cutting time-to-market for new features by 40%.",
              ],
            },
          ],
    achievements: state.achievements || [],
    certifications: state.certifications || [],
    leadership: state.leadership || [],
    opensource: state.opensource || [],
    publications: state.publications || [],
    languages: state.languages || [],
    interests: state.interests || [],
    custom: state.custom || [],
    coursework: state.coursework || [],
    testScores: state.testScores || [],
    activeOptional: state.activeOptional || [],
    fontFamily: state.fontFamily,
    fontSize: state.fontSize,
    spacing: state.spacing,
    style: state.style,
    photo: state.photo,
    showPhoto: state.showPhoto,
    photoShape: state.photoShape || "circle",
  };

  return (
    <div className="glass step-card flex flex-col h-full overflow-y-auto">
      {/* Header, Font Selector and Color Picker */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-[var(--border-glass)]">
        <div>
          <h2 className="text-lg font-bold text-white">
            Choose a Template & Style
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Select your layout and customize typography, accent color, and spacing below.
          </p>
        </div>

        {/* Toolbar: Font Selector, Font Size, Spacing & Accent Color */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Font Selector */}
          <div className="bg-[var(--bg-glass-strong)] p-1.5 px-2 rounded-[var(--radius-xs)] border border-[var(--border-glass)]">
            <FontSelector />
          </div>

          {/* Font Size Selector */}
          <div className="flex items-center gap-1.5 bg-[var(--bg-glass-strong)] p-1.5 px-2 rounded-[var(--radius-xs)] border border-[var(--border-glass)]">
            <span className="text-xs font-semibold text-[var(--text-secondary)]">Size:</span>
            <select
              value={state.fontSize || "medium"}
              onChange={(e) => dispatch({ type: ACTIONS.SET_FONT_SIZE, payload: e.target.value })}
              className="bg-transparent text-xs text-[var(--text-primary)] outline-none cursor-pointer"
            >
              <option value="small" className="bg-[#0f1026] text-white">Compact</option>
              <option value="medium" className="bg-[#0f1026] text-white">Medium</option>
              <option value="large" className="bg-[#0f1026] text-white">Spacious</option>
            </select>
          </div>

          {/* Spacing Selector */}
          <div className="flex items-center gap-1.5 bg-[var(--bg-glass-strong)] p-1.5 px-2 rounded-[var(--radius-xs)] border border-[var(--border-glass)]">
            <span className="text-xs font-semibold text-[var(--text-secondary)]">Spacing:</span>
            <select
              value={state.spacing || "normal"}
              onChange={(e) => dispatch({ type: ACTIONS.SET_SPACING, payload: e.target.value })}
              className="bg-transparent text-xs text-[var(--text-primary)] outline-none cursor-pointer"
            >
              <option value="compact" className="bg-[#0f1026] text-white">Tight</option>
              <option value="normal" className="bg-[#0f1026] text-white">Normal</option>
              <option value="relaxed" className="bg-[#0f1026] text-white">Relaxed</option>
            </select>
          </div>

          {/* Accent Color Picker */}
          <div className="flex items-center gap-2 bg-[var(--bg-glass-strong)] p-1.5 px-2 rounded-[var(--radius-xs)] border border-[var(--border-glass)]">
            <span className="text-xs font-semibold text-[var(--text-secondary)]">
              Color:
            </span>
            <div className="color-swatches">
              {ACCENT_SWATCHES.map((swatch) => (
                <button
                  key={swatch.hex}
                  type="button"
                  className={`color-swatch !w-5 !h-5 ${accentColor.toLowerCase() === swatch.hex.toLowerCase() ? "active" : ""}`}
                  style={{ backgroundColor: swatch.hex }}
                  title={swatch.name}
                  onClick={() =>
                    dispatch({ type: ACTIONS.SET_ACCENT_COLOR, payload: swatch.hex })
                  }
                />
              ))}
              {/* Custom Color Input */}
              <label
                className="w-5 h-5 rounded-full border border-[var(--border-glass)] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform overflow-hidden"
                title="Custom Hex Color"
                style={{ background: accentColor }}
              >
                <input
                  type="color"
                  className="opacity-0 w-0 h-0 cursor-pointer"
                  value={accentColor}
                  onChange={(e) =>
                    dispatch({ type: ACTIONS.SET_ACCENT_COLOR, payload: e.target.value })
                  }
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Template Cards Grid */}
      <div className="template-grid">
        {TEMPLATES.map((tpl) => {
          const isSelected = selectedTpl === tpl.id;
          return (
            <TiltCard
              key={tpl.id}
              maxTilt={9}
              glow={isSelected}
              glowColor={accentColor}
              className={`tpl-card ${isSelected ? "selected" : ""}`}
              onClick={() => dispatch({ type: ACTIONS.SET_TEMPLATE, payload: tpl.id })}
              style={{
                borderColor: isSelected ? accentColor : undefined,
                boxShadow: isSelected
                  ? `0 0 20px ${accentColor}66, 0 0 40px ${accentColor}22`
                  : undefined,
              }}
            >
              {/* Selected Glow Badge with Check Icon */}
              {isSelected && (
                <div
                  className="flex items-center gap-1"
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    zIndex: 20,
                    backgroundColor: accentColor,
                    color: "#fff",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: "100px",
                    boxShadow: `0 0 12px ${accentColor}`,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  <Check size={12} strokeWidth={3} />
                  <span>Active</span>
                </div>
              )}

              {/* Scaled Live Mini-Preview */}
              <MiniPreview
                templateId={tpl.id}
                data={previewData}
                accentColor={accentColor}
              />

              {/* Label & Details */}
              <div className="tpl-card-label">
                <div>
                  <div className="tpl-card-name">{tpl.name}</div>
                  <div className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5">
                    {tpl.desc}
                  </div>
                </div>
                <span className="tpl-card-badge">{tpl.badge}</span>
              </div>
            </TiltCard>
          );
        })}
      </div>

      {/* Style & Typography Panel */}
      <div className="mt-8 pt-6 border-t border-[var(--border-glass)]">
        <div className="mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Style & Customization</span>
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Personalize accent palette, typography, scale, line spacing, and section dividers.
          </p>
        </div>
        <StylePanel />
      </div>
    </div>
  );
}
