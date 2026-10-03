import { useResume } from "../../context/ResumeContext";
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import AutoGrowTextarea from "../AutoGrowTextarea";

export default function OptionalSectionStep({ section }) {
  const { state, dispatch, ACTIONS } = useResume();
  const items = state[section.id] || [];

  const handleUpdate = (id, field, value) => {
    dispatch({
      type: ACTIONS.UPDATE_SECTION_ITEM,
      payload: { sectionId: section.id, id, data: { [field]: value } },
    });
  };

  const handleAddItem = () => {
    dispatch({
      type: ACTIONS.ADD_SECTION_ITEM,
      payload: { sectionId: section.id, item: { ...section.emptyEntry } },
    });
  };

  const handleRemoveItem = (id) => {
    dispatch({
      type: ACTIONS.REMOVE_SECTION_ITEM,
      payload: { sectionId: section.id, id },
    });
  };

  const handleMove = (index, direction) => {
    const toIndex = index + direction;
    dispatch({
      type: ACTIONS.REORDER_SECTION_ITEM,
      payload: { sectionId: section.id, fromIndex: index, toIndex },
    });
  };

  // Specific renderers for section fields
  const renderItemFields = (item, index) => {
    switch (section.id) {
      case "certifications":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="form-label">Certification Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. AWS Certified Solutions Architect"
                value={item.name || ""}
                onChange={(e) => handleUpdate(item.id, "name", e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Issuing Organization</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Amazon Web Services"
                value={item.issuer || ""}
                onChange={(e) => handleUpdate(item.id, "issuer", e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Issue Date</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 2023 or Nov 2023"
                value={item.issueDate || ""}
                onChange={(e) => handleUpdate(item.id, "issueDate", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="form-label">Credential URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://..."
                value={item.url || ""}
                onChange={(e) => handleUpdate(item.id, "url", e.target.value)}
              />
            </div>
          </div>
        );

      case "leadership":
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="form-label">Organization / Club *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Google Developer Student Club"
                  value={item.organization || ""}
                  onChange={(e) => handleUpdate(item.id, "organization", e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">Role / Position *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Lead Organizer"
                  value={item.role || ""}
                  onChange={(e) => handleUpdate(item.id, "role", e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="form-label">Duration</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Aug 2022 – May 2023"
                  value={item.duration || ""}
                  onChange={(e) => handleUpdate(item.id, "duration", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-2">Description Bullets</label>
              {(item.bullets || [""]).map((b, bi) => (
                <div key={bi} className="flex gap-2 mb-2 items-start">
                  <span className="mt-2 text-xs text-[var(--text-muted)]">•</span>
                  <AutoGrowTextarea
                    minRows={2}
                    className="flex-1"
                    placeholder="Key impact or responsibility..."
                    value={b}
                    onChange={(e) => {
                      const updated = [...(item.bullets || [""])];
                      updated[bi] = e.target.value;
                      handleUpdate(item.id, "bullets", updated);
                    }}
                  />
                  {(item.bullets || []).length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger-sm mt-1"
                      onClick={() => {
                        const updated = item.bullets.filter((_, idx) => idx !== bi);
                        handleUpdate(item.id, "bullets", updated);
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="btn btn-ghost btn-sm mt-1 text-xs"
                onClick={() => handleUpdate(item.id, "bullets", [...(item.bullets || []), ""])}
              >
                + Add Bullet
              </button>
            </div>
          </div>
        );

      case "achievements":
        return (
          <div>
            <label className="block text-xs font-semibold text-white/90 mb-2">Achievement / Award Text</label>
            <AutoGrowTextarea
              minRows={2}
              placeholder="e.g. Winner, Smart India Hackathon 2023 (1st place out of 500+ teams)"
              value={item.text || ""}
              onChange={(e) => handleUpdate(item.id, "text", e.target.value)}
            />
          </div>
        );

      case "opensource":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="form-label">Project Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. TailwindCSS or React"
                value={item.projectName || ""}
                onChange={(e) => handleUpdate(item.id, "projectName", e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Role</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Contributor or Maintainer"
                value={item.role || ""}
                onChange={(e) => handleUpdate(item.id, "role", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="form-label">Repository URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://github.com/..."
                value={item.link || ""}
                onChange={(e) => handleUpdate(item.id, "link", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-white/90 mb-2">Contribution Summary</label>
              <AutoGrowTextarea
                minRows={2}
                placeholder="e.g. Fixed CSS rendering bug affecting flex containers in v3.2."
                value={item.description || ""}
                onChange={(e) => handleUpdate(item.id, "description", e.target.value)}
              />
            </div>
          </div>
        );

      case "publications":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-white/90 mb-2">Paper / Publication Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. High-Throughput Edge Caching for Microservices"
                value={item.title || ""}
                onChange={(e) => handleUpdate(item.id, "title", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-2">Venue / Journal / Conference</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. IEEE ICCCNT 2023"
                value={item.venue || ""}
                onChange={(e) => handleUpdate(item.id, "venue", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-2">Publication Date</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. May 2023"
                value={item.date || ""}
                onChange={(e) => handleUpdate(item.id, "date", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-white/90 mb-2">DOI / Paper Link</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://doi.org/..."
                value={item.link || ""}
                onChange={(e) => handleUpdate(item.id, "link", e.target.value)}
              />
            </div>
          </div>
        );

      case "languages":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-2">Language *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Spanish, German, Japanese"
                value={item.language || ""}
                onChange={(e) => handleUpdate(item.id, "language", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-2">Proficiency</label>
              <select
                className="form-input"
                value={item.proficiency || "Fluent"}
                onChange={(e) => handleUpdate(item.id, "proficiency", e.target.value)}
              >
                <option value="Native / Bilingual">Native / Bilingual</option>
                <option value="Fluent">Fluent</option>
                <option value="Professional Working">Professional Working</option>
                <option value="Conversational">Conversational</option>
                <option value="Elementary">Elementary</option>
              </select>
            </div>
          </div>
        );

      case "interests":
        return (
          <div>
            <label className="block text-xs font-semibold text-white/90 mb-2">Interest / Hobby</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Competitive Chess, Astrophotography, Marathon Running"
              value={item.name || ""}
              onChange={(e) => handleUpdate(item.id, "name", e.target.value)}
            />
          </div>
        );

      case "custom":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-2">Section Heading</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Volunteering & Mentorship"
                value={item.heading || ""}
                onChange={(e) => handleUpdate(item.id, "heading", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-2">Bullet Points</label>
              {(item.bullets || [""]).map((b, bi) => (
                <div key={bi} className="flex gap-2 mb-2 items-start">
                  <span className="mt-2 text-xs text-[var(--text-muted)]">•</span>
                  <AutoGrowTextarea
                    minRows={1}
                    className="flex-1"
                    placeholder="Bullet point..."
                    value={b}
                    onChange={(e) => {
                      const updated = [...(item.bullets || [""])];
                      updated[bi] = e.target.value;
                      handleUpdate(item.id, "bullets", updated);
                    }}
                  />
                  {(item.bullets || []).length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger-sm mt-1"
                      onClick={() => {
                        const updated = item.bullets.filter((_, idx) => idx !== bi);
                        handleUpdate(item.id, "bullets", updated);
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="btn btn-ghost btn-sm mt-1 text-xs"
                onClick={() => handleUpdate(item.id, "bullets", [...(item.bullets || []), ""])}
              >
                + Add Bullet
              </button>
            </div>
          </div>
        );

      case "coursework":
        return (
          <div>
            <label className="block text-xs font-semibold text-white/90 mb-2">Course Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Distributed Operating Systems"
              value={item.course || ""}
              onChange={(e) => handleUpdate(item.id, "course", e.target.value)}
            />
          </div>
        );

      case "testScores":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-2">Exam Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. GRE, GATE, SAT, TOEFL"
                value={item.examName || ""}
                onChange={(e) => handleUpdate(item.id, "examName", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-2">Score</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 330 / 340 or 99.4%"
                value={item.score || ""}
                onChange={(e) => handleUpdate(item.id, "score", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-2">Date</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 2023"
                value={item.date || ""}
                onChange={(e) => handleUpdate(item.id, "date", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-2">Percentile / Rank (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 98th Percentile or AIR 142"
                value={item.percentile || ""}
                onChange={(e) => handleUpdate(item.id, "percentile", e.target.value)}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-5">
      {items.length === 0 && (
        <div
          style={{
            padding: "24px 16px",
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.02)",
            borderRadius: "var(--radius-xs)",
            border: "1px dashed var(--border-glass)",
          }}
        >
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            No entries added yet for {section.label}.
          </p>
        </div>
      )}

      {items.map((item, idx) => (
        <div
          key={item.id}
          className="p-5 rounded-[var(--radius-sm)] bg-[var(--bg-glass-strong)] border border-[var(--border-glass)] relative"
        >
          {/* Header toolbar for each entry: reorder & delete */}
          <div className="flex items-center justify-between mb-4 border-b border-[var(--border-glass)] pb-3">
            <span className="text-xs font-semibold text-[var(--accent-light)]">
              Entry #{idx + 1}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                className="btn btn-outline btn-sm !p-1.5 text-xs"
                title="Move Up"
                disabled={idx === 0}
                onClick={() => handleMove(idx, -1)}
              >
                <ArrowUp size={12} />
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm !p-1.5 text-xs"
                title="Move Down"
                disabled={idx === items.length - 1}
                onClick={() => handleMove(idx, 1)}
              >
                <ArrowDown size={12} />
              </button>
              <button
                type="button"
                className="btn btn-danger-sm btn-sm !p-1.5 text-xs ml-1"
                title="Delete entry"
                onClick={() => handleRemoveItem(item.id)}
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>

          {/* Dynamic fields */}
          {renderItemFields(item, idx)}
        </div>
      ))}

      <button
        type="button"
        className="w-full mt-4 py-3 rounded-lg border-2 border-dashed border-white/20 hover:border-[var(--accent)] text-xs font-semibold text-white/80 hover:text-white hover:bg-white/5 transition-all cursor-pointer flex items-center justify-center gap-2"
        onClick={handleAddItem}
      >
        <span>+ Add Entry</span>
      </button>
    </div>
  );
}
