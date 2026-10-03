import { useRef, useState, useEffect } from "react";
import { useResume } from "../context/ResumeContext";
import TemplateRenderer from "./templates/TemplateRenderer";
import { Download, Sparkles, FileText, CheckCircle2 } from "lucide-react";

export default function MobilePreview({ onDownload }) {
  const { state } = useResume();
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.42);

  // Measure container and dynamically scale 794px A4 sheet to fit exactly with zero horizontal overflow
  useEffect(() => {
    if (!containerRef.current) return;

    const updateScale = () => {
      if (containerRef.current) {
        const availableWidth = containerRef.current.clientWidth;
        if (availableWidth > 0) {
          // Keep a small 8px margin so borders don't touch screen edges
          const targetWidth = Math.max(availableWidth - 16, 260);
          const computedScale = targetWidth / 794;
          setScale(computedScale);
        }
      }
    };

    updateScale();

    const observer = new ResizeObserver(() => {
      updateScale();
    });
    observer.observe(containerRef.current);
    window.addEventListener("resize", updateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, []);

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

  const a4Height = 1123;
  const scaledHeight = Math.round(a4Height * scale);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Action Bar with Download Button */}
      <div className="w-full glass p-3.5 mb-4 rounded-xl border border-[var(--border-glass)] flex items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
            <FileText size={16} />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-white truncate">
              Live Preview
            </h3>
            <p className="text-[10px] text-[var(--text-muted)] truncate capitalize">
              {state.selectedTemplate || "classic"} • {state.pageSize?.toUpperCase() || "A4"}
            </p>
          </div>
        </div>

        {/* Download / Export Button */}
        <button
          type="button"
          onClick={onDownload}
          className="btn btn-neon !py-2.5 !px-4 min-h-[44px] text-xs font-semibold flex items-center gap-2 shadow-lg shrink-0 cursor-pointer active:scale-95 transition-all"
        >
          <Download size={15} />
          <span>Download PDF</span>
        </button>
      </div>

      {/* Live Resume Document: dynamically scaled, zero horizontal scroll */}
      <div
        ref={containerRef}
        className="w-full flex flex-col items-center justify-start overflow-hidden px-1"
      >
        <div
          className="relative overflow-hidden flex justify-center"
          style={{
            width: "100%",
            height: `${scaledHeight + 16}px`,
          }}
        >
          <div
            className="origin-top shadow-2xl rounded-sm transition-transform duration-150"
            style={{
              width: "794px",
              minHeight: `${a4Height}px`,
              transform: `scale(${scale})`,
              transformOrigin: "top center",
              backgroundColor: "#ffffff",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.6)",
              pointerEvents: "none",
            }}
          >
            <TemplateRenderer
              templateId={state.selectedTemplate}
              data={previewData}
              accentColor={state.accentColor}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
