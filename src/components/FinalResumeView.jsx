import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useReactToPrint } from "react-to-print";
import { useResume } from "../context/ResumeContext";
import { useAuth } from "../context/AuthContext";
import TemplateRenderer from "./templates/TemplateRenderer";
import MagneticButton from "./MagneticButton";
import { TEMPLATES } from "./templates/templateData";
import FontSelector from "./FontSelector";
import { validateMandatoryResume } from "../utils/validation";
import { computePagination, PAGE_DIMENSIONS } from "../utils/paginationEngine";
import { Lock, LogIn, UserPlus, X } from "lucide-react";

export default function FinalResumeView({ onEditAgain, onValidationFailed }) {
  const { state, dispatch, ACTIONS } = useResume();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const printRef = useRef(null);
  const measurerRef = useRef(null);
  const [zoom, setZoom] = useState(() => {
    if (typeof window !== "undefined" && window.innerWidth < 850) {
      return Math.min(1, Math.max(0.36, (window.innerWidth - 24) / 794));
    }
    return 1;
  });
  const [isPrinting, setIsPrinting] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const pageSize = state.pageSize || "a4";
  const dimensions = PAGE_DIMENSIONS[pageSize] || PAGE_DIMENSIONS.a4;

  const [paginationResult, setPaginationResult] = useState({
    pages: [null],
    isLightContent: false,
    dimensions,
    pageCount: 1,
  });

  // Re-run pagination on any data / template / font / page-size change (debounced 150ms + fonts.ready)
  useEffect(() => {
    let isCancelled = false;

    const runPagination = async () => {
      try {
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }
      } catch (err) {
        // ignore font ready errors
      }

      if (isCancelled || !measurerRef.current) return;

      const result = computePagination(measurerRef.current, pageSize);
      if (!isCancelled) {
        setPaginationResult(result);
      }
    };

    const timer = setTimeout(runPagination, 150);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [state, pageSize]);

  const fileName = state.personalInfo.fullName
    ? `${state.personalInfo.fullName.replace(/\s+/g, "_")}_Resume`
    : "Resume";

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: fileName,
    onBeforePrint: async () => {
      setIsPrinting(true);
      if (printRef.current) {
        const images = Array.from(printRef.current.querySelectorAll("img"));
        await Promise.all(
          images.map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve;
            });
          })
        );
      }
    },
    onAfterPrint: () => setIsPrinting(false),
    pageStyle: `
      @page {
        size: ${pageSize === "letter" ? "letter" : "A4"} portrait;
        margin: 0;
      }
      @media print {
        ${
          !user
            ? `
          body, .resume-print-area, .resume-page-sheet, html {
            display: none !important;
            visibility: hidden !important;
          }
        `
            : `
          html, body {
            width: ${dimensions.width}px !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * {
            visibility: hidden !important;
          }
          .resume-print-area, .resume-print-area * {
            visibility: visible !important;
          }
          .resume-print-area {
            position: static !important;
            margin: 0 !important;
            padding: 0 !important;
            gap: 0 !important;
          }
          .page-number-pill {
            display: none !important;
          }
          .resume-page-sheet {
            width: ${dimensions.width}px !important;
            height: ${dimensions.height}px !important;
            min-height: ${dimensions.height}px !important;
            max-height: ${dimensions.height}px !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            page-break-after: always !important;
            break-after: page !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            overflow: hidden !important;
          }
          .resume-page-sheet:last-child {
            page-break-after: avoid !important;
            break-after: auto !important;
          }
        `
        }
      }
    `,
  });

  // Guard print shortcuts (Ctrl+P / Cmd+P), beforeprint, and right-click for guests
  useEffect(() => {
    if (user) return;

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "P")) {
        e.preventDefault();
        e.stopPropagation();
        localStorage.setItem("resume_guest_draft", JSON.stringify(state));
        navigate("/login?returnTo=download");
      }
    };

    const handleBeforePrint = (e) => {
      if (!user) {
        e.preventDefault();
        localStorage.setItem("resume_guest_draft", JSON.stringify(state));
        navigate("/login?returnTo=download");
      }
    };

    const handleContextMenu = (e) => {
      if (printRef.current && printRef.current.contains(e.target)) {
        e.preventDefault();
        localStorage.setItem("resume_guest_draft", JSON.stringify(state));
        setIsLoginModalOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("beforeprint", handleBeforePrint);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("beforeprint", handleBeforePrint);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [user, state]);

  // Auto-download after returning logged in from redirect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("action") === "download" && user) {
      const timer = setTimeout(() => {
        handleDownloadClick();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [user, location.search]);

  const handleDownloadClick = () => {
    // 1. Mandatory section validation runs first
    const { isValid, errors } = validateMandatoryResume(state);
    if (!isValid) {
      if (onValidationFailed) {
        onValidationFailed(errors);
      }
      return;
    }

    // 2. Login required check: send to sign-in page if not logged in
    if (!user) {
      localStorage.setItem("resume_guest_draft", JSON.stringify(state));
      navigate("/login?returnTo=download");
      return;
    }

    handlePrint();
  };

  return (
    <div className="final-view w-full flex flex-col items-center">
      {/* Hidden Offscreen Measurer Container */}
      <div
        ref={measurerRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          left: "-9999px",
          top: "-9999px",
          width: `${dimensions.width}px`,
          opacity: 0,
          pointerEvents: "none",
          zIndex: -100,
        }}
      >
        <TemplateRenderer
          templateId={state.selectedTemplate}
          data={state}
          accentColor={state.accentColor}
        />
      </div>

      {/* Top Floating Control Bar */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="glass p-3 mb-6 flex flex-wrap items-center justify-between gap-4 max-w-5xl w-full border border-[var(--border-glass)]"
      >
        <div className="flex items-center flex-wrap gap-3">
          <MagneticButton
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onEditAgain}
          >
            ← ✏️ Edit Details
          </MagneticButton>

          {/* Quick Template Switcher */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[var(--text-muted)] hidden sm:inline">Theme:</span>
            <select
              className="form-input !py-1 !px-2 !text-xs !w-auto cursor-pointer"
              value={state.selectedTemplate || "classic"}
              onChange={(e) =>
                dispatch({ type: ACTIONS.SET_TEMPLATE, payload: e.target.value })
              }
            >
              {TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Font Selector in Final View */}
          <div className="hidden md:block">
            <FontSelector />
          </div>

          {/* Page Size Switcher (A4 vs Letter) */}
          <div className="flex items-center bg-[var(--bg-glass-strong)] p-0.5 rounded-[var(--radius-xs)] border border-[var(--border-glass)] text-xs">
            <button
              type="button"
              className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
                pageSize === "a4"
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-white"
              }`}
              onClick={() => dispatch({ type: ACTIONS.SET_PAGE_SIZE, payload: "a4" })}
              title="A4 Standard (210 × 297 mm)"
            >
              A4
            </button>
            <button
              type="button"
              className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
                pageSize === "letter"
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-white"
              }`}
              onClick={() => dispatch({ type: ACTIONS.SET_PAGE_SIZE, payload: "letter" })}
              title="US Letter (8.5 × 11 in)"
            >
              Letter
            </button>
          </div>
        </div>

        {/* Zoom & Download */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 bg-[var(--bg-glass-strong)] px-2.5 py-1 rounded-[var(--radius-xs)] border border-[var(--border-glass)] text-xs text-[var(--text-secondary)]">
            <button
              type="button"
              className="hover:text-white px-1 font-bold"
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
              title="Zoom out"
            >
              -
            </button>
            <span className="w-12 text-center font-mono">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              className="hover:text-white px-1 font-bold"
              onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
              title="Zoom in"
            >
              +
            </button>
            <button
              type="button"
              className="hover:text-white ml-1 text-[10px] text-[var(--accent-light)]"
              onClick={() => setZoom(1)}
            >
              Reset
            </button>
          </div>

          <MagneticButton
            type="button"
            className="btn btn-neon !py-2.5 !px-6 flex items-center gap-2"
            onClick={handleDownloadClick}
            disabled={isPrinting}
            title={!user ? "Login required" : "Download PDF"}
          >
            {!user && <Lock size={14} className="text-amber-300 shrink-0" />}
            <span>{isPrinting ? "Generating..." : "📥 Download PDF"}</span>
          </MagneticButton>
        </div>
      </motion.div>

      {/* Stacked Pages Wrapper with Live Zoom Scaling */}
      <div className="resume-page-wrapper flex justify-center w-full pb-16 overflow-x-hidden">
        <motion.div
          initial={{ rotateY: 90, rotateX: 10, scale: 0.75, opacity: 0 }}
          animate={{ rotateY: 0, rotateX: 0, scale: zoom, opacity: 1 }}
          transition={{
            type: "spring",
            damping: 18,
            stiffness: 75,
            mass: 0.9,
          }}
          style={{
            transformOrigin: "top center",
            transformStyle: "preserve-3d",
          }}
          className="flex flex-col items-center"
        >
          {/* Printable Stacked Pages */}
          <div ref={printRef} className="resume-print-area flex flex-col items-center gap-10">
            {paginationResult.pages.map((blockIds, pageIdx) => (
              <div key={pageIdx} className="flex flex-col items-center">
                {/* Page Label */}
                <div className="page-number-pill mb-2 text-xs font-mono text-[var(--text-muted)] bg-[var(--bg-glass-strong)] px-3 py-1 rounded-full border border-[var(--border-glass)] shadow">
                  Page {pageIdx + 1} / {paginationResult.pages.length}
                </div>

                {/* Individual Page Sheet */}
                <div
                  className="resume-page resume-page-sheet shadow-2xl"
                  style={{
                    width: `${dimensions.width}px`,
                    height: `${dimensions.height}px`,
                    minHeight: `${dimensions.height}px`,
                    maxHeight: `${dimensions.height}px`,
                    backgroundColor: "#ffffff",
                    boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.7)",
                    boxSizing: "border-box",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <TemplateRenderer
                    templateId={state.selectedTemplate}
                    data={state}
                    accentColor={state.accentColor}
                    pageBlocks={blockIds}
                    pageIndex={pageIdx}
                    totalPages={paginationResult.pages.length}
                    isLightContent={paginationResult.isLightContent}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Sign in to download modal (same glass style as login card) */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-[420px] p-8 glass rounded-[var(--radius)] flex flex-col gap-5 border border-white/15 bg-[#0c0d1f]/95 backdrop-blur-xl shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(false)}
                className="absolute right-4 top-4 p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Lock size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">
                    Sign in to download your resume
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Your resume data, template, font, colors, and photo are safely preserved.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  type="button"
                  className="w-full h-11 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                  onClick={() => {
                    localStorage.setItem("resume_guest_draft", JSON.stringify(state));
                    navigate("/login?returnTo=download");
                  }}
                >
                  <LogIn size={15} /> Sign In
                </button>

                <button
                  type="button"
                  className="w-full h-11 rounded-lg bg-white/5 hover:bg-white/10 border border-white/20 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  onClick={() => {
                    localStorage.setItem("resume_guest_draft", JSON.stringify(state));
                    navigate("/signup?returnTo=download");
                  }}
                >
                  <UserPlus size={15} /> Create Account
                </button>

                <button
                  type="button"
                  className="text-xs text-[var(--text-muted)] hover:text-white text-center mt-1 cursor-pointer transition-colors"
                  onClick={() => setIsLoginModalOpen(false)}
                >
                  Continue editing as guest
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
