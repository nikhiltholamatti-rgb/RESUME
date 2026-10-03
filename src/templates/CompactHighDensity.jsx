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

export default function CompactHighDensity({
  data,
  accentColor = "#2563eb",
  pageBlocks,
  pageIndex = 0,
  totalPages = 1,
  isLightContent = false,
}) {
  const { personalInfo = {}, links = [], summary, education = [], skills = {}, projects = [], experience = [] } = data;
  const activeOptional = data.activeOptional || [];

  return (
    <div
      className="resume-tpl tpl-compact"
      style={{
        color: "#0f172a",
        backgroundColor: "#ffffff",
        minHeight: "100%",
        padding: "24px 28px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        fontSize: "8.5pt",
        lineHeight: 1.35,
      }}
    >
      {/* Compact Header */}
      {pageIndex === 0 && (
        <ResumeBlock id="header" type="header" pageBlocks={pageBlocks} style={{ marginBottom: "10px", borderBottom: `2px solid ${accentColor}`, paddingBottom: "6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "6px" }}>
            <div>
              <h1 style={{ fontSize: "17pt", fontWeight: 800, margin: 0, color: "#0f172a", lineHeight: 1.1 }}>
                {personalInfo.fullName || "Candidate Name"}
              </h1>
              {personalInfo.headline && (
                <span style={{ fontSize: "9pt", fontWeight: 600, color: accentColor, marginLeft: "4px" }}>
                  {personalInfo.headline}
                </span>
              )}
            </div>
            <ContactLine
              personalInfo={personalInfo}
              links={links}
              separator=" | "
              className="resume-contact-row text-[8pt]"
              textColor="#475569"
              iconSize={11}
            />
          </div>
        </ResumeBlock>
      )}

      {/* Main Content Area */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: isLightContent ? "18px" : "10px",
          flexGrow: isLightContent ? 1 : "initial",
          justifyContent: isLightContent ? "space-between" : "flex-start",
        }}
      >
        {/* Summary */}
        {hasSummary(data) && (
          <section>
            <ResumeBlock id="sec-summary-head" type="heading" headingFor="summary" pageBlocks={pageBlocks}>
              <h2 style={{ fontSize: "9pt", fontWeight: 700, textTransform: "uppercase", color: accentColor, margin: "0 0 2px 0", borderBottom: "1px solid #cbd5e1" }}>
                Summary
              </h2>
            </ResumeBlock>
            <ResumeBlock id="sec-summary-body" type="item" pageBlocks={pageBlocks}>
              <p style={{ margin: "2px 0 0 0", color: "#334155" }}>{summary}</p>
            </ResumeBlock>
          </section>
        )}

        {/* Skills */}
        {hasSkills(data) && (
          <section>
            <ResumeBlock id="sec-skills-head" type="heading" headingFor="skills" pageBlocks={pageBlocks}>
              <h2 style={{ fontSize: "9pt", fontWeight: 700, textTransform: "uppercase", color: accentColor, margin: "0 0 3px 0", borderBottom: "1px solid #cbd5e1" }}>
                Technical Proficiencies
              </h2>
            </ResumeBlock>
            <ResumeBlock id="sec-skills-body" type="item" pageBlocks={pageBlocks}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                {skills.languages?.length > 0 && <div><strong>Languages:</strong> {skills.languages.join(", ")}</div>}
                {skills.web?.length > 0 && <div><strong>Frameworks:</strong> {skills.web.join(", ")}</div>}
                {skills.databases?.length > 0 && <div><strong>Databases:</strong> {skills.databases.join(", ")}</div>}
                {skills.tools?.length > 0 && <div><strong>Tools & Platforms:</strong> {skills.tools.join(", ")}</div>}
              </div>
            </ResumeBlock>
          </section>
        )}

        {/* Work Experience */}
        {hasExperience(data) && (
          <section>
            <ResumeBlock id="sec-experience-head" type="heading" headingFor="experience" pageBlocks={pageBlocks}>
              <h2 style={{ fontSize: "9pt", fontWeight: 700, textTransform: "uppercase", color: accentColor, margin: "0 0 4px 0", borderBottom: "1px solid #cbd5e1" }}>
                Experience
              </h2>
            </ResumeBlock>
            {experience.map((exp, idx) => (
              <ResumeBlock key={exp.id || idx} id={`exp-${exp.id || idx}`} type="item" pageBlocks={pageBlocks} style={{ marginBottom: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <strong style={{ color: "#0f172a" }}>{exp.role}</strong>
                    {exp.company && <span style={{ color: "#475569" }}> — {exp.company}</span>}
                  </div>
                  {exp.duration && <span style={{ color: "#64748b", fontSize: "7.5pt" }}>{exp.duration}</span>}
                </div>
                {exp.bullets && exp.bullets.filter((b) => b && b.trim()).length > 0 && (
                  <ul style={{ margin: "1px 0 0 0", paddingLeft: "14px" }}>
                    {exp.bullets.filter((b) => b && b.trim()).map((b, bi) => (
                      <li key={bi} style={{ marginBottom: "1px" }}>{b}</li>
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
              <h2 style={{ fontSize: "9pt", fontWeight: 700, textTransform: "uppercase", color: accentColor, margin: "0 0 4px 0", borderBottom: "1px solid #cbd5e1" }}>
                Projects
              </h2>
            </ResumeBlock>
            {projects.map((proj, idx) => (
              <ResumeBlock key={proj.id || idx} id={`proj-${proj.id || idx}`} type="item" pageBlocks={pageBlocks} style={{ marginBottom: "5px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <strong style={{ color: "#0f172a" }}>{proj.name}</strong>
                    {proj.techStack && <span style={{ color: "#64748b", marginLeft: "4px" }}>({proj.techStack})</span>}
                  </div>
                  <div style={{ display: "flex", gap: "6px", fontSize: "7.5pt" }}>
                    {proj.liveLink?.trim() && <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" style={{ color: accentColor }}>Link</a>}
                    {proj.githubLink?.trim() && <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" style={{ color: accentColor }}>Code</a>}
                  </div>
                </div>
                {proj.bullets && proj.bullets.filter((b) => b && b.trim()).length > 0 && (
                  <ul style={{ margin: "1px 0 0 0", paddingLeft: "14px" }}>
                    {proj.bullets.filter((b) => b && b.trim()).map((b, bi) => (
                      <li key={bi} style={{ marginBottom: "1px" }}>{b}</li>
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
              <h2 style={{ fontSize: "9pt", fontWeight: 700, textTransform: "uppercase", color: accentColor, margin: "0 0 3px 0", borderBottom: "1px solid #cbd5e1" }}>
                Education
              </h2>
            </ResumeBlock>
            {education.map((edu, idx) => (
              <ResumeBlock key={edu.id || idx} id={`edu-${edu.id || idx}`} type="item" pageBlocks={pageBlocks} style={{ marginBottom: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <strong>{edu.college}</strong>
                    {(edu.degree || edu.branch) && (
                      <span style={{ color: "#475569" }}> — {[edu.degree, edu.branch].filter(Boolean).join(", ")}</span>
                    )}
                    {edu.cgpa && <span style={{ color: "#64748b", marginLeft: "6px" }}>(GPA: {edu.cgpa})</span>}
                  </div>
                  {(edu.startYear || edu.endYear) && (
                    <span style={{ color: "#64748b", fontSize: "7.5pt" }}>
                      {[edu.startYear, edu.endYear].filter(Boolean).join(" – ")}
                    </span>
                  )}
                </div>
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
            accentColor={accentColor}
            headingClass="text-[9pt] font-bold uppercase tracking-wider mb-1 border-b pb-0.5"
            pageBlocks={pageBlocks}
          />
        ))}
      </div>
    </div>
  );
}
