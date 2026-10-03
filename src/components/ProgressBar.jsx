import { motion } from "framer-motion";

const STEPS = [
  { id: 0, label: "1. Details & Bio" },
  { id: 1, label: "2. Template & Style" },
  { id: 2, label: "3. Build & Export" },
];

export default function ProgressBar({ currentStep, onStepClick }) {
  return (
    <div className="progress-bar-container">
      {STEPS.map((step, idx) => {
        const isCurrent = currentStep === step.id;
        const isDone = currentStep > step.id;

        return (
          <div key={step.id} className="flex items-center">
            {/* Step Node */}
            <div
              className="progress-step cursor-pointer"
              onClick={() => onStepClick && onStepClick(step.id)}
            >
              <motion.div
                className={`progress-circle ${isCurrent ? "active" : ""} ${isDone ? "done" : ""}`}
                animate={{
                  scale: isCurrent ? 1.08 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {isDone ? "✓" : step.id + 1}
              </motion.div>
              <span
                className={`progress-label ${isCurrent ? "active" : ""} ${isDone ? "done" : ""}`}
              >
                {step.label}
              </span>
            </div>

            {/* Connecting Line (except after last step) */}
            {idx < STEPS.length - 1 && (
              <div className="progress-connector">
                <motion.div
                  className="progress-connector-fill"
                  initial={{ scaleX: 0 }}
                  animate={{
                    scaleX: currentStep > idx ? 1 : currentStep === idx ? 0.5 : 0,
                  }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
