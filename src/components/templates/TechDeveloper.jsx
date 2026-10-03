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

export default function TechDeveloper({ data, accentColor = "#06b6d4" }) {
  const { personalInfo = {}, links = [], summary, education = [], skills = {}, projects = [], experience = [], achievements = [] } = data;

  return (
    <div className="resume-tpl tpl-tech" style={{ minHeight: "100%", background: "#fff", color: "#111" }}>
      {/* Terminal Bar Header */}
      <header className="tk-header" style={{ backgroundColor: "#0f172a", padding: "20px 28px 16px" }}>
        <div className="tk-dots" style={{ marginBottom: "10px" }}>
          <span className="tk-dot" style={{ backgroundColor: "#ef4444" }} />
          <span className="tk-dot" style={{ backgroundColor: "#eab308" }} />
          <span className="tk-dot" style={{ backgroundColor: "#22c55e" }} />
          <span style={{ fontSize: "7.5pt", color: "#64748b", fontFamily: "var(--font-mono)", marginLeft: "6px" }}>
            ~/developer/{personalInfo.fullName ? personalInfo.fullName.toLowerCase().replace(/\s+/g, "_") : "resume"}.sh
          </span>
        </div>

        {personalInfo.fullName && (
          <h1 className="tk-name" style={{ color: "#f8fafc", lineHeight: 1.15 }}>
            {personalInfo.fullName}
          </h1>
        )}
        {personalInfo.headline && (
          <p className="tk-headline" style={{ color: accentColor, marginTop: "2px" }}>
            $ {personalInfo.headline}
          </p>
        )}

        {/* Contact info inside terminal banner with Lucide icons */}
        <div style={{ marginTop: "8px" }}>
          <ContactLine
            personalInfo={personalInfo}
            links={links}
            separator=" | "
            className="resume-contact-row tk-contact"
            textColor="#cbd5e1"
          />
        </div>
      </header>

      {/* Main Body with consistent 20px gap */}
      <div className="tk-body" style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Summary */}
        {hasSummary(data) && (
          <section style={{ breakInside: "avoid" }}>
            <h2 className="tk-section-title" style={{ color: accentColor, marginTop: 0, marginBottom: "6px" }}>
              SUMMARY
            </h2>
            <p className="tk-summary" style={{ lineHeight: 1.5 }}>{summary}</p>
          </section>
        )}

        {/* Experience */}
        {hasExperience(data) && (
          <section>
            <h2 className="tk-section-title" style={{ color: accentColor, marginTop: 0, marginBottom: "8px" }}>
              EXPERIENCE
            </h2>
            {experience.map((exp) => (
              <div key={exp.id} className="tk-entry" style={{ marginBottom: "10px", breakInside: "avoid" }}>
                <div className="tk-entry-header">
                  <div>
                    <span className="tk-entry-title">{exp.role}</span>
                    {exp.company && <span className="tk-entry-sub" style={{ color: "#64748b" }}> @ {exp.company}</span>}
                  </div>
                  {exp.duration && <span className="tk-entry-date" style={{ color: "#64748b" }}>{exp.duration}</span>}
                </div>
                {exp.bullets && exp.bullets.filter((b) => b && b.trim()).length > 0 && (
                  <ul style={{ marginTop: "3px" }}>
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
            <h2 className="tk-section-title" style={{ color: accentColor, marginTop: 0, marginBottom: "8px" }}>
              PROJECTS
            </h2>
            {projects.map((proj) => (
              <div key={proj.id} className="tk-entry" style={{ marginBottom: "10px", breakInside: "avoid" }}>
                <div className="tk-entry-header">
                  <span className="tk-entry-title">{proj.name}</span>
                  <div className="tk-links">
                    {proj.liveLink?.trim() && (
                      <a href={proj.liveLink} target="_blank" rel="noopener noreferrer">
                        [Live]
                      </a>
                    )}
                    {proj.githubLink?.trim() && (
                      <a href={proj.githubLink} target="_blank" rel="noopener noreferrer">
                        [Repo]
                      </a>
                    )}
                  </div>
                </div>
                {proj.techStack && (
                  <div style={{ fontSize: "8.5pt", color: "#64748b", fontFamily: "var(--font-mono)", marginBottom: "3px" }}>
                    Stack: {proj.techStack}
                  </div>
                )}
                {proj.bullets && proj.bullets.filter((b) => b && b.trim()).length > 0 && (
                  <ul style={{ marginTop: "3px" }}>
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

        {/* Skills */}
        {hasSkills(data) && (
          <section style={{ breakInside: "avoid" }}>
            <h2 className="tk-section-title" style={{ color: accentColor, marginTop: 0, marginBottom: "6px" }}>
              SKILLS_STACK
            </h2>
            <div className="tk-skills-wrap" style={{ gap: "4px" }}>
              {Object.entries(skills).flatMap(([_, list]) =>
                list && list.length > 0
                  ? list.map((skill, idx) => (
                      <span
                        key={`${skill}-${idx}`}
                        className="tk-skill-badge"
                        style={{
                          backgroundColor: "#0f172a",
                          border: `1px solid ${accentColor}`,
                          color: "#e2e8f0",
                          fontSize: "7.5pt",
                          padding: "2px 8px",
                        }}
                      >
                        {skill}
                      </span>
                    ))
                  : []
              )}
            </div>
          </section>
        )}

        {/* Education */}
        {hasEducation(data) && (
          <section style={{ breakInside: "avoid" }}>
            <h2 className="tk-section-title" style={{ color: accentColor, marginTop: 0, marginBottom: "8px" }}>
              EDUCATION
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="tk-entry" style={{ marginBottom: "8px", breakInside: "avoid" }}>
                <div className="tk-entry-header">
                  <div>
                    <span className="tk-entry-title">{edu.college}</span>
                    {(edu.degree || edu.branch) && (
                      <span className="tk-entry-sub" style={{ color: "#64748b" }}>
                        {" // "}
                        {[edu.degree, edu.branch].filter(Boolean).join(" - ")}
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "baseline" }}>
                    {edu.cgpa && (
                      <span style={{ fontSize: "8.5pt", fontFamily: "var(--font-mono)", color: "#64748b" }}>
                        GPA: {edu.cgpa}
                      </span>
                    )}
                    {(edu.startYear || edu.endYear) && (
                      <span className="tk-entry-date" style={{ color: "#64748b" }}>
                        {[edu.startYear, edu.endYear].filter(Boolean).join("..")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Active Optional Sections */}
        {(data.activeOptional || []).map((secId) => (
          <RenderOptionalSection
            key={secId}
            sectionId={secId}
            data={data}
            accentColor={accentColor}
            headingClass="tk-section-title"
            entryTitleClass="tk-entry-title"
            dateClass="tk-entry-date"
          />
        ))}
      </div>
    </div>
  );
}
