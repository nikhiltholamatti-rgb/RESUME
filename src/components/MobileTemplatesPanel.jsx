import { useRef, useState, useEffect } from "react";
import { useResume } from "../context/ResumeContext";
import { TEMPLATES } from "./templates/templateData";
import TemplateRenderer from "./templates/TemplateRenderer";
import { Check, Sparkles } from "lucide-react";

function ScaledThumbnail({ templateId, data, accentColor }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.24);

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
    <div
      ref={containerRef}
      className="w-full aspect-[210/297] overflow-hidden bg-white relative rounded-t-lg select-none pointer-events-none"
    >
      <div
        className="w-[794px] min-h-[1123px] origin-top-left"
        style={{ transform: `scale(${scale})` }}
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

export default function MobileTemplatesPanel({ onSelectTemplate }) {
  const { state, dispatch, ACTIONS } = useResume();
  const selectedTpl = state.selectedTemplate || "classic";
  const accentColor = state.accentColor || "#6366f1";

  // Build live preview data from user state with fallback
  const previewData = {
    personalInfo: {
      fullName: state.personalInfo?.fullName?.trim() || "Your Name",
      headline: state.personalInfo?.headline?.trim() || "Full-Stack Engineer",
      email: state.personalInfo?.email?.trim() || "alex@example.com",
      phone: state.personalInfo?.phone?.trim() || "+1 (555) 234-5678",
      city: state.personalInfo?.city?.trim() || "San Francisco, CA",
    },
    links: state.links || [],
    summary: state.summary || "",
    education: state.education || [],
    skills: state.skills || {},
    projects: state.projects || [],
    experience: state.experience || [],
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

  const handleSelect = (tplId) => {
    dispatch({ type: ACTIONS.SET_TEMPLATE, payload: tplId });
    if (onSelectTemplate) {
      onSelectTemplate(tplId);
    }
  };

  return (
    <div className="w-full">
      {/* 2-column grid on screens >= 360px, 1-column below 360px */}
      <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-3.5">
        {TEMPLATES.map((tpl) => {
          const isSelected = selectedTpl === tpl.id;
          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => handleSelect(tpl.id)}
              className={`group relative text-left rounded-xl transition-all overflow-hidden flex flex-col bg-[var(--bg-glass-strong)] border-2 cursor-pointer shadow-lg active:scale-98 ${
                isSelected
                  ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/40 shadow-[0_0_20px_var(--accent-glow)]"
                  : "border-[var(--border-glass)] hover:border-white/20"
              }`}
              style={{
                borderColor: isSelected ? accentColor : undefined,
              }}
            >
              {/* Checkmark Icon badge on selected */}
              {isSelected && (
                <div
                  className="absolute top-2 right-2 z-20 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-lg animate-scaleIn"
                  style={{ backgroundColor: accentColor }}
                >
                  <Check size={14} strokeWidth={3} />
                </div>
              )}

              {/* Template Thumbnail with live user data */}
              <ScaledThumbnail
                templateId={tpl.id}
                data={previewData}
                accentColor={accentColor}
              />

              {/* Card Label */}
              <div className="p-2.5 sm:p-3 flex items-center justify-between gap-1 w-full bg-[var(--bg-app)]/90 border-t border-[var(--border-glass)]">
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                    <span>{tpl.name}</span>
                    {isSelected && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] truncate">
                    {tpl.desc}
                  </div>
                </div>
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-white/5 text-[var(--text-secondary)] border border-white/10 shrink-0">
                  {tpl.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
