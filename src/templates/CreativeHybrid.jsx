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

export default function CreativeHybrid({
  data,
  accentColor = "#7c3aed",
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
      className="resume-tpl tpl-creative"
      style={{
        color: "#1e1b4b",
        backgroundColor: "#ffffff",
        minHeight: "100%",
        padding: "32px 36px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Creative Header with Photo & Accent Badge styling */}
      {pageIndex === 0 && (
        <ResumeBlock id="header" type="header" pageBlocks={pageBlocks} style={{ marginBottom: "18px", borderBottom: `2px solid ${accentColor}20`, paddingBottom: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
            <div style={{ flex: 1 }}>
              <span
                style={{
                  display: "inline-block",
                  backgroundColor: `${accentColor}15`,
                  color: accentColor,
                  fontWeight: 700,
                  fontSize: "8pt",
                  textTransform: "uppercase",
                  letterSpacing: "1.2px",
                  padding: "3px 10px",
                  borderRadius: "9999px",
                  marginBottom: "8px",
                }}
              >
                Portfolio Resume
              </span>
              <h1 style={{ fontSize: "24pt", fontWeight: 900, color: "#0f172a", margin: 0, letterSpacing: "-0.5px" }}>
                {personalInfo.fullName || "Creative Candidate"}
              </h1>
              {personalInfo.headline && (
                <p style={{ fontSize: "11pt", fontWeight: 600, color: accentColor, marginTop: "2px", marginBottom: "8px" }}>
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

            {/* Photo */}
            {showPhoto && (
              <div style={{ flexShrink: 0 }}>
                <img
                  src={data.photo}
                  alt={personalInfo.fullName || "Creative"}
                  style={{
                    width: "105px",
                    height: "105px",
                    borderRadius: data.photoShape === "square" ? "12px" : "9999px",
                    objectFit: "cover",
                    border: `3px solid ${accentColor}`,
                    boxShadow: `0 8px 20px ${accentColor}30`,
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
          gap: isLightContent ? "24px" : "18px",
          flexGrow: isLightContent ? 1 : "initial",
          justifyContent: isLightContent ? "space-between" : "flex-start",
        }}
      >
        {/* Summary */}
        {hasSummary(data) && (
          <section>
            <ResumeBlock id="sec-summary-head" type="heading" headingFor="summary" pageBlocks={pageBlocks}>
              <h2 style={{ fontSize: "10pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: accentColor, marginBottom: "6px" }}>
                About Me
              </h2>
            </ResumeBlock>
            <ResumeBlock id="sec-summary-body" type="item" pageBlocks={pageBlocks}>
              <p style={{ fontSize: "9.5pt", lineHeight: 1.6, color: "#334155", margin: 0 }}>
                {summary}
              </p>
            </ResumeBlock>
          </section>
        )}

        {/* Experience */}
        {hasExperience(data) && (
          <section>
            <ResumeBlock id="sec-experience-head" type="heading" headingFor="experience" pageBlocks={pageBlocks}>
              <h2 style={{ fontSize: "10pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: accentColor, marginBottom: "8px" }}>
                Experience
              </h2>
            </ResumeBlock>
            {experience.map((exp, idx) => (
              <ResumeBlock key={exp.id || idx} id={`exp-${exp.id || idx}`} type="item" pageBlocks={pageBlocks} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: "10pt", color: "#0f172a" }}>{exp.role}</span>
                    {exp.company && <span style={{ color: "#64748b", fontWeight: 600 }}> @ {exp.company}</span>}
                  </div>
                  {exp.duration && (
                    <span
                      style={{
                        backgroundColor: `${accentColor}12`,
                        color: accentColor,
                        padding: "2px 8px",
                        borderRadius: "9999px",
                        fontSize: "7.5pt",
                        fontWeight: 700,
                      }}
                    >
                      {exp.duration}
                    </span>
                  )}
                </div>
                {exp.bullets && exp.bullets.filter((b) => b && b.trim()).length > 0 && (
                  <ul style={{ margin: "4px 0 0 0", paddingLeft: "18px", fontSize: "9pt", lineHeight: 1.55, color: "#334155" }}>
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
              <h2 style={{ fontSize: "10pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: accentColor, marginBottom: "8px" }}>
                Featured Projects
              </h2>
            </ResumeBlock>
            {projects.map((proj, idx) => (
              <ResumeBlock key={proj.id || idx} id={`proj-${proj.id || idx}`} type="item" pageBlocks={pageBlocks} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: "10pt", color: "#0f172a" }}>{proj.name}</span>
                    {proj.techStack && (
                      <span style={{ color: "#64748b", fontSize: "8.5pt", marginLeft: "6px" }}>
                        ({proj.techStack})
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "6px", fontSize: "8pt" }}>
                    {proj.liveLink?.trim() && (
                      <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" style={{ color: accentColor, fontWeight: 600, textDecoration: "underline" }}>
                        Live Demo
                      </a>
                    )}
                    {proj.githubLink?.trim() && (
                      <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" style={{ color: accentColor, fontWeight: 600, textDecoration: "underline" }}>
                        Code
                      </a>
                    )}
                  </div>
                </div>
                {proj.bullets && proj.bullets.filter((b) => b && b.trim()).length > 0 && (
                  <ul style={{ margin: "3px 0 0 0", paddingLeft: "18px", fontSize: "9pt", lineHeight: 1.55, color: "#334155" }}>
                    {proj.bullets.filter((b) => b && b.trim()).map((b, bi) => (
                      <li key={bi} style={{ marginBottom: "2px" }}>{b}</li>
                    ))}
                  </ul>
                )}
              </ResumeBlock>
            ))}
          </section>
        )}

        {/* Skills with Accent Badges */}
        {hasSkills(data) && (
          <section>
            <ResumeBlock id="sec-skills-head" type="heading" headingFor="skills" pageBlocks={pageBlocks}>
              <h2 style={{ fontSize: "10pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: accentColor, marginBottom: "6px" }}>
                Skills & Tech Stack
              </h2>
            </ResumeBlock>
            <ResumeBlock id="sec-skills-body" type="item" pageBlocks={pageBlocks}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {skills.languages?.length > 0 && (
                  <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px" }}>
                    <span style={{ fontSize: "8.5pt", fontWeight: 700, color: "#0f172a", width: "110px" }}>Languages:</span>
                    {skills.languages.map((s, i) => (
                      <span key={i} style={{ background: `${accentColor}12`, color: accentColor, padding: "2px 7px", borderRadius: "6px", fontSize: "8pt", fontWeight: 600 }}>{s}</span>
                    ))}
                  </div>
                )}
                {skills.web?.length > 0 && (
                  <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px" }}>
                    <span style={{ fontSize: "8.5pt", fontWeight: 700, color: "#0f172a", width: "110px" }}>Frameworks:</span>
                    {skills.web.map((s, i) => (
                      <span key={i} style={{ background: "#f1f5f9", color: "#334155", padding: "2px 7px", borderRadius: "6px", fontSize: "8pt", fontWeight: 600 }}>{s}</span>
                    ))}
                  </div>
                )}
                {skills.tools?.length > 0 && (
                  <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px" }}>
                    <span style={{ fontSize: "8.5pt", fontWeight: 700, color: "#0f172a", width: "110px" }}>Tools/Cloud:</span>
                    {skills.tools.map((s, i) => (
                      <span key={i} style={{ background: "#f1f5f9", color: "#334155", padding: "2px 7px", borderRadius: "6px", fontSize: "8pt", fontWeight: 600 }}>{s}</span>
                    ))}
                  </div>
                )}
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
                    <span style={{ color: "#64748b", fontSize: "8pt", fontWeight: 600 }}>
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
