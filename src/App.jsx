import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useResume } from "./context/ResumeContext";
import { useAuth } from "./context/AuthContext";
import Background3D from "./components/scene/Background3D";
import ProgressBar from "./components/ProgressBar";
import FormPanel from "./components/FormPanel";
import TemplateGallery from "./components/TemplateGallery";
import FinalResumeView from "./components/FinalResumeView";
import MagneticButton from "./components/MagneticButton";
import ParticleBurst from "./components/ParticleBurst";
import ValidationModal from "./components/ValidationModal";
import { validateMandatoryResume } from "./utils/validation";
import { saveResumeToCloud } from "./utils/resumeStorage";
import { SECTIONS } from "./data/sections";
import Feedback from "./components/Feedback";
import MobileTabBar from "./components/MobileTabBar";
import MobileTemplatesPanel from "./components/MobileTemplatesPanel";
import DesignSettings from "./components/DesignSettings";
import StylePanel from "./components/StylePanel";
import MobilePreview from "./components/MobilePreview";
import { Cloud, CloudUpload, FolderKanban, LogIn, LogOut, CheckCircle, MessageSquareQuote } from "lucide-react";

export default function App() {
  const { state, dispatch, ACTIONS } = useResume();
  const { user, signOut } = useAuth();
  const location = useLocation();

  const [mobileTab, setMobileTab] = useState("edit"); // "edit" | "templates" | "design" | "preview"
  const [burstActive, setBurstActive] = useState(false);
  const [burstCoords, setBurstCoords] = useState({ x: 0, y: 0 });
  const [validationErrors, setValidationErrors] = useState([]);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState("idle"); // "idle" | "saving" | "saved"

  const buildBtnRef = useRef(null);

  // If redirected from login with action=download, jump straight to final resume view
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("action") === "download") {
      dispatch({ type: ACTIONS.SET_BUILT, payload: true });
      dispatch({ type: ACTIONS.SET_WIZARD_STEP, payload: 2 });
    }
  }, [location.search, dispatch, ACTIONS]);

  // Autosave to Supabase when user is authenticated and state changes
  useEffect(() => {
    if (!user) return;
    setSyncStatus("saving");
    const timer = setTimeout(async () => {
      try {
        const res = await saveResumeToCloud({
          userId: user.id,
          resumeData: state,
          templateId: state.selectedTemplate,
        });
        if (res.success) {
          setSyncStatus("saved");
        } else {
          setSyncStatus("idle");
        }
      } catch (err) {
        setSyncStatus("idle");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [state, user]);

  // Determine current wizard step index (0: details, 1: template, 2: build & export)
  const currentWizardStep = state.isBuilt
    ? 2
    : mobileTab === "preview"
    ? 2
    : mobileTab === "templates" || mobileTab === "design"
    ? 1
    : 0;

  const scrollToField = (fieldId, sectionId) => {
    setTimeout(() => {
      const el =
        document.getElementById(fieldId) ||
        document.getElementById(sectionId) ||
        document.querySelector(`[name="${fieldId}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus?.();
      }
    }, 150);
  };

  const handleNavigateToError = (err) => {
    setIsValidationModalOpen(false);
    const activeOptional = state.activeOptional || [];
    const activeSections = SECTIONS.filter(
      (sec) => sec.mandatory || activeOptional.includes(sec.id)
    );
    const secIdx = activeSections.findIndex((s) => s.id === err.sectionId);
    if (secIdx !== -1) {
      dispatch({ type: ACTIONS.SET_FORM_STEP, payload: secIdx });
    }
    setMobileTab("edit");
    if (state.isBuilt) {
      dispatch({ type: ACTIONS.SET_BUILT, payload: false });
      dispatch({ type: ACTIONS.SET_WIZARD_STEP, payload: 0 });
    }
    scrollToField(err.fieldId, err.sectionId);
  };

  const handleBuildClick = (e) => {
    if (state.isBuilding) return;

    // Validate mandatory fields
    const { isValid, errors } = validateMandatoryResume(state);
    if (!isValid) {
      setValidationErrors(errors);
      setIsValidationModalOpen(true);
      if (errors.length > 0) {
        handleNavigateToError(errors[0]);
      }
      return;
    }

    if (e) {
      setBurstCoords({ x: e.clientX, y: e.clientY });
    } else if (buildBtnRef.current) {
      const rect = buildBtnRef.current.getBoundingClientRect();
      setBurstCoords({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }

    setBurstActive(true);
    dispatch({ type: ACTIONS.SET_BUILDING, payload: true });

    setTimeout(() => {
      dispatch({ type: ACTIONS.SET_BUILT, payload: true });
      dispatch({ type: ACTIONS.SET_WIZARD_STEP, payload: 2 });
    }, 1200);
  };

  const handleEditAgain = () => {
    dispatch({ type: ACTIONS.SET_BUILT, payload: false });
    dispatch({ type: ACTIONS.SET_WIZARD_STEP, payload: 0 });
  };

  const handleStepClick = (stepId) => {
    if (stepId === 2) {
      if (!state.isBuilt) {
        setMobileTab("preview");
      }
    } else if (stepId === 1) {
      if (state.isBuilt) {
        handleEditAgain();
      }
      setMobileTab("templates");
    } else {
      if (state.isBuilt) {
        handleEditAgain();
      }
      setMobileTab("edit");
    }
  };

  const handleScrollToFeedback = () => {
    if (state.isBuilt) {
      handleEditAgain();
    }
    setTimeout(() => {
      const el = document.getElementById("feedback");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 120);
  };

  return (
    <div className="app-wrapper">
      {/* 3D R3F Canvas Background */}
      <Background3D />

      {/* Particle Burst FX */}
      <ParticleBurst
        active={burstActive}
        x={burstCoords.x}
        y={burstCoords.y}
        onComplete={() => setBurstActive(false)}
      />

      {/* Mandatory Validation Blocking Modal */}
      <ValidationModal
        isOpen={isValidationModalOpen}
        errors={validationErrors}
        onClose={() => setIsValidationModalOpen(false)}
        onNavigateToSection={handleNavigateToError}
      />

      {/* Main Content Area */}
      <div className="app-content">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 mb-2">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-lg hover:scale-105 transition-transform"
              style={{
                background: "var(--gradient-accent)",
                boxShadow: "0 0 20px var(--accent-glow)",
              }}
            >
              CV
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                ResumeForge
              </h1>
              <p className="text-xs text-[var(--text-muted)]">
                ATS-Optimized Interactive Resume Engine
              </p>
            </div>
          </div>

          {/* Quick status badge & Auth Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap justify-end">
            <button
              type="button"
              onClick={handleScrollToFeedback}
              className="btn btn-outline btn-sm !py-1.5 !px-3 text-xs flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-white cursor-pointer"
              title="Jump to Feedback section"
            >
              <MessageSquareQuote size={13} className="text-[var(--accent-light)]" />
              <span>Feedback</span>
            </button>
            {user ? (
              <div className="flex items-center gap-2.5">
                {/* Cloud sync indicator */}
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[var(--text-secondary)] flex items-center gap-1.5 font-medium">
                  {syncStatus === "saving" ? (
                    <>
                      <CloudUpload size={13} className="text-amber-400 animate-bounce" />
                      <span>Saving...</span>
                    </>
                  ) : syncStatus === "saved" ? (
                    <>
                      <CheckCircle size={13} className="text-emerald-400" />
                      <span>Synced</span>
                    </>
                  ) : (
                    <>
                      <Cloud size={13} className="text-[var(--accent-light)]" />
                      <span>Cloud Ready</span>
                    </>
                  )}
                </span>

                <Link
                  to="/dashboard"
                  className="btn btn-outline btn-sm !py-1 !px-2.5 text-xs flex items-center gap-1.5"
                  title="View your saved resumes in Cloud Dashboard"
                >
                  <FolderKanban size={13} /> My Resumes
                </Link>

                <button
                  type="button"
                  onClick={() => signOut()}
                  className="btn btn-outline btn-sm !py-1 !px-2 text-xs text-gray-400 hover:text-white"
                  title="Sign out"
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="btn btn-outline btn-sm !py-1.5 !px-3 text-xs flex items-center gap-1.5"
                >
                  <LogIn size={13} /> Sign In
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-neon btn-sm !py-1.5 !px-3 text-xs"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Wizard Progress Bar */}
        <ProgressBar
          currentStep={currentWizardStep}
          onStepClick={handleStepClick}
        />

        {/* Loading Overlay Animation */}
        <AnimatePresence>
          {state.isBuilding && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
            >
              <div className="glass p-8 max-w-sm w-full mx-4 text-center border border-[var(--border-glass)] shadow-2xl flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full border-4 border-[var(--border-glass)] border-t-[var(--accent)] animate-spin" />
                  <div
                    className="absolute inset-0 rounded-full animate-ping opacity-25"
                    style={{ backgroundColor: "var(--accent)" }}
                  />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Building Your Resume...
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono animate-pulse">
                  Rendering typography & A4 geometric matrix...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main View Router */}
        {state.isBuilt ? (
          /* Final A4 Resume View */
          <FinalResumeView
            onEditAgain={handleEditAgain}
            onValidationFailed={(errors) => {
              setValidationErrors(errors);
              setIsValidationModalOpen(true);
              if (errors.length > 0) {
                handleNavigateToError(errors[0]);
              }
            }}
          />
        ) : (
          /* Editor & Gallery View */
          <div className="flex-1 flex flex-col gap-6 pb-28 lg:pb-0">
            {/* Desktop Side-by-Side (50% / 50%) (Visible on lg and above) */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-6 items-start">
              {/* Left Panel: Guided Form */}
              <div className="lg:col-span-5 h-[calc(100vh-140px)] min-h-[600px]">
                <FormPanel onCompleteForm={() => {}} />
              </div>

              {/* Right Panel: Template Gallery */}
              <div className="lg:col-span-7 h-[calc(100vh-140px)] min-h-[600px]">
                <TemplateGallery />
              </div>
            </div>

            {/* Mobile Layout: Single column with active tab (Visible below lg) */}
            <div className="block lg:hidden w-full">
              {/* 1. Edit Tab: Resume Content Forms */}
              {mobileTab === "edit" && (
                <div className="w-full">
                  <FormPanel onCompleteForm={() => setMobileTab("templates")} />
                </div>
              )}

              {/* 2. Templates Tab: 2-col grid (1-col below 360px) in a scrollable panel */}
              {mobileTab === "templates" && (
                <div className="w-full glass rounded-[var(--radius)] border border-[var(--border-glass)] p-4 sm:p-5 shadow-2xl">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border-glass)]">
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-white">
                        Choose a Template
                      </h2>
                      <p className="text-xs text-[var(--text-muted)]">
                        Tap any layout to select your ATS style
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMobileTab("preview")}
                      className="btn btn-outline btn-sm !py-2 !px-3.5 text-xs flex items-center gap-1.5 text-[var(--accent-light)] hover:text-white cursor-pointer"
                    >
                      <span>Preview</span>
                      <span>→</span>
                    </button>
                  </div>
                  <div className="overflow-y-auto max-h-[70vh] pb-[calc(env(safe-area-inset-bottom)+5.5rem)] px-0.5">
                    <MobileTemplatesPanel onSelectTemplate={() => {}} />
                  </div>
                </div>
              )}

              {/* 3. Design Tab: Palette, fonts, font size, spacing */}
              {mobileTab === "design" && (
                <div className="w-full glass rounded-[var(--radius)] border border-[var(--border-glass)] p-4 sm:p-5 shadow-2xl">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border-glass)]">
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-white">
                        Design & Styling
                      </h2>
                      <p className="text-xs text-[var(--text-muted)]">
                        Palette, typography, scale & spacing
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMobileTab("preview")}
                      className="btn btn-outline btn-sm !py-2 !px-3.5 text-xs flex items-center gap-1.5 text-[var(--accent-light)] hover:text-white cursor-pointer"
                    >
                      <span>Preview</span>
                      <span>→</span>
                    </button>
                  </div>
                  <div className="overflow-y-auto max-h-[70vh] pb-[calc(env(safe-area-inset-bottom)+5.5rem)] px-0.5">
                    <StylePanel />
                  </div>
                </div>
              )}

              {/* 4. Preview Tab: Live resume scaled with no horizontal scroll and Download button */}
              {mobileTab === "preview" && (
                <div className="w-full pb-[calc(env(safe-area-inset-bottom)+5rem)]">
                  <MobilePreview onDownload={handleBuildClick} />
                </div>
              )}
            </div>

            {/* Bottom Action Bar with Big Build Resume Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="glass p-4 rounded-[var(--radius)] flex flex-col sm:flex-row items-center justify-between gap-4 mt-2 border border-[var(--border-glass)]"
            >
              <div className="text-center sm:text-left">
                <div className="text-sm font-semibold text-white flex items-center justify-center sm:justify-start gap-2">
                  <span>Step 3: Generate High-Resolution Resume</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Click below to compile and preview your ATS-optimized resume.
                </p>
              </div>

              <div ref={buildBtnRef}>
                <MagneticButton
                  type="button"
                  className="btn-build flex items-center gap-3 min-h-[48px]"
                  onClick={handleBuildClick}
                  disabled={state.isBuilding}
                >
                  <span className="text-lg">✨</span>
                  <span>Build Resume</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white font-mono">
                    A4
                  </span>
                </MagneticButton>
              </div>
            </motion.div>

            {/* Public Feedback Section */}
            <Feedback id="feedback" />

            {/* Landing Page Footer */}
            <footer className="mt-16 pt-8 pb-4 border-t border-[var(--border-glass)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-tight">ResumeForge</span>
                <span>• ATS-Optimized Interactive Resume Engine</span>
              </div>
              <p>© {new Date().getFullYear()} ResumeForge. Built for creators & job seekers.</p>
            </footer>
          </div>
        )}
      </div>

      {/* Sticky Mobile Bottom Tab Bar (Fixed at bottom on screens below lg) */}
      {!state.isBuilt && (
        <MobileTabBar
          activeTab={mobileTab}
          onTabChange={(tab) => setMobileTab(tab)}
        />
      )}
    </div>
  );
}
