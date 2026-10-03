import {
  ContactLine,
  hasSummary,
  hasExperience,
  hasProjects,
  hasEducation,
  hasSkills,
  hasAchievements,
} from "./templateUtils";

export default function Minimal({ data, accentColor = "#6366f1" }) {
  const { personalInfo = {}, links = [], summary, education = [], skills = {}, projects = [], experience = [], achievements = [] } = data;

  return (
    <div className="resume-tpl tpl-minimal" style={{ minHeight: "100%", background: "#fff", color: "#111", padding: "40px 44px" }}>
      {/* Header */}
      {personalInfo.fullName && <h1 className="mn-name" style={{ lineHeight: 1.15 }}>{personalInfo.fullName}</h1>}
      {personalInfo.headline && <p className="mn-headline" style={{ marginTop: "4px", marginBottom: "6px" }}>{personalInfo.headline}</p>}

      {/* Contact & Links */}
      <ContactLine
        personalInfo={personalInfo}
        links={links}
        separator=" / "
        className="resume-contact-row mn-contact"
        textColor="#555"
      />

      <div className="mn-divider" style={{ backgroundColor: accentColor, opacity: 0.35, margin: "14px 0 20px" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Summary */}
        {hasSummary(data) && (
          <section style={{ breakInside: "avoid" }}>
            <h2 className="mn-section-title" style={{ color: accentColor, marginTop: 0, marginBottom: "6px" }}>Profile</h2>
            <p style={{ fontSize: "9.5pt", color: "#444", lineHeight: 1.5 }}>{summary}</p>
          </section>
        )}

        {/* Experience */}
        {hasExperience(data) && (
          <section>
            <h2 className="mn-section-title" style={{ color: accentColor, marginTop: 0, marginBottom: "8px" }}>Experience</h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mn-entry" style={{ marginBottom: "10px", breakInside: "avoid" }}>
                <div className="mn-entry-header">
                  <div>
                    <span className="mn-entry-title">{exp.role}</span>
                    {exp.company && <span className="mn-entry-sub" style={{ color: "#64748b" }}> — {exp.company}</span>}
                  </div>
                  {exp.duration && <span className="mn-entry-date" style={{ color: "#64748b" }}>{exp.duration}</span>}
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
            <h2 className="mn-section-title" style={{ color: accentColor, marginTop: 0, marginBottom: "8px" }}>Projects</h2>
            {projects.map((proj) => (
              <div key={proj.id} className="mn-entry" style={{ marginBottom: "10px", breakInside: "avoid" }}>
                <div className="mn-entry-header">
                  <div>
                    <span className="mn-entry-title">{proj.name}</span>
                    {proj.techStack && (
                      <span className="mn-entry-sub" style={{ color: "#64748b", fontStyle: "italic", marginLeft: "6px" }}>
                        ({proj.techStack})
                      </span>
                    )}
                  </div>
                  <div className="mn-links">
                    {proj.liveLink?.trim() && (
                      <a href={proj.liveLink} target="_blank" rel="noopener noreferrer">Demo</a>
                    )}
                    {proj.githubLink?.trim() && (
                      <a href={proj.githubLink} target="_blank" rel="noopener noreferrer">Code</a>
                    )}
                  </div>
                </div>
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

        {/* Education */}
        {hasEducation(data) && (
          <section style={{ breakInside: "avoid" }}>
            <h2 className="mn-section-title" style={{ color: accentColor, marginTop: 0, marginBottom: "8px" }}>Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="mn-entry" style={{ marginBottom: "8px", breakInside: "avoid" }}>
                <div className="mn-entry-header">
                  <div>
                    <span className="mn-entry-title">{edu.college}</span>
                    {(edu.degree || edu.branch) && (
                      <span className="mn-entry-sub" style={{ color: "#64748b" }}>
                        {" · "}
                        {[edu.degree, edu.branch].filter(Boolean).join(", ")}
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "baseline" }}>
                    {edu.cgpa && <span style={{ fontSize: "8.5pt", color: "#64748b" }}>GPA: {edu.cgpa}</span>}
                    {(edu.startYear || edu.endYear) && (
                      <span className="mn-entry-date" style={{ color: "#64748b" }}>
                        {[edu.startYear, edu.endYear].filter(Boolean).join(" – ")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Skills */}
        {hasSkills(data) && (
          <section style={{ breakInside: "avoid" }}>
            <h2 className="mn-section-title" style={{ color: accentColor, marginTop: 0, marginBottom: "6px" }}>Competencies</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {skills.languages?.length > 0 && (
                <div className="mn-skills-row">
                  <span className="mn-skills-label">Languages</span>
                  <span className="mn-skills-value">{skills.languages.join(" · ")}</span>
                </div>
              )}
              {skills.web?.length > 0 && (
                <div className="mn-skills-row">
                  <span className="mn-skills-label">Frameworks</span>
                  <span className="mn-skills-value">{skills.web.join(" · ")}</span>
                </div>
              )}
              {skills.databases?.length > 0 && (
                <div className="mn-skills-row">
                  <span className="mn-skills-label">Databases</span>
                  <span className="mn-skills-value">{skills.databases.join(" · ")}</span>
                </div>
              )}
              {skills.tools?.length > 0 && (
                <div className="mn-skills-row">
                  <span className="mn-skills-label">Tools</span>
                  <span className="mn-skills-value">{skills.tools.join(" · ")}</span>
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
            headingClass="mn-section-title"
            entryTitleClass="mn-entry-title"
            dateClass="mn-entry-date"
          />
        ))}
      </div>
    </div>
  );
}
