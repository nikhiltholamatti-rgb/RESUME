import {
  ContactLine,
  hasSummary,
  hasExperience,
  hasProjects,
  hasEducation,
  hasSkills,
  hasAchievements,
} from "./templateUtils";
import { RenderOptionalSection } from "./OptionalSectionsRenderer";

export default function Executive({ data, accentColor = "#1f2937" }) {
  const { personalInfo = {}, links = [], summary, education = [], skills = {}, projects = [], experience = [], achievements = [] } = data;
  const hasPhoto = Boolean(data.showPhoto && data.photo);

  return (
    <div className="resume-tpl tpl-executive" style={{ minHeight: "100%", background: "#fff", color: "#111", padding: "36px 40px" }}>
      {/* Header */}
      {hasPhoto ? (
        <div style={{ display: "flex", alignItems: "center", gap: "22px", marginBottom: "8px" }}>
          <img
            src={data.photo}
            crossOrigin="anonymous"
            alt={personalInfo.fullName || "Profile"}
            style={{
              width: "84px",
              height: "84px",
              objectFit: "cover",
              flexShrink: 0,
              borderRadius: data.photoShape === "square" ? "12px" : "50%",
              border: `2.5px solid ${accentColor}`,
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
              display: "block",
            }}
          />
          <div style={{ flex: 1 }}>
            {personalInfo.fullName && (
              <h1 className="ex-name" style={{ textAlign: "left", fontSize: "20pt", lineHeight: 1.2 }}>
                {personalInfo.fullName}
              </h1>
            )}
            {personalInfo.headline && (
              <p className="ex-headline" style={{ textAlign: "left", marginTop: "3px" }}>
                {personalInfo.headline}
              </p>
            )}
            <div style={{ marginTop: "6px" }}>
              <ContactLine
                personalInfo={personalInfo}
                links={links}
                separator=" | "
                className="resume-contact-row ex-contact"
                textColor="#555"
              />
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          {personalInfo.fullName && <h1 className="ex-name">{personalInfo.fullName}</h1>}
          {personalInfo.headline && <p className="ex-headline" style={{ marginTop: "2px" }}>{personalInfo.headline}</p>}
          <ContactLine
            personalInfo={personalInfo}
            links={links}
            separator=" | "
            className="resume-contact-row ex-contact"
            textColor="#555"
          />
        </div>
      )}

      {/* Double Divider */}
      <div
        className="ex-divider"
        style={{
          borderTop: `2px solid ${accentColor}`,
          borderBottom: "1px solid #ddd",
          height: "4px",
          margin: "14px 0 20px",
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Summary */}
        {hasSummary(data) && (
          <section style={{ breakInside: "avoid" }}>
            <h2 className="ex-section-title" style={{ color: accentColor, borderBottom: `1.5px solid ${accentColor}`, marginBottom: "6px" }}>
              Executive Summary
            </h2>
            <p className="ex-summary" style={{ lineHeight: 1.5 }}>{summary}</p>
          </section>
        )}

        {/* Experience */}
        {hasExperience(data) && (
          <section>
            <h2 className="ex-section-title" style={{ color: accentColor, borderBottom: `1.5px solid ${accentColor}`, marginBottom: "10px" }}>
              Professional Experience
            </h2>
            {experience.map((exp) => (
              <div key={exp.id} className="ex-entry" style={{ marginBottom: "12px", breakInside: "avoid" }}>
                <div className="ex-entry-header">
                  <div>
                    <span className="ex-entry-title">{exp.role}</span>
                    {exp.company && <span className="ex-entry-sub" style={{ color: "#64748b" }}> — {exp.company}</span>}
                  </div>
                  {exp.duration && <span className="ex-entry-date" style={{ color: "#64748b" }}>{exp.duration}</span>}
                </div>
                {exp.bullets && exp.bullets.filter((b) => b && b.trim()).length > 0 && (
                  <ul style={{ marginTop: "4px" }}>
                    {exp.bullets
                      .filter((b) => b && b.trim())
                      .map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {hasProjects(data) && (
          <section>
            <h2 className="ex-section-title" style={{ color: accentColor, borderBottom: `1.5px solid ${accentColor}`, marginBottom: "10px" }}>
              Key Projects & Initiatives
            </h2>
            {projects.map((proj) => (
              <div key={proj.id} className="ex-entry" style={{ marginBottom: "12px", breakInside: "avoid" }}>
                <div className="ex-entry-header">
                  <div>
                    <span className="ex-entry-title">{proj.name}</span>
                    {proj.techStack && (
                      <span className="ex-entry-sub" style={{ color: "#64748b", fontStyle: "italic", marginLeft: "4px" }}>
                        ({proj.techStack})
                      </span>
                    )}
                  </div>
                  <div className="ex-links">
                    {proj.liveLink?.trim() && (
                      <a href={proj.liveLink} target="_blank" rel="noopener noreferrer">Portfolio Link</a>
                    )}
                    {proj.githubLink?.trim() && (
                      <a href={proj.githubLink} target="_blank" rel="noopener noreferrer">Repository</a>
                    )}
                  </div>
                </div>
                {proj.bullets && proj.bullets.filter((b) => b && b.trim()).length > 0 && (
                  <ul style={{ marginTop: "4px" }}>
                    {proj.bullets
                      .filter((b) => b && b.trim())
                      .map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {hasEducation(data) && (
          <section style={{ breakInside: "avoid" }}>
            <h2 className="ex-section-title" style={{ color: accentColor, borderBottom: `1.5px solid ${accentColor}`, marginBottom: "8px" }}>
              Education & Credentials
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="ex-entry" style={{ marginBottom: "8px", breakInside: "avoid" }}>
                <div className="ex-entry-header">
                  <div>
                    <span className="ex-entry-title">{edu.college}</span>
                    {(edu.degree || edu.branch) && (
                      <span className="ex-entry-sub" style={{ color: "#64748b" }}>
                        {" — "}
                        {[edu.degree, edu.branch].filter(Boolean).join(" in ")}
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "baseline" }}>
                    {edu.cgpa && <span style={{ fontSize: "9pt", color: "#64748b" }}>Honors/CGPA: {edu.cgpa}</span>}
                    {(edu.startYear || edu.endYear) && (
                      <span className="ex-entry-date" style={{ color: "#64748b" }}>
                        {[edu.startYear, edu.endYear].filter(Boolean).join(" – ")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Core Competencies / Skills */}
        {hasSkills(data) && (
          <section style={{ breakInside: "avoid" }}>
            <h2 className="ex-section-title" style={{ color: accentColor, borderBottom: `1.5px solid ${accentColor}`, marginBottom: "8px" }}>
              Core Competencies
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {skills.languages?.length > 0 && (
                <div className="ex-skills-row">
                  <span className="ex-skills-label">Languages:</span>
                  <span className="ex-skills-value">{skills.languages.join(", ")}</span>
                </div>
              )}
              {skills.web?.length > 0 && (
                <div className="ex-skills-row">
                  <span className="ex-skills-label">Web & Cloud:</span>
                  <span className="ex-skills-value">{skills.web.join(", ")}</span>
                </div>
              )}
              {skills.databases?.length > 0 && (
                <div className="ex-skills-row">
                  <span className="ex-skills-label">Databases:</span>
                  <span className="ex-skills-value">{skills.databases.join(", ")}</span>
                </div>
              )}
              {skills.tools?.length > 0 && (
                <div className="ex-skills-row">
                  <span className="ex-skills-label">Tools & Tech:</span>
                  <span className="ex-skills-value">{skills.tools.join(", ")}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Active Optional Sections */}
        {(data.activeOptional || []).map((secId) => (
          <RenderOptionalSection
            key={secId}
            sectionId={secId}
            data={data}
            accentColor={accentColor}
            headingClass="ex-section-title"
            entryTitleClass="ex-entry-title"
            dateClass="ex-entry-date"
          />
        ))}
      </div>
    </div>
  );
}
