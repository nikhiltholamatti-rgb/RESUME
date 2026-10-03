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

export default function CorporateSlate({
  data,
  accentColor = "#334155",
  pageBlocks,
  pageIndex = 0,
  totalPages = 1,
  isLightContent = false,
}) {
  const { personalInfo = {}, links = [], summary, education = [], skills = {}, projects = [], experience = [] } = data;
  const activeOptional = data.activeOptional || [];

  return (
    <div
      className="resume-tpl tpl-slate"
      style={{
        color: "#1e293b",
        backgroundColor: "#ffffff",
        minHeight: "100%",
        padding: "32px 36px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'EB Garamond', Garamond, 'Times New Roman', serif",
      }}
    >
      {/* Header with Slate Border Box (Page 1 only) */}
      {pageIndex === 0 && (
        <ResumeBlock id="header" type="header" pageBlocks={pageBlocks} style={{ marginBottom: "16px" }}>
          <div
            style={{
              border: "1.5px solid #94a3b8",
              backgroundColor: "#f8fafc",
              padding: "18px 24px",
              textAlign: "center",
            }}
          >
            <h1 style={{ fontSize: "23pt", fontWeight: 700, margin: 0, color: "#0f172a", letterSpacing: "1px", textTransform: "uppercase" }}>
              {personalInfo.fullName || "Candidate Name"}
            </h1>
            {personalInfo.headline && (
              <p style={{ fontSize: "11pt", fontStyle: "italic", color: "#475569", marginTop: "4px", marginBottom: "8px" }}>
                {personalInfo.headline}
              </p>
            )}
            <ContactLine
              personalInfo={personalInfo}
              links={links}
              separator="   |   "
              className="resume-contact-row text-[9pt] justify-center"
              textColor="#334155"
              iconSize={13}
            />
          </div>
        </ResumeBlock>
      )}

      {/* Main Content Area */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: isLightContent ? "24px" : "18px",
          flexGrow: isLightContent ? 1 : "initial",
          justifyContent: isLightContent ? "space-between" : "flex-start",
        }}
      >
        {/* Professional Summary */}
        {hasSummary(data) && (
          <section>
            <ResumeBlock id="sec-summary-head" type="heading" headingFor="summary" pageBlocks={pageBlocks}>
              <h2 style={{ fontSize: "11pt", fontWeight: 700, textTransform: "uppercase", color: "#0f172a", margin: "0 0 6px 0", borderBottom: "1.5px solid #64748b", paddingBottom: "2px", letterSpacing: "0.5px" }}>
                Professional Profile
              </h2>
            </ResumeBlock>
            <ResumeBlock id="sec-summary-body" type="item" pageBlocks={pageBlocks}>
              <p style={{ fontSize: "10pt", lineHeight: 1.6, color: "#334155", margin: 0 }}>
                {summary}
              </p>
            </ResumeBlock>
          </section>
        )}

        {/* Experience */}
        {hasExperience(data) && (
          <section>
            <ResumeBlock id="sec-experience-head" type="heading" headingFor="experience" pageBlocks={pageBlocks}>
              <h2 style={{ fontSize: "11pt", fontWeight: 700, textTransform: "uppercase", color: "#0f172a", margin: "0 0 8px 0", borderBottom: "1.5px solid #64748b", paddingBottom: "2px", letterSpacing: "0.5px" }}>
                Professional Experience
              </h2>
            </ResumeBlock>
            {experience.map((exp, idx) => (
              <ResumeBlock key={exp.id || idx} id={`exp-${exp.id || idx}`} type="item" pageBlocks={pageBlocks} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: "10.5pt", color: "#0f172a" }}>{exp.role}</span>
                    {exp.company && <span style={{ fontStyle: "italic", color: "#475569", marginLeft: "4px" }}>— {exp.company}</span>}
                  </div>
                  {exp.duration && <span style={{ fontSize: "9pt", color: "#64748b" }}>{exp.duration}</span>}
                </div>
                {exp.bullets && exp.bullets.filter((b) => b && b.trim()).length > 0 && (
                  <ul style={{ margin: "4px 0 0 0", paddingLeft: "18px", fontSize: "9.5pt", lineHeight: 1.55, color: "#334155" }}>
                    {exp.bullets.filter((b) => b && b.trim()).map((b, bi) => (
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
              <h2 style={{ fontSize: "11pt", fontWeight: 700, textTransform: "uppercase", color: "#0f172a", margin: "0 0 8px 0", borderBottom: "1.5px solid #64748b", paddingBottom: "2px", letterSpacing: "0.5px" }}>
                Selected Projects
              </h2>
            </ResumeBlock>
            {projects.map((proj, idx) => (
              <ResumeBlock key={proj.id || idx} id={`proj-${proj.id || idx}`} type="item" pageBlocks={pageBlocks} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: "10.5pt", color: "#0f172a" }}>{proj.name}</span>
                    {proj.techStack && <span style={{ fontStyle: "italic", color: "#64748b", marginLeft: "6px", fontSize: "9pt" }}>({proj.techStack})</span>}
                  </div>
                  <div style={{ fontSize: "8.5pt", display: "flex", gap: "8px" }}>
                    {proj.liveLink?.trim() && <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" style={{ color: "#334155", textDecoration: "underline" }}>Demo</a>}
                    {proj.githubLink?.trim() && <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" style={{ color: "#334155", textDecoration: "underline" }}>Source</a>}
                  </div>
                </div>
                {proj.bullets && proj.bullets.filter((b) => b && b.trim()).length > 0 && (
                  <ul style={{ margin: "3px 0 0 0", paddingLeft: "18px", fontSize: "9.5pt", lineHeight: 1.55, color: "#334155" }}>
                    {proj.bullets.filter((b) => b && b.trim()).map((b, bi) => (
                      <li key={bi} style={{ marginBottom: "2px" }}>{b}</li>
                    ))}
                  </ul>
                )}
              </ResumeBlock>
            ))}
          </section>
        )}

        {/* Technical Competencies */}
        {hasSkills(data) && (
          <section>
            <ResumeBlock id="sec-skills-head" type="heading" headingFor="skills" pageBlocks={pageBlocks}>
              <h2 style={{ fontSize: "11pt", fontWeight: 700, textTransform: "uppercase", color: "#0f172a", margin: "0 0 6px 0", borderBottom: "1.5px solid #64748b", paddingBottom: "2px", letterSpacing: "0.5px" }}>
                Competencies & Skills
              </h2>
            </ResumeBlock>
            <ResumeBlock id="sec-skills-body" type="item" pageBlocks={pageBlocks}>
              <div style={{ fontSize: "9.5pt", lineHeight: 1.6, color: "#334155" }}>
                {skills.languages?.length > 0 && <div><strong>Languages:</strong> {skills.languages.join(", ")}</div>}
                {skills.web?.length > 0 && <div><strong>Frameworks & Systems:</strong> {skills.web.join(", ")}</div>}
                {skills.databases?.length > 0 && <div><strong>Databases:</strong> {skills.databases.join(", ")}</div>}
                {skills.tools?.length > 0 && <div><strong>Tools & Platforms:</strong> {skills.tools.join(", ")}</div>}
              </div>
            </ResumeBlock>
          </section>
        )}

        {/* Education */}
        {hasEducation(data) && (
          <section>
            <ResumeBlock id="sec-education-head" type="heading" headingFor="education" pageBlocks={pageBlocks}>
              <h2 style={{ fontSize: "11pt", fontWeight: 700, textTransform: "uppercase", color: "#0f172a", margin: "0 0 8px 0", borderBottom: "1.5px solid #64748b", paddingBottom: "2px", letterSpacing: "0.5px" }}>
                Academic Background
              </h2>
            </ResumeBlock>
            {education.map((edu, idx) => (
              <ResumeBlock key={edu.id || idx} id={`edu-${edu.id || idx}`} type="item" pageBlocks={pageBlocks} style={{ marginBottom: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: "10pt" }}>{edu.college}</span>
                    {(edu.degree || edu.branch) && (
                      <span style={{ fontStyle: "italic", color: "#475569" }}> — {[edu.degree, edu.branch].filter(Boolean).join(", ")}</span>
                    )}
                  </div>
                  {(edu.startYear || edu.endYear) && (
                    <span style={{ color: "#64748b", fontSize: "9pt" }}>
                      {[edu.startYear, edu.endYear].filter(Boolean).join(" – ")}
                    </span>
                  )}
                </div>
                {edu.cgpa && <div style={{ fontSize: "8.5pt", color: "#64748b" }}>Cumulative GPA: {edu.cgpa}</div>}
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
            accentColor="#334155"
            headingClass="text-[11pt] font-bold uppercase tracking-wider mb-2 border-b pb-1"
            pageBlocks={pageBlocks}
          />
        ))}
      </div>
    </div>
  );
}
