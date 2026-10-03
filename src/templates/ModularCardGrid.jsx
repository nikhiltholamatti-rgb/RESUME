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

export default function ModularCardGrid({
  data,
  accentColor = "#4f46e5",
  pageBlocks,
  pageIndex = 0,
  totalPages = 1,
  isLightContent = false,
}) {
  const { personalInfo = {}, links = [], summary, education = [], skills = {}, projects = [], experience = [] } = data;
  const activeOptional = data.activeOptional || [];
  const showPhoto = Boolean(data.showPhoto && data.photo);

  return (
    <div
      className="resume-tpl tpl-modular"
      style={{
        color: "#1e293b",
        backgroundColor: "#f8fafc",
        minHeight: "100%",
        padding: "28px 32px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header Card (Page 1 only) */}
      {pageIndex === 0 && (
        <ResumeBlock id="header" type="header" pageBlocks={pageBlocks} style={{ marginBottom: "14px" }}>
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              padding: "20px 24px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <div>
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
                separator=" • "
                className="resume-contact-row text-[8.5pt]"
                textColor="#475569"
                iconSize={13}
              />
            </div>

            {showPhoto && (
              <div style={{ flexShrink: 0 }}>
                <img
                  src={data.photo}
                  alt={personalInfo.fullName || "Avatar"}
                  style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: data.photoShape === "square" ? "8px" : "9999px",
                    objectFit: "cover",
                    border: `2px solid ${accentColor}`,
                  }}
                />
              </div>
            )}
          </div>
        </ResumeBlock>
      )}

      {/* Main Content Area */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: isLightContent ? "18px" : "12px",
          flexGrow: isLightContent ? 1 : "initial",
          justifyContent: isLightContent ? "space-between" : "flex-start",
        }}
      >
        {/* Summary Card */}
        {hasSummary(data) && (
          <ResumeBlock id="sec-summary-block" type="item" pageBlocks={pageBlocks}>
            <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "14px 18px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
              <h2 style={{ fontSize: "9.5pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: accentColor, margin: "0 0 4px 0" }}>
                Executive Summary
              </h2>
              <p style={{ fontSize: "9pt", lineHeight: 1.55, color: "#334155", margin: 0 }}>{summary}</p>
            </div>
          </ResumeBlock>
        )}

        {/* Experience Card */}
        {hasExperience(data) && (
          <section>
            <ResumeBlock id="sec-experience-head" type="heading" headingFor="experience" pageBlocks={pageBlocks}>
              <h2 style={{ fontSize: "9.5pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: accentColor, margin: "0 0 6px 0", paddingLeft: "4px" }}>
                Experience & Internships
              </h2>
            </ResumeBlock>
            {experience.map((exp, idx) => (
              <ResumeBlock key={exp.id || idx} id={`exp-${exp.id || idx}`} type="item" pageBlocks={pageBlocks} style={{ marginBottom: "8px" }}>
                <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "12px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div>
                      <span style={{ fontWeight: 800, fontSize: "9.5pt", color: "#0f172a" }}>{exp.role}</span>
                      {exp.company && <span style={{ color: "#475569", fontWeight: 600 }}> @ {exp.company}</span>}
                    </div>
                    {exp.duration && <span style={{ fontSize: "8pt", color: "#64748b" }}>{exp.duration}</span>}
                  </div>
                  {exp.bullets && exp.bullets.filter((b) => b && b.trim()).length > 0 && (
                    <ul style={{ margin: "4px 0 0 0", paddingLeft: "16px", fontSize: "8.5pt", lineHeight: 1.5, color: "#334155" }}>
                      {exp.bullets.filter((b) => b && b.trim()).map((b, bi) => (
                        <li key={bi} style={{ marginBottom: "2px" }}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </ResumeBlock>
            ))}
          </section>
        )}

        {/* Projects Card */}
        {hasProjects(data) && (
          <section>
            <ResumeBlock id="sec-projects-head" type="heading" headingFor="projects" pageBlocks={pageBlocks}>
              <h2 style={{ fontSize: "9.5pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: accentColor, margin: "0 0 6px 0", paddingLeft: "4px" }}>
                Key Projects
              </h2>
            </ResumeBlock>
            {projects.map((proj, idx) => (
              <ResumeBlock key={proj.id || idx} id={`proj-${proj.id || idx}`} type="item" pageBlocks={pageBlocks} style={{ marginBottom: "8px" }}>
                <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "12px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div>
                      <span style={{ fontWeight: 800, fontSize: "9.5pt", color: "#0f172a" }}>{proj.name}</span>
                      {proj.techStack && (
                        <span style={{ color: "#64748b", fontSize: "8pt", marginLeft: "6px" }}>
                          ({proj.techStack})
                        </span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "6px", fontSize: "8pt" }}>
                      {proj.liveLink?.trim() && <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" style={{ color: accentColor, textDecoration: "underline" }}>Live</a>}
                      {proj.githubLink?.trim() && <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" style={{ color: accentColor, textDecoration: "underline" }}>Code</a>}
                    </div>
                  </div>
                  {proj.bullets && proj.bullets.filter((b) => b && b.trim()).length > 0 && (
                    <ul style={{ margin: "4px 0 0 0", paddingLeft: "16px", fontSize: "8.5pt", lineHeight: 1.5, color: "#334155" }}>
                      {proj.bullets.filter((b) => b && b.trim()).map((b, bi) => (
                        <li key={bi} style={{ marginBottom: "2px" }}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </ResumeBlock>
            ))}
          </section>
        )}

        {/* Skills Card */}
        {hasSkills(data) && (
          <ResumeBlock id="sec-skills-block" type="item" pageBlocks={pageBlocks}>
            <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "14px 18px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
              <h2 style={{ fontSize: "9.5pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: accentColor, margin: "0 0 6px 0" }}>
                Technical Capabilities
              </h2>
              <div style={{ fontSize: "8.5pt", lineHeight: 1.55, color: "#334155", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "6px" }}>
                {skills.languages?.length > 0 && <div><strong>Languages:</strong> {skills.languages.join(", ")}</div>}
                {skills.web?.length > 0 && <div><strong>Frameworks:</strong> {skills.web.join(", ")}</div>}
                {skills.databases?.length > 0 && <div><strong>Databases:</strong> {skills.databases.join(", ")}</div>}
                {skills.tools?.length > 0 && <div><strong>Tools:</strong> {skills.tools.join(", ")}</div>}
              </div>
            </div>
          </ResumeBlock>
        )}

        {/* Education Card */}
        {hasEducation(data) && (
          <ResumeBlock id="sec-education-block" type="item" pageBlocks={pageBlocks}>
            <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "14px 18px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
              <h2 style={{ fontSize: "9.5pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: accentColor, margin: "0 0 6px 0" }}>
                Education
              </h2>
              {education.map((edu, idx) => (
                <div key={edu.id || idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: idx < education.length - 1 ? "4px" : 0 }}>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: "9pt" }}>{edu.college}</span>
                    {(edu.degree || edu.branch) && (
                      <span style={{ color: "#475569", fontSize: "8.5pt" }}> — {[edu.degree, edu.branch].filter(Boolean).join(", ")}</span>
                    )}
                  </div>
                  {(edu.startYear || edu.endYear) && (
                    <span style={{ color: "#64748b", fontSize: "8pt" }}>
                      {[edu.startYear, edu.endYear].filter(Boolean).join(" – ")}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </ResumeBlock>
        )}

        {/* Optional Sections */}
        {activeOptional.map((secId) => (
          <RenderOptionalSection
            key={secId}
            sectionId={secId}
            data={data}
            accentColor={accentColor}
            headingClass="text-[9.5pt] font-extrabold uppercase tracking-wider mb-2"
            pageBlocks={pageBlocks}
          />
        ))}
      </div>
    </div>
  );
}
