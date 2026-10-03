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

export default function AcademicCV({
  data,
  accentColor = "#831843",
  pageBlocks,
  pageIndex = 0,
  totalPages = 1,
  isLightContent = false,
}) {
  const { personalInfo = {}, links = [], summary, education = [], skills = {}, projects = [], experience = [] } = data;
  const activeOptional = data.activeOptional || [];

  return (
    <div
      className="resume-tpl tpl-academic"
      style={{
        color: "#1f2937",
        backgroundColor: "#ffffff",
        minHeight: "100%",
        padding: "32px 38px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'EB Garamond', Garamond, 'Times New Roman', serif",
      }}
    >
      {/* Formal Academic Header (Page 1 only) */}
      {pageIndex === 0 && (
        <ResumeBlock id="header" type="header" pageBlocks={pageBlocks} style={{ textAlign: "center", marginBottom: "16px", borderBottom: `2px solid ${accentColor}`, paddingBottom: "10px" }}>
          <h1 style={{ fontSize: "24pt", fontWeight: 700, margin: 0, color: "#111827", letterSpacing: "0.5px" }}>
            {personalInfo.fullName || "Curriculum Vitae"}
          </h1>
          {personalInfo.headline && (
            <p style={{ fontSize: "11pt", fontStyle: "italic", color: accentColor, marginTop: "2px", marginBottom: "8px" }}>
              {personalInfo.headline}
            </p>
          )}
          <ContactLine
            personalInfo={personalInfo}
            links={links}
            separator="   ·   "
            className="resume-contact-row text-[9.5pt] justify-center"
            textColor="#374151"
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
        {/* Summary / Research Statement */}
        {hasSummary(data) && (
          <section>
            <ResumeBlock id="sec-summary-head" type="heading" headingFor="summary" pageBlocks={pageBlocks}>
              <h2 style={{ fontSize: "11pt", fontWeight: 700, textTransform: "uppercase", color: accentColor, margin: "0 0 6px 0", borderBottom: "1px solid #d1d5db", paddingBottom: "2px" }}>
                Research Statement & Profile
              </h2>
            </ResumeBlock>
            <ResumeBlock id="sec-summary-body" type="item" pageBlocks={pageBlocks}>
              <p style={{ fontSize: "10pt", lineHeight: 1.6, color: "#374151", margin: 0 }}>
                {summary}
              </p>
            </ResumeBlock>
          </section>
        )}

        {/* 1. Education FIRST */}
        {hasEducation(data) && (
          <section>
            <ResumeBlock id="sec-education-head" type="heading" headingFor="education" pageBlocks={pageBlocks}>
              <h2 style={{ fontSize: "11pt", fontWeight: 700, textTransform: "uppercase", color: accentColor, margin: "0 0 8px 0", borderBottom: "1px solid #d1d5db", paddingBottom: "2px" }}>
                Education
              </h2>
            </ResumeBlock>
            {education.map((edu, idx) => (
              <ResumeBlock key={edu.id || idx} id={`edu-${edu.id || idx}`} type="item" pageBlocks={pageBlocks} style={{ marginBottom: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: "10.5pt", color: "#111827" }}>{edu.college}</span>
                    {(edu.degree || edu.branch) && (
                      <span style={{ fontStyle: "italic", color: "#4b5563" }}> — {[edu.degree, edu.branch].filter(Boolean).join(", ")}</span>
                    )}
                  </div>
                  {(edu.startYear || edu.endYear) && (
                    <span style={{ color: "#6b7280", fontSize: "9pt" }}>
                      {[edu.startYear, edu.endYear].filter(Boolean).join(" – ")}
                    </span>
                  )}
                </div>
                {edu.cgpa && <div style={{ fontSize: "9pt", color: "#6b7280", fontStyle: "italic" }}>Cumulative GPA: {edu.cgpa}</div>}
              </ResumeBlock>
            ))}
          </section>
        )}

        {/* 2. Publications / Research / Open Source */}
        {activeOptional.includes("publications") && (
          <RenderOptionalSection
            sectionId="publications"
            data={data}
            accentColor={accentColor}
            headingClass="text-[11pt] font-bold uppercase tracking-wider mb-2 border-b pb-1"
            pageBlocks={pageBlocks}
          />
        )}

        {activeOptional.includes("opensource") && (
          <RenderOptionalSection
            sectionId="opensource"
            data={data}
            accentColor={accentColor}
            headingClass="text-[11pt] font-bold uppercase tracking-wider mb-2 border-b pb-1"
            pageBlocks={pageBlocks}
          />
        )}

        {/* 3. Academic & Work Experience */}
        {hasExperience(data) && (
          <section>
            <ResumeBlock id="sec-experience-head" type="heading" headingFor="experience" pageBlocks={pageBlocks}>
              <h2 style={{ fontSize: "11pt", fontWeight: 700, textTransform: "uppercase", color: accentColor, margin: "0 0 8px 0", borderBottom: "1px solid #d1d5db", paddingBottom: "2px" }}>
                Academic & Professional Appointments
              </h2>
            </ResumeBlock>
            {experience.map((exp, idx) => (
              <ResumeBlock key={exp.id || idx} id={`exp-${exp.id || idx}`} type="item" pageBlocks={pageBlocks} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: "10.5pt", color: "#111827" }}>{exp.role}</span>
                    {exp.company && <span style={{ fontStyle: "italic", color: "#4b5563" }}>, {exp.company}</span>}
                  </div>
                  {exp.duration && <span style={{ fontSize: "9pt", color: "#6b7280" }}>{exp.duration}</span>}
                </div>
                {exp.bullets && exp.bullets.filter((b) => b && b.trim()).length > 0 && (
                  <ul style={{ margin: "3px 0 0 0", paddingLeft: "18px", fontSize: "9.5pt", lineHeight: 1.55, color: "#374151" }}>
                    {exp.bullets.filter((b) => b && b.trim()).map((b, bi) => (
                      <li key={bi} style={{ marginBottom: "2px" }}>{b}</li>
                    ))}
                  </ul>
                )}
              </ResumeBlock>
            ))}
          </section>
        )}

        {/* 4. Research Projects */}
        {hasProjects(data) && (
          <section>
            <ResumeBlock id="sec-projects-head" type="heading" headingFor="projects" pageBlocks={pageBlocks}>
              <h2 style={{ fontSize: "11pt", fontWeight: 700, textTransform: "uppercase", color: accentColor, margin: "0 0 8px 0", borderBottom: "1px solid #d1d5db", paddingBottom: "2px" }}>
                Research & Technical Projects
              </h2>
            </ResumeBlock>
            {projects.map((proj, idx) => (
              <ResumeBlock key={proj.id || idx} id={`proj-${proj.id || idx}`} type="item" pageBlocks={pageBlocks} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: "10.5pt", color: "#111827" }}>{proj.name}</span>
                    {proj.techStack && <span style={{ fontStyle: "italic", color: "#6b7280", marginLeft: "4px" }}>({proj.techStack})</span>}
                  </div>
                </div>
                {proj.bullets && proj.bullets.filter((b) => b && b.trim()).length > 0 && (
                  <ul style={{ margin: "3px 0 0 0", paddingLeft: "18px", fontSize: "9.5pt", lineHeight: 1.55, color: "#374151" }}>
                    {proj.bullets.filter((b) => b && b.trim()).map((b, bi) => (
                      <li key={bi} style={{ marginBottom: "2px" }}>{b}</li>
                    ))}
                  </ul>
                )}
              </ResumeBlock>
            ))}
          </section>
        )}

        {/* 5. Technical & Language Skills */}
        {hasSkills(data) && (
          <section>
            <ResumeBlock id="sec-skills-head" type="heading" headingFor="skills" pageBlocks={pageBlocks}>
              <h2 style={{ fontSize: "11pt", fontWeight: 700, textTransform: "uppercase", color: accentColor, margin: "0 0 6px 0", borderBottom: "1px solid #d1d5db", paddingBottom: "2px" }}>
                Technical & Research Competencies
              </h2>
            </ResumeBlock>
            <ResumeBlock id="sec-skills-body" type="item" pageBlocks={pageBlocks}>
              <div style={{ fontSize: "9.5pt", lineHeight: 1.6, color: "#374151" }}>
                {skills.languages?.length > 0 && <div><strong>Programming & Analysis:</strong> {skills.languages.join(", ")}</div>}
                {skills.web?.length > 0 && <div><strong>Frameworks & Tools:</strong> {skills.web.join(", ")}</div>}
                {skills.tools?.length > 0 && <div><strong>Platforms & Hardware:</strong> {skills.tools.join(", ")}</div>}
              </div>
            </ResumeBlock>
          </section>
        )}

        {/* Other Optional Sections */}
        {activeOptional
          .filter((id) => !["publications", "opensource"].includes(id))
          .map((secId) => (
            <RenderOptionalSection
              key={secId}
              sectionId={secId}
              data={data}
              accentColor={accentColor}
              headingClass="text-[11pt] font-bold uppercase tracking-wider mb-2 border-b pb-1"
              pageBlocks={pageBlocks}
            />
          ))}
      </div>
    </div>
  );
}
