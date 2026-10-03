import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useResume } from "../context/ResumeContext";
import { SECTIONS } from "../data/sections";
import PersonalStep from "./steps/PersonalStep";
import SummaryStep from "./steps/SummaryStep";
import EducationStep from "./steps/EducationStep";
import SkillsStep from "./steps/SkillsStep";
import ProjectsStep from "./steps/ProjectsStep";
import ExperienceStep from "./steps/ExperienceStep";
import OptionalSectionStep from "./steps/OptionalSectionStep";
import AddSectionDrawer from "./AddSectionDrawer";
import { Plus, Trash2, Zap, RotateCcw } from "lucide-react";

export default function FormPanel({ onCompleteForm }) {
  const { state, dispatch, ACTIONS } = useResume();
  const [direction, setDirection] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Compute all currently active sections (Mandatory + Active Optional)
  const activeOptional = state.activeOptional || [];
  const activeSections = SECTIONS.filter(
    (sec) => sec.mandatory || activeOptional.includes(sec.id)
  );

  const rawStep = state.formStep || 0;
  const currentStep = Math.min(rawStep, activeSections.length - 1);
  const currentSection = activeSections[currentStep] || activeSections[0];

  const setStep = (newStep) => {
    setDirection(newStep > currentStep ? 1 : -1);
    dispatch({ type: ACTIONS.SET_FORM_STEP, payload: newStep });
  };

  const handleNext = () => {
    if (currentStep < activeSections.length - 1) {
      setStep(currentStep + 1);
    } else {
      onCompleteForm?.();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setStep(currentStep - 1);
    }
  };

  const stepVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 25 : -25,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir > 0 ? -25 : 25,
      opacity: 0,
    }),
  };

  // Render form content based on section ID
  const renderSectionContent = () => {
    switch (currentSection.id) {
      case "personal":
        return <PersonalStep />;
      case "summary":
        return <SummaryStep />;
      case "skills":
        return <SkillsStep />;
      case "experience":
        return <ExperienceStep />;
      case "projects":
        return <ProjectsStep />;
      case "education":
        return <EducationStep />;
      default:
        return <OptionalSectionStep section={currentSection} />;
    }
  };

  return (
    <div className="glass step-card flex flex-col h-full overflow-hidden relative">
      {/* Add Section Drawer */}
      <AddSectionDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Header row (sticky top, padding 16px) */}
      <div className="sticky top-0 z-20 bg-[var(--bg-glass-strong)]/95 backdrop-blur-md border-b border-[var(--border-glass)] p-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold text-white leading-snug">
              {currentSection.label}
            </h2>
            {currentSection.description && (
              <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-0.5">
                {currentSection.description}
              </p>
            )}
          </div>

          {!currentSection.mandatory && (
            <button
              type="button"
              className="btn btn-ghost btn-sm text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-1.5 px-2.5 py-1 shrink-0"
              title="Remove section from resume"
              onClick={() => {
                dispatch({
                  type: ACTIONS.TOGGLE_OPTIONAL_SECTION,
                  payload: currentSection.id,
                });
                if (currentStep > 0) setStep(currentStep - 1);
              }}
            >
              <Trash2 size={13} />
              <span>Remove Section</span>
            </button>
          )}
        </div>
      </div>

      {/* Toolbar row on its own line below the header (gap 8px), ABOVE progress bar */}
      <div className="px-4 pt-3">
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            className="btn btn-outline btn-sm !py-1.5 !px-2 text-xs flex items-center justify-center gap-1.5 truncate"
            onClick={() => setIsDrawerOpen(true)}
            title="Add or remove optional sections"
          >
            <Plus size={13} className="shrink-0" />
            <span className="truncate">Add Section</span>
          </button>
          <button
            type="button"
            className="btn btn-outline btn-sm !py-1.5 !px-2 text-xs flex items-center justify-center gap-1.5 truncate"
            title="Preload sample data"
            onClick={() => dispatch({ type: ACTIONS.LOAD_SAMPLE })}
          >
            <Zap size={13} className="shrink-0 text-amber-400" />
            <span className="truncate">Load Sample</span>
          </button>
          <button
            type="button"
            className="btn btn-danger-sm btn-sm !py-1.5 !px-2 text-xs flex items-center justify-center gap-1.5 truncate"
            title="Reset all form fields"
            onClick={() => {
              if (window.confirm("Reset all resume information back to empty?")) {
                dispatch({ type: ACTIONS.RESET });
              }
            }}
          >
            <RotateCcw size={13} className="shrink-0" />
            <span className="truncate">Reset</span>
          </button>
        </div>
      </div>

      {/* Progress: a 4px progress bar plus the section name on its own row with 16px margin above and below */}
      <div className="px-4 my-4">
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-[var(--accent)] transition-all duration-300 rounded-full"
            style={{
              width: `${((currentStep + 1) / activeSections.length) * 100}%`,
            }}
          />
        </div>
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-light)]">
          {currentSection.label}
        </div>
      </div>

      {/* Scrollable body (flex-1, overflow-y-auto, padding 16px, gap 20px between entries) */}
      <div className="flex-1 overflow-y-auto px-4 pb-12 space-y-5">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSection.id}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {renderSectionContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer (sticky bottom, own row, solid blurred background, border-top, padding 16px) */}
      <div className="sticky bottom-0 z-20 bg-[var(--bg-glass-strong)]/95 backdrop-blur-md border-t border-[var(--border-glass)] p-4 flex items-center justify-between">
        <button
          type="button"
          className="btn btn-outline"
          onClick={handleBack}
          disabled={currentStep === 0}
          style={{ opacity: currentStep === 0 ? 0.35 : 1 }}
        >
          ← Back
        </button>

        <button
          type="button"
          className="btn btn-neon"
          onClick={handleNext}
        >
          {currentStep === activeSections.length - 1 ? "Choose Template →" : "Next →"}
        </button>
      </div>
    </div>
  );
}
