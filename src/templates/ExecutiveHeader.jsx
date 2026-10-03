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

export default function ExecutiveHeader({
  data,
  accentColor = "#1e293b",
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
      className="resume-tpl tpl-executive"
      style={{
        color: "#1e293b",
        backgroundColor: "#ffffff",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      {/* Full-width colored header band (Page 1 only) */}
      {pageIndex === 0 ? (
        <ResumeBlock id="header" type="header" pageBlocks={pageBlocks}>
          <div
            style={{
              backgroundColor: accentColor,
              color: "#ffffff",
              padding: "32px 36px 26px 36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "24px",
            }}
          >
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: "24pt", fontWeight: 800, margin: 0, letterSpacing: "-0.5px", color: "#ffffff" }}>
                {personalInfo.fullName || "Executive Candidate"}
              </h1>
              {personalInfo.headline && (
                <p style={{ fontSize: "11pt", color: "rgba(255,255,255,0.85)", fontWeight: 500, marginTop: "4px", marginBottom: "12px" }}>
                  {personalInfo.headline}
                </p>
              )}
              <ContactLine
                personalInfo={personalInfo}
                links={links}
                separator="  •  "
                className="resume-contact-row text-[8.5pt]"
                textColor="rgba(255,255,255,0.9)"
                iconSize={13}
              />
            </div>

            {/* Photo support */}
            {showPhoto && (
              <div style={{ flexShrink: 0 }}>
                <img
                  src={data.photo}
                  alt={personalInfo.fullName || "Executive"}
                  style={{
                    width: "110px",
                    height: "110px",
                    borderRadius: data.photoShape === "square" ? "8px" : "9999px",
                    objectFit: "cover",
                    border: "3px solid rgba(255,255,255,0.8)",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
                  }}
                />
              </div>
            )}
          </div>
        </ResumeBlock>
      ) : (
        <div style={{ padding: "16px 36px 8px 36px", borderBottom: `2px solid ${accentColor}`, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: "11pt", fontWeight: 700, color: accentColor }}>{personalInfo.fullName}</span>
          <span style={{ fontSize: "8pt", color: "#64748b" }}>Page {pageIndex + 1} of {totalPages}</span>
        </div>
      )}

      {/* Main Body */}
      <div
        style={{
          padding: "24px 36px 32px 36px",
          display: "flex",
          flexDirection: "column",
          gap: isLightContent ? "24px" : "18px",
          flexGrow: isLightContent ? 1 : "initial",
          justifyContent: isLightContent ? "space-between" : "flex-start",
        }}
      >
        {/* Executive Summary */}
        {hasSummary(data) && (
          <section>
            <ResumeBlock id="sec-summary-head" type="heading" headingFor="summary" pageBlocks={pageBlocks}>
              <h2 style={{ fontSize: "10pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: accentColor, marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>Executive Summary</span>
                <span style={{ height: "2px", flexGrow: 1, background: "#cbd5e1" }} />
              </h2>
            </ResumeBlock>
            <ResumeBlock id="sec-summary-body" type="item" pageBlocks={pageBlocks}>
              <p style={{ fontSize: "9.5pt", lineHeight: 1.6, color: "#334155" }}>
                {summary}
              </p>
            </ResumeBlock>
          </section>
        )}

        {/* Experience */}
        {hasExperience(data) && (
          <section>
            <ResumeBlock id="sec-experience-head" type="heading" headingFor="experience" pageBlocks={pageBlocks}>
              <h2 style={{ fontSize: "10pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: accentColor, marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>Executive Experience</span>
                <span style={{ height: "2px", flexGrow: 1, background: "#cbd5e1" }} />
              </h2>
            </ResumeBlock>
            {experience.map((exp, idx) => (
              <ResumeBlock key={exp.id || idx} id={`exp-${exp.id || idx}`} type="item" pageBlocks={pageBlocks} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: "10pt", color: "#0f172a" }}>{exp.role}</span>
                    {exp.company && <span style={{ color: "#475569", fontWeight: 600 }}> — {exp.company}</span>}
                  </div>
                  {exp.duration && <span style={{ fontSize: "8.5pt", color: "#64748b", fontWeight: 600 }}>{exp.duration}</span>}
                </div>
                {exp.bullets && exp.bullets.filter((b) => b && b.trim()).length > 0 && (
                  <ul style={{ marginTop: "3px", paddingLeft: "16px", fontSize: "9pt", lineHeight: 1.55, color: "#334155" }}>
                    {exp.bullets.filter((b) => b && b.trim()).map((b, bi) => (
                      <li key={bi} style={{ marginBottom: "2px" }}>{b}</li>
                    ))}
                  </ul>
                )}
              </ResumeBlock>
            ))}
          </section>
        )}

        {/* Key Projects */}
        {hasProjects(data) && (
          <section>
            <ResumeBlock id="sec-projects-head" type="heading" headingFor="projects" pageBlocks={pageBlocks}>
              <h2 style={{ fontSize: "10pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: accentColor, marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>Strategic Initiatives & Projects</span>
                <span style={{ height: "2px", flexGrow: 1, background: "#cbd5e1" }} />
              </h2>
            </ResumeBlock>
            {projects.map((proj, idx) => (
              <ResumeBlock key={proj.id || idx} id={`proj-${proj.id || idx}`} type="item" pageBlocks={pageBlocks} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: "9.5pt", color: "#0f172a" }}>{proj.name}</span>
                    {proj.techStack && (
                      <span style={{ color: "#64748b", fontSize: "8.5pt", marginLeft: "6px", fontStyle: "italic" }}>
                        ({proj.techStack})
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "8.5pt", display: "flex", gap: "8px" }}>
                    {proj.liveLink?.trim() && (
                      <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" style={{ color: accentColor, textDecoration: "underline" }}>
                        View Link
                      </a>
                    )}
                  </div>
                </div>
                {proj.bullets && proj.bullets.filter((b) => b && b.trim()).length > 0 && (
                  <ul style={{ marginTop: "3px", paddingLeft: "16px", fontSize: "9pt", lineHeight: 1.55, color: "#334155" }}>
                    {proj.bullets.filter((b) => b && b.trim()).map((b, bi) => (
                      <li key={bi} style={{ marginBottom: "2px" }}>{b}</li>
                    ))}
                  </ul>
                )}
              </ResumeBlock>
            ))}
          </section>
        )}

        {/* Core Competencies & Skills */}
        {hasSkills(data) && (
          <section>
            <ResumeBlock id="sec-skills-head" type="heading" headingFor="skills" pageBlocks={pageBlocks}>
              <h2 style={{ fontSize: "10pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: accentColor, marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>Core Competencies & Skills</span>
                <span style={{ height: "2px", flexGrow: 1, background: "#cbd5e1" }} />
              </h2>
            </ResumeBlock>
            <ResumeBlock id="sec-skills-body" type="item" pageBlocks={pageBlocks}>
              <div style={{ fontSize: "9pt", lineHeight: 1.6, color: "#334155" }}>
                {skills.languages?.length > 0 && <div><strong>Technical Languages:</strong> {skills.languages.join(", ")}</div>}
                {skills.web?.length > 0 && <div><strong>Architectures & Frameworks:</strong> {skills.web.join(", ")}</div>}
                {skills.tools?.length > 0 && <div><strong>Cloud & Operations:</strong> {skills.tools.join(", ")}</div>}
              </div>
            </ResumeBlock>
          </section>
        )}

        {/* Education */}
        {hasEducation(data) && (
          <section>
            <ResumeBlock id="sec-education-head" type="heading" headingFor="education" pageBlocks={pageBlocks}>
              <h2 style={{ fontSize: "10pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: accentColor, marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>Education & Credentials</span>
                <span style={{ height: "2px", flexGrow: 1, background: "#cbd5e1" }} />
              </h2>
            </ResumeBlock>
            {education.map((edu, idx) => (
              <ResumeBlock key={edu.id || idx} id={`edu-${edu.id || idx}`} type="item" pageBlocks={pageBlocks} style={{ marginBottom: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: "9.5pt" }}>{edu.college}</span>
                    {(edu.degree || edu.branch) && (
                      <span style={{ color: "#475569" }}> — {[edu.degree, edu.branch].filter(Boolean).join(", ")}</span>
                    )}
                  </div>
                  {(edu.startYear || edu.endYear) && (
                    <span style={{ color: "#64748b", fontSize: "8.5pt", fontWeight: 500 }}>
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
