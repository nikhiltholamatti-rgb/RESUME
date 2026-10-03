import { useResume } from "../../context/ResumeContext";
import AutoGrowTextarea from "../AutoGrowTextarea";

export default function SummaryStep() {
  const { state, dispatch, ACTIONS } = useResume();
  const summary = state.summary || "";

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-[var(--radius-xs)] bg-[var(--bg-glass)] border border-[var(--border-glass)]">
        <label htmlFor="summary" className="block text-xs font-semibold text-white/90 mb-2">
          Professional Summary *
        </label>
        <AutoGrowTextarea
          id="summary"
          minRows={5}
          placeholder="e.g. Results-driven Full-Stack Engineer with 3+ years of experience designing high-scale cloud platforms and reactive web interfaces. Specialized in React, TypeScript, and microservice architectures with a track record of driving 35% performance gains."
          value={summary}
          onChange={(e) => dispatch({ type: ACTIONS.SET_SUMMARY, payload: e.target.value })}
        />

        <div className="flex justify-between items-center mt-3 text-xs text-[var(--text-muted)]">
          <span>Highlight your key strengths and quantifiable impact.</span>
          <span>{summary.length} characters</span>
        </div>
      </div>
    </div>
  );
}
