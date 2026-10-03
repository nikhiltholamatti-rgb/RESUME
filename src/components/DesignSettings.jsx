import { useResume } from "../context/ResumeContext";
import { FONT_OPTIONS } from "../data/fonts";
import {
  Palette,
  Type,
  Maximize2,
  Minimize2,
  FileText,
  Image,
  Check,
  Sparkles,
} from "lucide-react";

export const ACCENT_SWATCHES = [
  { name: "Electric Indigo", hex: "#6366f1" },
  { name: "Cyber Cyan", hex: "#06b6d4" },
  { name: "Emerald Glow", hex: "#10b981" },
  { name: "Amber Flare", hex: "#f59e0b" },
  { name: "Neon Pink", hex: "#ec4899" },
  { name: "Royal Violet", hex: "#8b5cf6" },
  { name: "Deep Navy", hex: "#1e3a5f" },
  { name: "Slate Noir", hex: "#1e293b" },
];

export default function DesignSettings({ className = "" }) {
  const { state, dispatch, ACTIONS } = useResume();
  const accentColor = state.accentColor || "#6366f1";
  const currentFont = state.fontFamily || "inter";
  const currentFontSize = state.fontSize || "medium";
  const currentSpacing = state.spacing || "normal";
  const currentPageSize = state.pageSize || "a4";
  const currentPhotoShape = state.photoShape || "circle";

  return (
    <div className={`space-y-6 text-left ${className}`}>
      {/* 1. ACCENT COLOR SECTION */}
      <div className="bg-[var(--bg-glass-strong)] p-4 sm:p-5 rounded-xl border border-[var(--border-glass)]">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-bold text-white flex items-center gap-2">
            <Palette size={16} className="text-[var(--accent-light)]" />
            <span>Theme Accent Color</span>
          </label>
          <span className="text-xs font-mono text-[var(--text-muted)] uppercase">
            {accentColor}
          </span>
        </div>
        <p className="text-xs text-[var(--text-muted)] mb-3">
          Applies highlight colors to headers, borders, bullets, and accents.
        </p>

        {/* Swatches wrapping onto multiple rows with min 44px tap targets */}
        <div className="flex flex-wrap gap-3 items-center">
          {ACCENT_SWATCHES.map((swatch) => {
            const isSelected =
              accentColor.toLowerCase() === swatch.hex.toLowerCase();
            return (
              <button
                key={swatch.hex}
                type="button"
                onClick={() =>
                  dispatch({
                    type: ACTIONS.SET_ACCENT_COLOR,
                    payload: swatch.hex,
                  })
                }
                style={{ backgroundColor: swatch.hex }}
                title={swatch.name}
                className={`min-w-[44px] min-h-[44px] w-11 h-11 sm:w-12 sm:h-12 rounded-full cursor-pointer flex items-center justify-center transition-all shadow-md active:scale-95 ${
                  isSelected
                    ? "ring-4 ring-white/40 ring-offset-2 ring-offset-[#0a0a1a] scale-105"
                    : "hover:scale-105 border border-white/20"
                }`}
                aria-label={`Select ${swatch.name}`}
              >
                {isSelected && (
                  <Check
                    size={20}
                    className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                    strokeWidth={3}
                  />
                )}
              </button>
            );
          })}

          {/* Custom Hex Color Picker */}
          <label
            className="min-w-[44px] min-h-[44px] w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center cursor-pointer hover:border-white hover:scale-105 transition-all overflow-hidden relative shadow-md"
            title="Choose custom color"
            style={{ backgroundColor: accentColor }}
          >
            <input
              type="color"
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              value={accentColor}
              onChange={(e) =>
                dispatch({
                  type: ACTIONS.SET_ACCENT_COLOR,
                  payload: e.target.value,
                })
              }
            />
            <Sparkles size={16} className="text-white drop-shadow pointer-events-none" />
          </label>
        </div>
      </div>

      {/* 2. FONT STYLE & FAMILY SECTION */}
      <div className="bg-[var(--bg-glass-strong)] p-4 sm:p-5 rounded-xl border border-[var(--border-glass)]">
        <label className="text-sm font-bold text-white flex items-center gap-2 mb-1.5">
          <Type size={16} className="text-[var(--accent-light)]" />
          <span>Font Style & Typography</span>
        </label>
        <p className="text-xs text-[var(--text-muted)] mb-3">
          Select ATS-optimized typography tailored for corporate or modern tech roles.
        </p>

        <div className="relative">
          <select
            value={currentFont}
            onChange={(e) =>
              dispatch({
                type: ACTIONS.SET_FONT_FAMILY,
                payload: e.target.value,
              })
            }
            className="w-full min-h-[48px] px-3.5 py-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-glass)] text-white text-base focus:border-[var(--accent)] focus:outline-none cursor-pointer"
          >
            {FONT_OPTIONS.map((group) => (
              <optgroup
                key={group.category}
                label={group.category}
                className="bg-[#0f1026] text-gray-300 font-semibold"
              >
                {group.fonts.map((f) => (
                  <option
                    key={f.id}
                    value={f.id}
                    style={{ fontFamily: f.stack }}
                    className="bg-[#0f1026] text-white py-1.5"
                  >
                    {f.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      {/* 3. FONT SIZE SECTION */}
      <div className="bg-[var(--bg-glass-strong)] p-4 sm:p-5 rounded-xl border border-[var(--border-glass)]">
        <label className="text-sm font-bold text-white flex items-center gap-2 mb-1.5">
          <Minimize2 size={16} className="text-[var(--accent-light)]" />
          <span>Font Size Scale</span>
        </label>
        <p className="text-xs text-[var(--text-muted)] mb-3">
          Fit more experience on 1 page or increase readability.
        </p>

        <div className="grid grid-cols-3 gap-2.5">
          {[
            { id: "small", label: "Compact", sub: "92%" },
            { id: "medium", label: "Medium", sub: "100%" },
            { id: "large", label: "Spacious", sub: "108%" },
          ].map((item) => {
            const isSelected = currentFontSize === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  dispatch({ type: ACTIONS.SET_FONT_SIZE, payload: item.id })
                }
                className={`min-h-[44px] px-2 py-2 rounded-lg text-xs font-semibold flex flex-col items-center justify-center transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-md"
                    : "bg-white/5 text-[var(--text-secondary)] border-white/5 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>{item.label}</span>
                <span className="text-[10px] opacity-75 font-mono">
                  {item.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. LINE & SECTION SPACING SECTION */}
      <div className="bg-[var(--bg-glass-strong)] p-4 sm:p-5 rounded-xl border border-[var(--border-glass)]">
        <label className="text-sm font-bold text-white flex items-center gap-2 mb-1.5">
          <Maximize2 size={16} className="text-[var(--accent-light)]" />
          <span>Section & Line Spacing</span>
        </label>
        <p className="text-xs text-[var(--text-muted)] mb-3">
          Fine-tune white space balance across all sections.
        </p>

        <div className="grid grid-cols-3 gap-2.5">
          {[
            { id: "compact", label: "Tight", desc: "Dense fit" },
            { id: "normal", label: "Normal", desc: "Standard" },
            { id: "relaxed", label: "Relaxed", desc: "Spaced" },
          ].map((item) => {
            const isSelected = currentSpacing === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  dispatch({ type: ACTIONS.SET_SPACING, payload: item.id })
                }
                className={`min-h-[44px] px-2 py-2 rounded-lg text-xs font-semibold flex flex-col items-center justify-center transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-md"
                    : "bg-white/5 text-[var(--text-secondary)] border-white/5 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>{item.label}</span>
                <span className="text-[10px] opacity-75">{item.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. PAPER FORMAT SECTION */}
      <div className="bg-[var(--bg-glass-strong)] p-4 sm:p-5 rounded-xl border border-[var(--border-glass)]">
        <label className="text-sm font-bold text-white flex items-center gap-2 mb-1.5">
          <FileText size={16} className="text-[var(--accent-light)]" />
          <span>Paper Format</span>
        </label>
        <p className="text-xs text-[var(--text-muted)] mb-3">
          Choose standard international A4 or North American US Letter size.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {[
            {
              id: "a4",
              label: "A4 Standard",
              desc: "210 × 297 mm (Global / EU)",
            },
            {
              id: "letter",
              label: "US Letter",
              desc: "8.5 × 11 in (US & Canada)",
            },
          ].map((item) => {
            const isSelected = currentPageSize === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  dispatch({ type: ACTIONS.SET_PAGE_SIZE, payload: item.id })
                }
                className={`min-h-[48px] p-3 rounded-lg text-xs font-semibold text-left transition-all cursor-pointer border flex flex-col justify-center ${
                  isSelected
                    ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-md"
                    : "bg-white/5 text-[var(--text-secondary)] border-white/5 hover:text-white hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">{item.label}</span>
                  {isSelected && <Check size={14} className="text-white" />}
                </div>
                <span className="text-[10px] opacity-75 mt-0.5">
                  {item.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. PROFILE PHOTO SHAPE SECTION */}
      <div className="bg-[var(--bg-glass-strong)] p-4 sm:p-5 rounded-xl border border-[var(--border-glass)]">
        <label className="text-sm font-bold text-white flex items-center gap-2 mb-1.5">
          <Image size={16} className="text-[var(--accent-light)]" />
          <span>Profile Photo Shape</span>
        </label>
        <p className="text-xs text-[var(--text-muted)] mb-3">
          Sets how your avatar displays across supported templates.
        </p>

        <div className="grid grid-cols-3 gap-2.5">
          {[
            { id: "circle", label: "Circle" },
            { id: "rounded", label: "Rounded" },
            { id: "square", label: "Square" },
          ].map((item) => {
            const isSelected = currentPhotoShape === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  dispatch({
                    type: ACTIONS.SET_PHOTO_SHAPE,
                    payload: item.id,
                  })
                }
                className={`min-h-[44px] px-2 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-md"
                    : "bg-white/5 text-[var(--text-secondary)] border-white/5 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>{item.label}</span>
                {isSelected && <Check size={14} className="text-white" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
