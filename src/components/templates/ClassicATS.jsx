import {
  ContactLine,
  hasSummary,
  hasExperience,
  hasProjects,
  hasEducation,
  hasSkills,
} from "./templateUtils";
import { RenderOptionalSection } from "./OptionalSectionsRenderer";

export default function ClassicATS({ data }) {
  const { personalInfo = {}, links = [], summary, education = [], skills = {}, projects = [], experience = [] } = data;
  const activeOptional = data.activeOptional || [];

  return (
    <div className="resume-tpl tpl-classic" style={{ color: "#111", background: "#fff", minHeight: "100%", padding: "32px 36px" }}>
      {/* Header */}
      {personalInfo.fullName && (
        <h1 className="rc-name" style={{ marginBottom: "2px" }}>{personalInfo.fullName}</h1>
      )}
      {personalInfo.headline && (
        <p className="rc-headline" style={{ marginBottom: "6px" }}>{personalInfo.headline}</p>
      )}

      {/* Contact Line with Lucide icons */}
      <ContactLine
        personalInfo={personalInfo}
        links={links}
        separator=" · "
        className="resume-contact-row rc-contact"
        textColor="#444"
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "16px" }}>
        {/* Professional Summary */}
        {hasSummary(data) && (
          <section style={{ breakInside: "avoid" }}>
            <h2 className="rc-section-title" style={{ marginTop: 0, marginBottom: "6px" }}>Professional Summary</h2>
            <p style={{ fontSize: "9.5pt", color: "#333", lineHeight: 1.5 }}>
              {summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {hasExperience(data) && (
          <section>
            <h2 className="rc-section-title" style={{ marginTop: 0, marginBottom: "8px" }}>Experience</h2>
            {experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: "10px", breakInside: "avoid" }}>
                <div className="rc-entry-header">
                  <div>
                    <span className="rc-entry-title">{exp.role || "Role"}</span>
                    {exp.company && <span className="rc-entry-sub" style={{ color: "#64748b" }}> | {exp.company}</span>}
                  </div>
                  {exp.duration && <span className="rc-entry-date" style={{ color: "#64748b" }}>{exp.duration}</span>}
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
            <h2 className="rc-section-title" style={{ marginTop: 0, marginBottom: "8px" }}>Projects</h2>
            {projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: "10px", breakInside: "avoid" }}>
                <div className="rc-entry-header">
                  <div>
                    <span className="rc-entry-title">{proj.name}</span>
                    {proj.techStack && (
                      <span className="rc-entry-sub" style={{ color: "#64748b", fontStyle: "italic", marginLeft: "4px" }}>
                        ({proj.techStack})
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "8.5pt", display: "flex", gap: "8px" }}>
                    {proj.liveLink?.trim() && (
                      <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
                        Live Demo
                      </a>
                    )}
                    {proj.githubLink?.trim() && (
                      <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
                        GitHub
                      </a>
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
            <h2 className="rc-section-title" style={{ marginTop: 0, marginBottom: "8px" }}>Education</h2>
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: "8px", breakInside: "avoid" }}>
                <div className="rc-entry-header">
                  <div>
                    <span className="rc-entry-title">{edu.college}</span>
                    {(edu.degree || edu.branch) && (
                      <span className="rc-entry-sub" style={{ color: "#64748b" }}>
                        {" — "}
                        {[edu.degree, edu.branch].filter(Boolean).join(" in ")}
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "baseline" }}>
                    {edu.cgpa && <span style={{ fontSize: "9pt", color: "#64748b" }}>CGPA: {edu.cgpa}</span>}
                    {(edu.startYear || edu.endYear) && (
                      <span className="rc-entry-date" style={{ color: "#64748b" }}>
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
            <h2 className="rc-section-title" style={{ marginTop: 0, marginBottom: "6px" }}>Technical Skills</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {skills.languages?.length > 0 && (
                <div className="rc-skills-row">
                  <span className="rc-skills-label">Languages:</span>
                  <span className="rc-skills-value">{skills.languages.join(", ")}</span>
                </div>
              )}
              {skills.web?.length > 0 && (
                <div className="rc-skills-row">
                  <span className="rc-skills-label">Frameworks:</span>
                  <span className="rc-skills-value">{skills.web.join(", ")}</span>
                </div>
              )}
              {skills.databases?.length > 0 && (
                <div className="rc-skills-row">
                  <span className="rc-skills-label">Databases:</span>
                  <span className="rc-skills-value">{skills.databases.join(", ")}</span>
                </div>
              )}
              {skills.tools?.length > 0 && (
                <div className="rc-skills-row">
                  <span className="rc-skills-label">Tools & Tech:</span>
                  <span className="rc-skills-value">{skills.tools.join(", ")}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Active Optional Sections */}
        {activeOptional.map((secId) => (
          <RenderOptionalSection
            key={secId}
            sectionId={secId}
            data={data}
            accentColor="#111"
            headingClass="rc-section-title"
            entryTitleClass="rc-entry-title"
            dateClass="rc-entry-date"
          />
        ))}
      </div>
    </div>
  );
}
