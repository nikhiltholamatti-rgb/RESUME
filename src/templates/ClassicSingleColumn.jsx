import React from "react";
import {
  ContactLine,
  hasSummary,
  hasExperience,
  hasProjects,
  hasEducation,
  hasSkills,
} from "../components/templates/templateUtils";
import { RenderOptionalSection } from "../components/templates/OptionalSectionsRenderer";
import { ResumeBlock } from "../components/templates/ResumeBlock";

export default function ClassicSingleColumn({
  data,
  accentColor = "#111111",
  pageBlocks,
  pageIndex = 0,
  totalPages = 1,
  isLightContent = false,
}) {
  const { personalInfo = {}, links = [], summary, education = [], skills = {}, projects = [], experience = [] } = data;
  const activeOptional = data.activeOptional || [];

  const headingColor = accentColor || "var(--accent, #111111)";
  const showDividers = data?.style?.showDividers !== false;
  const headingTransform = data?.style?.headingStyle === "normal" ? "none" : "uppercase";
  const dividerBorder = showDividers ? `1.5px solid ${headingColor}` : "none";

  return (
    <div
      className="resume-tpl tpl-classic"
      style={{
        color: "#111111",
        backgroundColor: "#ffffff",
        minHeight: "100%",
        padding: "32px 36px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header block (Page 1 only) */}
      {pageIndex === 0 && (
        <ResumeBlock id="header" type="header" pageBlocks={pageBlocks} style={{ marginBottom: "14px" }}>
          {personalInfo.fullName && (
            <h1 className="rc-name" style={{ marginBottom: "2px", color: headingColor, fontSize: "20pt", fontWeight: 800, textTransform: headingTransform }}>
              {personalInfo.fullName}
            </h1>
          )}
          {personalInfo.headline && (
            <p className="rc-headline" style={{ marginBottom: "6px", color: "#333333", fontSize: "10pt" }}>
              {personalInfo.headline}
            </p>
          )}

          <ContactLine
            personalInfo={personalInfo}
            links={links}
            separator=" · "
            className="resume-contact-row rc-contact"
            textColor="#444444"
            iconColor={headingColor}
            linkColor={headingColor}
          />
        </ResumeBlock>
      )}

      {/* Main Content Area */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          justifyContent: "flex-start",
        }}
      >
        {/* Professional Summary */}
        {hasSummary(data) && (
          <section>
            <ResumeBlock id="sec-summary-head" type="heading" headingFor="summary" pageBlocks={pageBlocks}>
              <h2 className="rc-section-title" style={{ marginTop: 0, marginBottom: "5px", color: headingColor, borderBottom: dividerBorder, paddingBottom: "2px", textTransform: headingTransform, fontSize: "10.5pt", letterSpacing: "0.5px" }}>
                Professional Summary
              </h2>
            </ResumeBlock>
            <ResumeBlock id="sec-summary-body" type="item" pageBlocks={pageBlocks}>
              <p style={{ fontSize: "9.5pt", color: "#222222", lineHeight: 1.55 }}>
                {summary}
              </p>
            </ResumeBlock>
          </section>
        )}

        {/* Technical Skills */}
        {hasSkills(data) && (
          <section>
            <ResumeBlock id="sec-skills-head" type="heading" headingFor="skills" pageBlocks={pageBlocks}>
              <h2 className="rc-section-title" style={{ marginTop: 0, marginBottom: "5px", color: headingColor, borderBottom: dividerBorder, paddingBottom: "2px", textTransform: headingTransform, fontSize: "10.5pt", letterSpacing: "0.5px" }}>
                Technical Skills
              </h2>
            </ResumeBlock>
            <ResumeBlock id="sec-skills-body" type="item" pageBlocks={pageBlocks}>
              <div style={{ fontSize: "9pt", lineHeight: 1.6, display: "flex", flexDirection: "column", gap: "2px" }}>
                {skills.languages?.length > 0 && (
                  <div>
                    <strong>Languages:</strong> {skills.languages.join(", ")}
                  </div>
                )}
                {skills.web?.length > 0 && (
                  <div>
                    <strong>Frameworks & Libraries:</strong> {skills.web.join(", ")}
                  </div>
                )}
                {skills.databases?.length > 0 && (
                  <div>
                    <strong>Databases:</strong> {skills.databases.join(", ")}
                  </div>
                )}
                {skills.tools?.length > 0 && (
                  <div>
                    <strong>Tools & Platforms:</strong> {skills.tools.join(", ")}
                  </div>
                )}
              </div>
            </ResumeBlock>
          </section>
        )}

        {/* Work Experience */}
        {hasExperience(data) && (
          <section>
            <ResumeBlock id="sec-experience-head" type="heading" headingFor="experience" pageBlocks={pageBlocks}>
              <h2 className="rc-section-title" style={{ marginTop: 0, marginBottom: "8px", color: headingColor, borderBottom: dividerBorder, paddingBottom: "2px", textTransform: headingTransform, fontSize: "10.5pt", letterSpacing: "0.5px" }}>
                Experience
              </h2>
            </ResumeBlock>
            {experience.map((exp, idx) => (
              <ResumeBlock key={exp.id || idx} id={`exp-${exp.id || idx}`} type="item" pageBlocks={pageBlocks} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: "10pt" }}>{exp.role || "Role"}</span>
                    {exp.company && <span style={{ color: "#444444" }}> | {exp.company}</span>}
                  </div>
                  {exp.duration && <span style={{ color: "#555555", fontSize: "8.5pt" }}>{exp.duration}</span>}
                </div>
                {exp.bullets && exp.bullets.filter((b) => b && b.trim()).length > 0 && (
                  <ul style={{ marginTop: "3px", paddingLeft: "18px", fontSize: "9pt", lineHeight: 1.5 }}>
                    {exp.bullets
                      .filter((b) => b && b.trim())
                      .map((b, bi) => (
                        <li key={bi} style={{ marginBottom: "2px" }}>{b}</li>
                      ))}
                  </ul>
                )}
              </ResumeBlock>
            ))}
          </section>
        )}

        {/* Projects */}
        {hasProjects(data) && (
          <section>
            <ResumeBlock id="sec-projects-head" type="heading" headingFor="projects" pageBlocks={pageBlocks}>
              <h2 className="rc-section-title" style={{ marginTop: 0, marginBottom: "8px", color: headingColor, borderBottom: dividerBorder, paddingBottom: "2px", textTransform: headingTransform, fontSize: "10.5pt", letterSpacing: "0.5px" }}>
                Projects
              </h2>
            </ResumeBlock>
            {projects.map((proj, idx) => (
              <ResumeBlock key={proj.id || idx} id={`proj-${proj.id || idx}`} type="item" pageBlocks={pageBlocks} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: "10pt" }}>{proj.name}</span>
                    {proj.techStack && (
                      <span style={{ color: "#555555", fontStyle: "italic", marginLeft: "4px", fontSize: "8.5pt" }}>
                        ({proj.techStack})
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "8.5pt", display: "flex", gap: "8px" }}>
                    {proj.liveLink?.trim() && (
                      <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", color: headingColor }}>
                        Live Demo
                      </a>
                    )}
                    {proj.githubLink?.trim() && (
                      <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", color: headingColor }}>
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
                {proj.bullets && proj.bullets.filter((b) => b && b.trim()).length > 0 && (
                  <ul style={{ marginTop: "3px", paddingLeft: "18px", fontSize: "9pt", lineHeight: 1.5 }}>
                    {proj.bullets
                      .filter((b) => b && b.trim())
                      .map((b, bi) => (
                        <li key={bi} style={{ marginBottom: "2px" }}>{b}</li>
                      ))}
                  </ul>
                )}
              </ResumeBlock>
            ))}
          </section>
        )}

        {/* Education */}
        {hasEducation(data) && (
          <section>
            <ResumeBlock id="sec-education-head" type="heading" headingFor="education" pageBlocks={pageBlocks}>
              <h2 className="rc-section-title" style={{ marginTop: 0, marginBottom: "8px", color: headingColor, borderBottom: dividerBorder, paddingBottom: "2px", textTransform: headingTransform, fontSize: "10.5pt", letterSpacing: "0.5px" }}>
                Education
              </h2>
            </ResumeBlock>
            {education.map((edu, idx) => (
              <ResumeBlock key={edu.id || idx} id={`edu-${edu.id || idx}`} type="item" pageBlocks={pageBlocks} style={{ marginBottom: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: "10pt" }}>{edu.college}</span>
                    {(edu.degree || edu.branch) && (
                      <span style={{ color: "#444444" }}> — {[edu.degree, edu.branch].filter(Boolean).join(", ")}</span>
                    )}
                  </div>
                  {(edu.startYear || edu.endYear) && (
                    <span style={{ color: "#555555", fontSize: "8.5pt" }}>
                      {[edu.startYear, edu.endYear].filter(Boolean).join(" – ")}
                    </span>
                  )}
                </div>
                {edu.cgpa && (
                  <p style={{ fontSize: "8.5pt", color: "#666666", marginTop: "1px" }}>CGPA / GPA: {edu.cgpa}</p>
                )}
              </ResumeBlock>
            ))}
          </section>
        )}

        {/* Optional Sections */}
        {activeOptional.map((secId) => (
          <RenderOptionalSection
            key={secId}
            sectionId={secId}
            data={data}
            accentColor={headingColor}
            headingClass="rc-section-title"
            pageBlocks={pageBlocks}
          />
        ))}
      </div>
    </div>
  );
}
