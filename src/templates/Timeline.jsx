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

export default function Timeline({
  data,
  accentColor = "#0284c7",
  pageBlocks,
  pageIndex = 0,
  totalPages = 1,
  isLightContent = false,
}) {
  const { personalInfo = {}, links = [], summary, education = [], skills = {}, projects = [], experience = [] } = data;
  const activeOptional = data.activeOptional || [];

  return (
    <div
      className="resume-tpl tpl-timeline"
      style={{
        color: "#0f172a",
        backgroundColor: "#ffffff",
        minHeight: "100%",
        padding: "32px 36px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header (Page 1 only) */}
      {pageIndex === 0 && (
        <ResumeBlock id="header" type="header" pageBlocks={pageBlocks} style={{ marginBottom: "18px", borderBottom: `2px solid ${accentColor}30`, paddingBottom: "12px" }}>
          <h1 style={{ fontSize: "22pt", fontWeight: 800, margin: 0, color: "#0f172a", letterSpacing: "-0.5px" }}>
            {personalInfo.fullName || "Candidate Name"}
          </h1>
          {personalInfo.headline && (
            <p style={{ fontSize: "10.5pt", fontWeight: 600, color: accentColor, marginTop: "2px", marginBottom: "8px" }}>
              {personalInfo.headline}
            </p>
          )}
          <ContactLine
            personalInfo={personalInfo}
            links={links}
            separator="  •  "
            className="resume-contact-row text-[8.5pt]"
            textColor="#475569"
            iconSize={13}
          />
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
        {/* Summary */}
        {hasSummary(data) && (
          <section>
            <ResumeBlock id="sec-summary-head" type="heading" headingFor="summary" pageBlocks={pageBlocks}>
              <h2 style={{ fontSize: "10pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: accentColor, marginBottom: "4px" }}>
                Summary
              </h2>
            </ResumeBlock>
            <ResumeBlock id="sec-summary-body" type="item" pageBlocks={pageBlocks}>
              <p style={{ fontSize: "9pt", lineHeight: 1.55, color: "#334155", margin: 0 }}>
                {summary}
              </p>
            </ResumeBlock>
          </section>
        )}

        {/* Experience on Timeline Rail */}
        {hasExperience(data) && (
          <section>
            <ResumeBlock id="sec-experience-head" type="heading" headingFor="experience" pageBlocks={pageBlocks}>
              <h2 style={{ fontSize: "10pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: accentColor, marginBottom: "8px" }}>
                Career Trajectory
              </h2>
            </ResumeBlock>
            {/* The vertical timeline rail */}
            <div style={{ borderLeft: `2px solid ${accentColor}40`, marginLeft: "8px", paddingLeft: "16px" }}>
              {experience.map((exp, idx) => (
                <ResumeBlock key={exp.id || idx} id={`exp-${exp.id || idx}`} type="item" pageBlocks={pageBlocks} style={{ marginBottom: "14px", position: "relative" }}>
                  {/* Timeline Node Dot */}
                  <span
                    style={{
                      position: "absolute",
                      left: "-22px",
                      top: "4px",
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: accentColor,
                      border: "2px solid #ffffff",
                      boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
                    }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div>
                      <span style={{ fontWeight: 800, fontSize: "9.5pt", color: "#0f172a" }}>{exp.role}</span>
                      {exp.company && <span style={{ color: "#475569", fontWeight: 600 }}> @ {exp.company}</span>}
                    </div>
                    {exp.duration && <span style={{ fontSize: "8pt", color: "#64748b", fontWeight: 500 }}>{exp.duration}</span>}
                  </div>
                  {exp.bullets && exp.bullets.filter((b) => b && b.trim()).length > 0 && (
                    <ul style={{ margin: "3px 0 0 0", paddingLeft: "16px", fontSize: "8.5pt", lineHeight: 1.5, color: "#334155" }}>
                      {exp.bullets.filter((b) => b && b.trim()).map((b, bi) => (
                        <li key={bi} style={{ marginBottom: "2px" }}>{b}</li>
                      ))}
                    </ul>
                  )}
                </ResumeBlock>
              ))}
            </div>
          </section>
        )}

        {/* Projects on Timeline Rail */}
        {hasProjects(data) && (
          <section>
            <ResumeBlock id="sec-projects-head" type="heading" headingFor="projects" pageBlocks={pageBlocks}>
              <h2 style={{ fontSize: "10pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: accentColor, marginBottom: "8px" }}>
                Projects & Engineering Milestones
              </h2>
            </ResumeBlock>
            <div style={{ borderLeft: `2px solid ${accentColor}40`, marginLeft: "8px", paddingLeft: "16px" }}>
              {projects.map((proj, idx) => (
                <ResumeBlock key={proj.id || idx} id={`proj-${proj.id || idx}`} type="item" pageBlocks={pageBlocks} style={{ marginBottom: "12px", position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "-22px",
                      top: "4px",
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: "#0f172a",
                      border: "2px solid #ffffff",
                    }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div>
                      <span style={{ fontWeight: 800, fontSize: "9.5pt", color: "#0f172a" }}>{proj.name}</span>
                      {proj.techStack && (
                        <span style={{ color: "#64748b", fontSize: "8pt", marginLeft: "6px" }}>
                          ({proj.techStack})
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "8pt", display: "flex", gap: "6px" }}>
                      {proj.liveLink?.trim() && <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" style={{ color: accentColor, textDecoration: "underline" }}>Live</a>}
                      {proj.githubLink?.trim() && <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" style={{ color: accentColor, textDecoration: "underline" }}>Repo</a>}
                    </div>
                  </div>
                  {proj.bullets && proj.bullets.filter((b) => b && b.trim()).length > 0 && (
                    <ul style={{ margin: "3px 0 0 0", paddingLeft: "16px", fontSize: "8.5pt", lineHeight: 1.5, color: "#334155" }}>
                      {proj.bullets.filter((b) => b && b.trim()).map((b, bi) => (
                        <li key={bi} style={{ marginBottom: "2px" }}>{b}</li>
                      ))}
                    </ul>
                  )}
                </ResumeBlock>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {hasSkills(data) && (
          <section>
            <ResumeBlock id="sec-skills-head" type="heading" headingFor="skills" pageBlocks={pageBlocks}>
              <h2 style={{ fontSize: "10pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: accentColor, marginBottom: "6px" }}>
                Core Competencies
              </h2>
            </ResumeBlock>
            <ResumeBlock id="sec-skills-body" type="item" pageBlocks={pageBlocks}>
              <div style={{ fontSize: "8.5pt", lineHeight: 1.55, color: "#334155" }}>
                {skills.languages?.length > 0 && <div><strong>Languages:</strong> {skills.languages.join(", ")}</div>}
                {skills.web?.length > 0 && <div><strong>Web & Frameworks:</strong> {skills.web.join(", ")}</div>}
                {skills.databases?.length > 0 && <div><strong>Databases:</strong> {skills.databases.join(", ")}</div>}
                {skills.tools?.length > 0 && <div><strong>Tools & Cloud:</strong> {skills.tools.join(", ")}</div>}
              </div>
            </ResumeBlock>
          </section>
        )}

        {/* Education */}
        {hasEducation(data) && (
          <section>
            <ResumeBlock id="sec-education-head" type="heading" headingFor="education" pageBlocks={pageBlocks}>
              <h2 style={{ fontSize: "10pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: accentColor, marginBottom: "8px" }}>
                Education
              </h2>
            </ResumeBlock>
            {education.map((edu, idx) => (
              <ResumeBlock key={edu.id || idx} id={`edu-${edu.id || idx}`} type="item" pageBlocks={pageBlocks} style={{ marginBottom: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: "9.5pt" }}>{edu.college}</span>
                    {(edu.degree || edu.branch) && (
                      <span style={{ color: "#475569" }}> — {[edu.degree, edu.branch].filter(Boolean).join(", ")}</span>
                    )}
                  </div>
                  {(edu.startYear || edu.endYear) && (
                    <span style={{ color: "#64748b", fontSize: "8pt" }}>
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
            headingClass="text-[10pt] font-extrabold uppercase tracking-wider mb-2 border-b pb-1"
            pageBlocks={pageBlocks}
          />
        ))}
      </div>
    </div>
  );
}
