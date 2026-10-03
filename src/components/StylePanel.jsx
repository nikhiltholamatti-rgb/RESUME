import { useState } from "react";
import { useResume } from "../context/ResumeContext";
import { PRIMARY_FONTS } from "../data/fonts";
import {
  Palette,
  Type,
  Minimize2,
  Maximize2,
  Check,
  Sparkles,
  Sliders,
  AlignLeft,
  Divide,
  Eye,
} from "lucide-react";

export const PRESET_COLORS = [
  { name: "Blue", hex: "#2563eb" },
  { name: "Indigo", hex: "#6366f1" },
  { name: "Purple", hex: "#8b5cf6" },
  { name: "Teal", hex: "#0d9488" },
  { name: "Green", hex: "#10b981" },
  { name: "Orange", hex: "#f97316" },
  { name: "Red", hex: "#ef4444" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Slate", hex: "#475569" },
  { name: "Black", hex: "#111111" },
];

export default function StylePanel({ className = "" }) {
  const { state, dispatch, ACTIONS } = useResume();
  const style = state.style || {};

  const currentAccent = style.accentColor || state.accentColor || "#6366f1";
  const currentFont = style.fontFamily || state.fontFamily || "inter";
  const currentFontSize = style.fontSize || state.fontSize || "medium";
  const currentSpacing = style.spacing || state.spacing || "normal";
  const currentHeadingStyle = style.headingStyle || "uppercase";
  const currentShowDividers = style.showDividers !== false;

  const [hexInput, setHexInput] = useState(currentAccent);

  const handleColorChange = (hex) => {
    setHexInput(hex);
    dispatch({ type: ACTIONS.SET_ACCENT_COLOR, payload: hex });
  };

  const handleHexInputChange = (e) => {
    const val = e.target.value;
    setHexInput(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      dispatch({ type: ACTIONS.SET_ACCENT_COLOR, payload: val });
    }
  };

  return (
    <div className={`space-y-5 text-left ${className}`}>
      {/* 1. ACCENT COLOR SECTION */}
      <div className="bg-[var(--bg-glass-strong)] p-4 sm:p-5 rounded-xl border border-[var(--border-glass)] shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <label className="text-sm font-bold text-white flex items-center gap-2">
            <Palette size={16} className="text-[var(--accent-light)]" />
            <span>Accent Color</span>
          </label>

          {/* Hex Input & Color Picker */}
          <div className="flex items-center gap-2">
            {/* Custom Color Input Dot */}
            <label
              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform overflow-hidden relative shadow-sm"
              title="Pick custom color"
              style={{ backgroundColor: currentAccent }}
            >
              <input
                type="color"
                className="opacity-0 w-0 h-0 absolute cursor-pointer"
                value={currentAccent}
                onChange={(e) => handleColorChange(e.target.value)}
              />
              <Sparkles size={12} className="text-white drop-shadow pointer-events-none" />
            </label>

            {/* Direct Hex Input */}
            <div className="relative">
              <input
                type="text"
                value={hexInput}
                maxLength={7}
                placeholder="#6366f1"
                onChange={handleHexInputChange}
                onBlur={() => setHexInput(currentAccent)}
                className="w-24 px-2 py-1 rounded bg-[var(--bg-input)] border border-[var(--border-glass)] text-xs font-mono text-white focus:outline-none focus:border-[var(--accent)] text-center uppercase"
              />
            </div>
          </div>
        </div>

        <p className="text-xs text-[var(--text-muted)] mb-3">
          Applied to name, section titles, dividers, icons, and links across all templates.
        </p>

        {/* 10 Preset Color Swatches (each >= 40px) */}
        <div className="flex flex-wrap gap-2.5 sm:gap-3 items-center">
          {PRESET_COLORS.map((swatch) => {
            const isSelected =
              currentAccent.toLowerCase() === swatch.hex.toLowerCase();
            return (
              <button
                key={swatch.name}
                type="button"
                onClick={() => handleColorChange(swatch.hex)}
                style={{ backgroundColor: swatch.hex }}
                title={`${swatch.name} (${swatch.hex})`}
                className={`min-w-[42px] min-h-[42px] w-11 h-11 rounded-full cursor-pointer flex items-center justify-center transition-all shadow-md active:scale-95 relative ${
                  isSelected
                    ? "ring-4 ring-white/40 ring-offset-2 ring-offset-[#0a0a1a] scale-105 z-10"
                    : "hover:scale-105 border border-white/20"
                }`}
                aria-label={`Select ${swatch.name} color`}
              >
                {isSelected && (
                  <Check
                    size={18}
                    className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                    strokeWidth={3}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. FONT STYLE & FAMILY SECTION */}
      <div className="bg-[var(--bg-glass-strong)] p-4 sm:p-5 rounded-xl border border-[var(--border-glass)] shadow-md">
        <label className="text-sm font-bold text-white flex items-center gap-2 mb-1.5">
          <Type size={16} className="text-[var(--accent-light)]" />
          <span>Font Style</span>
        </label>
        <p className="text-xs text-[var(--text-muted)] mb-3">
          Select typography for your resume. Each option is previewed in its own typeface.
        </p>

        {/* 6 Font Cards previewed in their own font */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {PRIMARY_FONTS.map((f) => {
            const isSelected = currentFont === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() =>
                  dispatch({ type: ACTIONS.SET_FONT_FAMILY, payload: f.id })
                }
                style={{ fontFamily: f.stack }}
                className={`p-3 rounded-lg text-left transition-all cursor-pointer border flex items-center justify-between min-h-[46px] ${
                  isSelected
                    ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-md"
                    : "bg-white/[0.03] text-[var(--text-primary)] border-white/5 hover:bg-white/10"
                }`}
              >
                <div>
                  <div className="text-sm font-bold leading-tight">
                    {f.name}
                  </div>
                  <div
                    className={`text-[11px] opacity-75 mt-0.5 ${
                      isSelected ? "text-white/90" : "text-[var(--text-muted)]"
                    }`}
                  >
                    {f.sample}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-white/5 text-[var(--text-muted)]"
                    }`}
                  >
                    {f.badge}
                  </span>
                  {isSelected && (
                    <Check size={16} className="text-white shrink-0" strokeWidth={2.5} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3 & 4. FONT SIZE & SPACING DUAL ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Font Size */}
        <div className="bg-[var(--bg-glass-strong)] p-4 rounded-xl border border-[var(--border-glass)]">
          <label className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
            <Minimize2 size={14} className="text-[var(--accent-light)]" />
            <span>Font Size</span>
          </label>
          <p className="text-[11px] text-[var(--text-muted)] mb-2.5">
            Scales overall body and headings text.
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: "small", label: "Small", sub: "92%" },
              { id: "medium", label: "Medium", sub: "100%" },
              { id: "large", label: "Large", sub: "108%" },
            ].map((sz) => {
              const isSelected = currentFontSize === sz.id;
              return (
                <button
                  key={sz.id}
                  type="button"
                  onClick={() =>
                    dispatch({ type: ACTIONS.SET_FONT_SIZE, payload: sz.id })
                  }
                  className={`py-2 px-1 rounded-lg text-xs font-semibold flex flex-col items-center justify-center transition-all cursor-pointer min-h-[42px] border ${
                    isSelected
                      ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm"
                      : "bg-white/5 text-[var(--text-secondary)] border-white/5 hover:text-white"
                  }`}
                >
                  <span>{sz.label}</span>
                  <span className="text-[9px] opacity-75 font-mono">{sz.sub}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Spacing / Line Height */}
        <div className="bg-[var(--bg-glass-strong)] p-4 rounded-xl border border-[var(--border-glass)]">
          <label className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
            <Maximize2 size={14} className="text-[var(--accent-light)]" />
            <span>Spacing / Line Height</span>
          </label>
          <p className="text-[11px] text-[var(--text-muted)] mb-2.5">
            Controls section gaps & vertical rhythm.
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: "compact", label: "Compact", sub: "Tight" },
              { id: "normal", label: "Normal", sub: "Balanced" },
              { id: "relaxed", label: "Relaxed", sub: "Airy" },
            ].map((sp) => {
              const isSelected = currentSpacing === sp.id;
              return (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() =>
                    dispatch({ type: ACTIONS.SET_SPACING, payload: sp.id })
                  }
                  className={`py-2 px-1 rounded-lg text-xs font-semibold flex flex-col items-center justify-center transition-all cursor-pointer min-h-[42px] border ${
                    isSelected
                      ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm"
                      : "bg-white/5 text-[var(--text-secondary)] border-white/5 hover:text-white"
                  }`}
                >
                  <span>{sp.label}</span>
                  <span className="text-[9px] opacity-75 font-mono">{sp.sub}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. OPTIONAL: HEADING STYLE & SECTION DIVIDERS */}
      <div className="bg-[var(--bg-glass-strong)] p-4 sm:p-5 rounded-xl border border-[var(--border-glass)] shadow-md">
        <label className="text-sm font-bold text-white flex items-center gap-2 mb-1.5">
          <Sliders size={16} className="text-[var(--accent-light)]" />
          <span>Heading Style & Dividers</span>
        </label>
        <p className="text-xs text-[var(--text-muted)] mb-3">
          Fine-tune title casing and colored visual separator lines.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Heading Style Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
            <div>
              <span className="text-xs font-bold text-white block">Heading Case</span>
              <span className="text-[10px] text-[var(--text-muted)]">
                {currentHeadingStyle === "uppercase" ? "UPPERCASE HEADINGS" : "Normal Title Case"}
              </span>
            </div>
            <div className="flex rounded-md bg-white/5 p-0.5 border border-white/10">
              <button
                type="button"
                onClick={() =>
                  dispatch({ type: ACTIONS.SET_HEADING_STYLE, payload: "uppercase" })
                }
                className={`px-2.5 py-1 text-xs rounded transition-all ${
                  currentHeadingStyle === "uppercase"
                    ? "bg-[var(--accent)] text-white font-bold shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-white"
                }`}
              >
                ABC
              </button>
              <button
                type="button"
                onClick={() =>
                  dispatch({ type: ACTIONS.SET_HEADING_STYLE, payload: "normal" })
                }
                className={`px-2.5 py-1 text-xs rounded transition-all ${
                  currentHeadingStyle === "normal"
                    ? "bg-[var(--accent)] text-white font-bold shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-white"
                }`}
              >
                Abc
              </button>
            </div>
          </div>

          {/* Section Dividers Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
            <div>
              <span className="text-xs font-bold text-white block">Colored Dividers</span>
              <span className="text-[10px] text-[var(--text-muted)]">
                {currentShowDividers ? "Lines active under titles" : "Hidden (clean look)"}
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                dispatch({
                  type: ACTIONS.SET_SHOW_DIVIDERS,
                  payload: !currentShowDividers,
                })
              }
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer flex items-center p-0.5 ${
                currentShowDividers ? "bg-[var(--accent)]" : "bg-white/10"
              }`}
              aria-label="Toggle section dividers"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  currentShowDividers ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
