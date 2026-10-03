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

export default function ModernSplitTwoColumn({
  data,
  accentColor = "#1e3a5f",
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
      className="resume-tpl tpl-modern"
      style={{
        color: "#1e293b",
        backgroundColor: "#ffffff",
        minHeight: "100%",
        display: "grid",
        gridTemplateColumns: "250px 1fr",
        boxSizing: "border-box",
      }}
    >
      {/* Sidebar: contact, skills, education, languages */}
      <aside
        style={{
          backgroundColor: "#f8fafc",
          borderRight: "1px solid #e2e8f0",
          padding: "28px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          boxSizing: "border-box",
        }}
      >
        {/* Profile photo (if supported & enabled, Page 1 only) */}
        {pageIndex === 0 && showPhoto && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "6px" }}>
            <img
              src={data.photo}
              alt={personalInfo.fullName || "Profile"}
              style={{
                width: "120px",
                height: "120px",
                borderRadius: data.photoShape === "square" ? "8px" : "9999px",
                objectFit: "cover",
                border: `3px solid ${accentColor}`,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
          </div>
        )}

        {/* Sidebar Mini Header if Page 2+ */}
        {pageIndex > 0 ? (
          <div>
            <span style={{ fontSize: "11pt", fontWeight: 800, color: accentColor }}>
              {personalInfo.fullName}
            </span>
            <p style={{ fontSize: "8pt", color: "#64748b" }}>Page {pageIndex + 1} of {totalPages}</p>
          </div>
        ) : (
          <div>
            {/* Contact Details in Sidebar */}
            <h3 style={{ fontSize: "8.5pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: accentColor, marginBottom: "8px", borderBottom: `1.5px solid ${accentColor}`, paddingBottom: "3px" }}>
              Contact
            </h3>
            <ContactLine
              personalInfo={personalInfo}
              links={links}
              separator="<br/>"
              className="resume-contact-column text-[8.5pt]"
              textColor="#334155"
              iconSize={13}
            />
          </div>
        )}

        {/* Skills in Sidebar (Page 1) */}
        {pageIndex === 0 && hasSkills(data) && (
          <div>
            <h3 style={{ fontSize: "8.5pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: accentColor, marginBottom: "8px", borderBottom: `1.5px solid ${accentColor}`, paddingBottom: "3px" }}>
              Expertise & Skills
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "8.5pt" }}>
              {skills.languages?.length > 0 && (
                <div>
                  <strong style={{ color: "#0f172a" }}>Languages</strong>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "3px" }}>
                    {skills.languages.map((s, i) => (
                      <span key={i} style={{ background: "#e2e8f0", padding: "1px 6px", borderRadius: "4px", fontSize: "8pt" }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {skills.web?.length > 0 && (
                <div>
                  <strong style={{ color: "#0f172a" }}>Frameworks</strong>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "3px" }}>
                    {skills.web.map((s, i) => (
                      <span key={i} style={{ background: "#e2e8f0", padding: "1px 6px", borderRadius: "4px", fontSize: "8pt" }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {skills.databases?.length > 0 && (
                <div>
                  <strong style={{ color: "#0f172a" }}>Databases</strong>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "3px" }}>
                    {skills.databases.map((s, i) => (
                      <span key={i} style={{ background: "#e2e8f0", padding: "1px 6px", borderRadius: "4px", fontSize: "8pt" }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {skills.tools?.length > 0 && (
                <div>
                  <strong style={{ color: "#0f172a" }}>Tools</strong>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "3px" }}>
                    {skills.tools.map((s, i) => (
                      <span key={i} style={{ background: "#e2e8f0", padding: "1px 6px", borderRadius: "4px", fontSize: "8pt" }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Education in Sidebar (Page 1) */}
        {pageIndex === 0 && hasEducation(data) && (
          <div>
            <h3 style={{ fontSize: "8.5pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: accentColor, marginBottom: "8px", borderBottom: `1.5px solid ${accentColor}`, paddingBottom: "3px" }}>
              Education
            </h3>
            {education.map((edu, idx) => (
              <div key={edu.id || idx} style={{ marginBottom: "8px", fontSize: "8.5pt" }}>
                <div style={{ fontWeight: 700, color: "#0f172a" }}>{edu.college}</div>
                <div style={{ color: "#475569" }}>{[edu.degree, edu.branch].filter(Boolean).join(", ")}</div>
                <div style={{ color: "#64748b", fontSize: "8pt" }}>
                  {[edu.startYear, edu.endYear].filter(Boolean).join(" – ")}
                </div>
                {edu.cgpa && <div style={{ color: "#64748b", fontSize: "8pt" }}>GPA: {edu.cgpa}</div>}
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* Main Area: paginated experience, projects, summary, certifications */}
      <main
        style={{
          padding: "28px 28px",
          display: "flex",
          flexDirection: "column",
          gap: isLightContent ? "24px" : "18px",
          justifyContent: isLightContent ? "space-between" : "flex-start",
          flexGrow: 1,
          boxSizing: "border-box",
        }}
      >
        {/* Name and headline (Page 1 only) */}
        {pageIndex === 0 && (
          <ResumeBlock id="header" type="header" pageBlocks={pageBlocks} style={{ marginBottom: "4px" }}>
            <h1 style={{ fontSize: "22pt", fontWeight: 900, color: accentColor, margin: 0, letterSpacing: "-0.5px" }}>
              {personalInfo.fullName || "Your Name"}
            </h1>
            {personalInfo.headline && (
              <p style={{ fontSize: "10.5pt", color: "#64748b", fontWeight: 500, marginTop: "2px", marginBottom: 0 }}>
                {personalInfo.headline}
              </p>
            )}
          </ResumeBlock>
        )}

        {/* Summary */}
        {hasSummary(data) && (
          <section>
            <ResumeBlock id="sec-summary-head" type="heading" headingFor="summary" pageBlocks={pageBlocks}>
              <h2 style={{ fontSize: "10pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: accentColor, marginBottom: "6px", borderBottom: "1px solid #e2e8f0", paddingBottom: "2px" }}>
                Executive Summary
              </h2>
            </ResumeBlock>
            <ResumeBlock id="sec-summary-body" type="item" pageBlocks={pageBlocks}>
              <p style={{ fontSize: "9pt", lineHeight: 1.55, color: "#334155" }}>
                {summary}
              </p>
            </ResumeBlock>
          </section>
        )}

        {/* Experience */}
        {hasExperience(data) && (
          <section>
            <ResumeBlock id="sec-experience-head" type="heading" headingFor="experience" pageBlocks={pageBlocks}>
              <h2 style={{ fontSize: "10pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: accentColor, marginBottom: "8px", borderBottom: "1px solid #e2e8f0", paddingBottom: "2px" }}>
                Work Experience
              </h2>
            </ResumeBlock>
            {experience.map((exp, idx) => (
              <ResumeBlock key={exp.id || idx} id={`exp-${exp.id || idx}`} type="item" pageBlocks={pageBlocks} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: "9.5pt", color: "#0f172a" }}>{exp.role}</span>
                    {exp.company && <span style={{ color: "#64748b", marginLeft: "4px" }}>| {exp.company}</span>}
                  </div>
                  {exp.duration && <span style={{ fontSize: "8pt", color: "#64748b", fontWeight: 500 }}>{exp.duration}</span>}
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
              <h2 style={{ fontSize: "10pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: accentColor, marginBottom: "8px", borderBottom: "1px solid #e2e8f0", paddingBottom: "2px" }}>
                Key Projects
              </h2>
            </ResumeBlock>
            {projects.map((proj, idx) => (
              <ResumeBlock key={proj.id || idx} id={`proj-${proj.id || idx}`} type="item" pageBlocks={pageBlocks} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: "9.5pt", color: "#0f172a" }}>{proj.name}</span>
                    {proj.techStack && (
                      <span style={{ color: "#64748b", fontSize: "8pt", marginLeft: "6px", fontStyle: "italic" }}>
                        ({proj.techStack})
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "8pt", display: "flex", gap: "6px" }}>
                    {proj.liveLink?.trim() && (
                      <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" style={{ color: accentColor, textDecoration: "underline" }}>
                        Demo
                      </a>
                    )}
                    {proj.githubLink?.trim() && (
                      <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" style={{ color: accentColor, textDecoration: "underline" }}>
                        Code
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

        {/* Optional Sections in Main Column */}
        {activeOptional.map((secId) => (
          <RenderOptionalSection
            key={secId}
            sectionId={secId}
            data={data}
            accentColor={accentColor}
            headingClass="text-[10pt] font-bold uppercase tracking-wider mb-2 border-b pb-1"
            pageBlocks={pageBlocks}
          />
        ))}
      </main>
    </div>
  );
}
