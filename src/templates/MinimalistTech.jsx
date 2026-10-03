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

export default function MinimalistTech({
  data,
  accentColor = "#0f766e",
  pageBlocks,
  pageIndex = 0,
  totalPages = 1,
  isLightContent = false,
}) {
  const { personalInfo = {}, links = [], summary, education = [], skills = {}, projects = [], experience = [] } = data;
  const activeOptional = data.activeOptional || [];

  return (
    <div
      className="resume-tpl tpl-tech"
      style={{
        color: "#0f172a",
        backgroundColor: "#ffffff",
        minHeight: "100%",
        padding: "32px 36px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--resume-font-family)",
      }}
    >
      {/* Terminal-inspired Header */}
      {pageIndex === 0 && (
        <ResumeBlock id="header" type="header" pageBlocks={pageBlocks} style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontFamily: "monospace", color: accentColor, fontWeight: 700, fontSize: "14pt" }}>&gt;</span>
                <h1 style={{ fontSize: "20pt", fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>
                  {personalInfo.fullName || "alex.dev"}
                </h1>
              </div>
              {personalInfo.headline && (
                <p style={{ fontFamily: "monospace", fontSize: "9pt", color: "#64748b", marginTop: "3px", marginBottom: 0 }}>
                  // {personalInfo.headline}
                </p>
              )}
            </div>
            <div style={{ fontFamily: "monospace", fontSize: "8pt", background: "#f1f5f9", padding: "4px 8px", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
              status: open_for_opportunities
            </div>
          </div>

          <div style={{ marginTop: "10px", paddingTop: "8px", borderTop: "1px dashed #cbd5e1" }}>
            <ContactLine
              personalInfo={personalInfo}
              links={links}
              separator=" // "
              className="resume-contact-row text-[8.5pt]"
              textColor="#475569"
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
          gap: isLightContent ? "22px" : "16px",
          flexGrow: isLightContent ? 1 : "initial",
          justifyContent: isLightContent ? "space-between" : "flex-start",
        }}
      >
        {/* Summary */}
        {hasSummary(data) && (
          <section>
            <ResumeBlock id="sec-summary-head" type="heading" headingFor="summary" pageBlocks={pageBlocks}>
              <h2 style={{ fontSize: "9.5pt", fontFamily: "monospace", fontWeight: 700, color: accentColor, marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                <span>$ cat summary.md</span>
                <span style={{ height: "1px", flexGrow: 1, background: "#e2e8f0" }} />
              </h2>
            </ResumeBlock>
            <ResumeBlock id="sec-summary-body" type="item" pageBlocks={pageBlocks}>
              <p style={{ fontSize: "9pt", lineHeight: 1.55, color: "#334155" }}>
                {summary}
              </p>
            </ResumeBlock>
          </section>
        )}

        {/* Technical Skills with Inline Badges */}
        {hasSkills(data) && (
          <section>
            <ResumeBlock id="sec-skills-head" type="heading" headingFor="skills" pageBlocks={pageBlocks}>
              <h2 style={{ fontSize: "9.5pt", fontFamily: "monospace", fontWeight: 700, color: accentColor, marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                <span>$ stack --inspect</span>
                <span style={{ height: "1px", flexGrow: 1, background: "#e2e8f0" }} />
              </h2>
            </ResumeBlock>
            <ResumeBlock id="sec-skills-body" type="item" pageBlocks={pageBlocks}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "8px", fontSize: "8.5pt" }}>
                {skills.languages?.length > 0 && (
                  <div>
                    <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#475569" }}>languages: </span>
                    <span style={{ display: "inline-flex", flexWrap: "wrap", gap: "4px" }}>
                      {skills.languages.map((l, i) => (
                        <span key={i} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "1px 5px", borderRadius: "3px", fontFamily: "monospace", fontSize: "7.5pt" }}>{l}</span>
                      ))}
                    </span>
                  </div>
                )}
                {skills.web?.length > 0 && (
                  <div>
                    <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#475569" }}>frameworks: </span>
                    <span style={{ display: "inline-flex", flexWrap: "wrap", gap: "4px" }}>
                      {skills.web.map((w, i) => (
                        <span key={i} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "1px 5px", borderRadius: "3px", fontFamily: "monospace", fontSize: "7.5pt" }}>{w}</span>
                      ))}
                    </span>
                  </div>
                )}
                {skills.databases?.length > 0 && (
                  <div>
                    <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#475569" }}>databases: </span>
                    <span style={{ display: "inline-flex", flexWrap: "wrap", gap: "4px" }}>
                      {skills.databases.map((d, i) => (
                        <span key={i} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "1px 5px", borderRadius: "3px", fontFamily: "monospace", fontSize: "7.5pt" }}>{d}</span>
                      ))}
                    </span>
                  </div>
                )}
                {skills.tools?.length > 0 && (
                  <div>
                    <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#475569" }}>tools_infra: </span>
                    <span style={{ display: "inline-flex", flexWrap: "wrap", gap: "4px" }}>
                      {skills.tools.map((t, i) => (
                        <span key={i} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "1px 5px", borderRadius: "3px", fontFamily: "monospace", fontSize: "7.5pt" }}>{t}</span>
                      ))}
                    </span>
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
              <h2 style={{ fontSize: "9.5pt", fontFamily: "monospace", fontWeight: 700, color: accentColor, marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                <span>$ git log --experience</span>
                <span style={{ height: "1px", flexGrow: 1, background: "#e2e8f0" }} />
              </h2>
            </ResumeBlock>
            {experience.map((exp, idx) => (
              <ResumeBlock key={exp.id || idx} id={`exp-${exp.id || idx}`} type="item" pageBlocks={pageBlocks} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: "9.5pt", color: "#0f172a" }}>{exp.role}</span>
                    {exp.company && <span style={{ color: "#475569", marginLeft: "4px" }}>@ {exp.company}</span>}
                  </div>
                  {exp.duration && <span style={{ fontFamily: "monospace", fontSize: "8pt", color: "#64748b" }}>[{exp.duration}]</span>}
                </div>
                {exp.bullets && exp.bullets.filter((b) => b && b.trim()).length > 0 && (
                  <ul style={{ marginTop: "3px", paddingLeft: "16px", fontSize: "8.5pt", lineHeight: 1.5, color: "#334155" }}>
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
              <h2 style={{ fontSize: "9.5pt", fontFamily: "monospace", fontWeight: 700, color: accentColor, marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                <span>$ ls ./repositories</span>
                <span style={{ height: "1px", flexGrow: 1, background: "#e2e8f0" }} />
              </h2>
            </ResumeBlock>
            {projects.map((proj, idx) => (
              <ResumeBlock key={proj.id || idx} id={`proj-${proj.id || idx}`} type="item" pageBlocks={pageBlocks} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: "9.5pt", color: "#0f172a" }}>{proj.name}</span>
                    {proj.techStack && (
                      <span style={{ fontFamily: "monospace", color: accentColor, fontSize: "7.5pt", marginLeft: "6px", background: "#f0fdfa", padding: "1px 4px", borderRadius: "3px", border: "1px solid #ccfbf1" }}>
                        {proj.techStack}
                      </span>
                    )}
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: "8pt", display: "flex", gap: "8px" }}>
                    {proj.liveLink?.trim() && (
                      <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" style={{ color: accentColor, textDecoration: "underline" }}>
                        [live]
                      </a>
                    )}
                    {proj.githubLink?.trim() && (
                      <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" style={{ color: accentColor, textDecoration: "underline" }}>
                        [src]
                      </a>
                    )}
                  </div>
                </div>
                {proj.bullets && proj.bullets.filter((b) => b && b.trim()).length > 0 && (
                  <ul style={{ marginTop: "3px", paddingLeft: "16px", fontSize: "8.5pt", lineHeight: 1.5, color: "#334155" }}>
                    {proj.bullets.filter((b) => b && b.trim()).map((b, bi) => (
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
              <h2 style={{ fontSize: "9.5pt", fontFamily: "monospace", fontWeight: 700, color: accentColor, marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                <span>$ cat education.txt</span>
                <span style={{ height: "1px", flexGrow: 1, background: "#e2e8f0" }} />
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
                    <span style={{ fontFamily: "monospace", color: "#64748b", fontSize: "8pt" }}>
                      {[edu.startYear, edu.endYear].filter(Boolean).join(" – ")}
                    </span>
                  )}
                </div>
                {edu.cgpa && <div style={{ fontSize: "8pt", color: "#64748b", fontFamily: "monospace" }}>GPA: {edu.cgpa}</div>}
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
            headingClass="text-[9.5pt] font-mono font-bold mb-2 border-b pb-1"
            pageBlocks={pageBlocks}
          />
        ))}
      </div>
    </div>
  );
}
