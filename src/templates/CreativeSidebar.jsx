import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import {
  getValidLinks,
  getLinkLabel,
  getLinkIcon,
  hasSummary,
  hasExperience,
  hasProjects,
  hasEducation,
  hasSkills,
} from "../components/templates/templateUtils";
import { RenderOptionalSection } from "../components/templates/OptionalSectionsRenderer";
import { ResumeBlock } from "../components/templates/ResumeBlock";

export default function CreativeSidebar({
  data,
  accentColor = "#ea580c",
  pageBlocks,
  pageIndex = 0,
  totalPages = 1,
  isLightContent = false,
}) {
  const { personalInfo = {}, links = [], summary, education = [], skills = {}, projects = [], experience = [] } = data;
  const activeOptional = data.activeOptional || [];
  const validLinks = getValidLinks(links);
  const hasPhoto = Boolean(data.showPhoto && data.photo);

  return (
    <div
      className="resume-tpl tpl-creative-sidebar"
      style={{
        color: "#1e293b",
        backgroundColor: "#ffffff",
        minHeight: "100%",
        display: "grid",
        gridTemplateColumns: "260px 1fr",
        boxSizing: "border-box",
      }}
    >
      {/* Orange Gradient Sidebar */}
      <aside
        style={{
          background: `linear-gradient(180deg, ${accentColor || "#ea580c"} 0%, #c2410c 55%, #18181b 100%)`,
          color: "#ffffff",
          padding: "28px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          boxSizing: "border-box",
        }}
      >
        {/* Top of Sidebar: Photo (if enabled). Without photo: show nothing and re-flow sidebar */}
        {pageIndex === 0 ? (
          <div>
            {hasPhoto && (
              <div style={{ marginBottom: "16px", display: "flex", justifyContent: "center" }}>
                <img
                  src={data.photo}
                  crossOrigin="anonymous"
                  alt={personalInfo.fullName || "Profile"}
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: data.photoShape === "square" ? "14px" : "50%",
                    border: "4px solid #ffffff",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
                    display: "block",
                  }}
                />
              </div>
            )}

            <div style={{ textAlign: "center", marginBottom: "8px" }}>
              {personalInfo.fullName && (
                <h1 style={{ fontSize: "19pt", fontWeight: 800, margin: 0, color: "#ffffff", letterSpacing: "-0.5px" }}>
                  {personalInfo.fullName}
                </h1>
              )}
              {personalInfo.headline && (
                <p style={{ fontSize: "9.5pt", color: "rgba(255,255,255,0.85)", marginTop: "4px", marginBottom: 0, fontWeight: 500 }}>
                  {personalInfo.headline}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div>
            <span style={{ fontSize: "11pt", fontWeight: 800, color: "#ffffff" }}>{personalInfo.fullName}</span>
            <p style={{ fontSize: "8pt", color: "rgba(255,255,255,0.7)" }}>Page {pageIndex + 1} of {totalPages}</p>
          </div>
        )}

        {/* Contact Information with Lucide Line Icons */}
        {pageIndex === 0 && (
          <div>
            <h2 style={{ fontSize: "8.5pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.9)", borderBottom: "1px solid rgba(255,255,255,0.25)", paddingBottom: "3px", marginBottom: "8px" }}>
              Contact
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "8.5pt", color: "rgba(255,255,255,0.9)" }}>
              {personalInfo.email?.trim() && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Mail size={14} style={{ flexShrink: 0, opacity: 0.9 }} />
                  <a href={`mailto:${personalInfo.email.trim()}`} style={{ color: "#ffffff", wordBreak: "break-all" }}>
                    {personalInfo.email.trim()}
                  </a>
                </div>
              )}
              {personalInfo.phone?.trim() && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Phone size={14} style={{ flexShrink: 0, opacity: 0.9 }} />
                  <span>{personalInfo.phone.trim()}</span>
                </div>
              )}
              {personalInfo.city?.trim() && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <MapPin size={14} style={{ flexShrink: 0, opacity: 0.9 }} />
                  <span>{personalInfo.city.trim()}</span>
                </div>
              )}
              {validLinks.map((link) => (
                <div key={link.id} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {getLinkIcon(link, 14)}
                  <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: "#ffffff", textDecoration: "underline" }}>
                    {getLinkLabel(link)}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills in Sidebar (Page 1) */}
        {pageIndex === 0 && hasSkills(data) && (
          <div>
            <h2 style={{ fontSize: "8.5pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.9)", borderBottom: "1px solid rgba(255,255,255,0.25)", paddingBottom: "3px", marginBottom: "8px" }}>
              Skills & Expertise
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {Object.entries(skills).map(([grp, list]) =>
                list && list.length > 0 ? (
                  <div key={grp}>
                    <div style={{ fontSize: "7.5pt", textTransform: "uppercase", color: "rgba(255,255,255,0.75)", marginBottom: "3px", letterSpacing: "0.05em", fontWeight: 600 }}>
                      {grp}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {list.map((tag, i) => (
                        <span key={i} style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#ffffff", fontSize: "7.5pt", padding: "1px 6px", borderRadius: "4px", fontWeight: 500 }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </div>
        )}

        {/* Education in Sidebar (Page 1) */}
        {pageIndex === 0 && hasEducation(data) && (
          <div>
            <h2 style={{ fontSize: "8.5pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.9)", borderBottom: "1px solid rgba(255,255,255,0.25)", paddingBottom: "3px", marginBottom: "8px" }}>
              Education
            </h2>
            {education.map((edu, idx) => (
              <div key={edu.id || idx} style={{ marginBottom: "8px", fontSize: "8.5pt", breakInside: "avoid" }}>
                <div style={{ fontWeight: 700, color: "#ffffff" }}>{edu.college}</div>
                <div style={{ color: "rgba(255,255,255,0.85)" }}>{[edu.degree, edu.branch].filter(Boolean).join(", ")}</div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "8pt" }}>
                  {[edu.startYear, edu.endYear].filter(Boolean).join(" – ")}
                  {edu.cgpa && ` · GPA: ${edu.cgpa}`}
                </div>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* Main Column with 24px spacing between sections */}
      <main
        style={{
          padding: "28px 28px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          justifyContent: isLightContent ? "space-between" : "flex-start",
          flexGrow: 1,
          boxSizing: "border-box",
        }}
      >
        {/* Professional Summary */}
        {hasSummary(data) && (
          <section style={{ breakInside: "avoid" }}>
            <ResumeBlock id="sec-summary-head" type="heading" headingFor="summary" pageBlocks={pageBlocks}>
              <h2 style={{ fontSize: "10pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: accentColor || "#ea580c", margin: "0 0 6px 0", borderBottom: `1.5px solid ${accentColor || "#ea580c"}30`, paddingBottom: "3px" }}>
                About Me
              </h2>
            </ResumeBlock>
            <ResumeBlock id="sec-summary-body" type="item" pageBlocks={pageBlocks}>
              <p style={{ fontSize: "9pt", lineHeight: 1.6, color: "#334155", margin: 0 }}>
                {summary}
              </p>
            </ResumeBlock>
          </section>
        )}

        {/* Work Experience */}
        {hasExperience(data) && (
          <section>
            <ResumeBlock id="sec-experience-head" type="heading" headingFor="experience" pageBlocks={pageBlocks}>
              <h2 style={{ fontSize: "10pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: accentColor || "#ea580c", margin: "0 0 8px 0", borderBottom: `1.5px solid ${accentColor || "#ea580c"}30`, paddingBottom: "3px" }}>
                Work Experience
              </h2>
            </ResumeBlock>
            {experience.map((exp, idx) => (
              <ResumeBlock key={exp.id || idx} id={`exp-${exp.id || idx}`} type="item" pageBlocks={pageBlocks} style={{ marginBottom: "12px", breakInside: "avoid" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: "9.5pt", color: "#0f172a" }}>{exp.role}</span>
                    {exp.company && <span style={{ color: "#64748b", fontWeight: 600, marginLeft: "4px" }}>• {exp.company}</span>}
                  </div>
                  {exp.duration && <span style={{ fontSize: "8pt", color: "#64748b", fontWeight: 500 }}>{exp.duration}</span>}
                </div>
                {exp.bullets && exp.bullets.filter((b) => b && b.trim()).length > 0 && (
                  <ul style={{ marginTop: "3px", paddingLeft: "16px", fontSize: "8.5pt", lineHeight: 1.55, color: "#334155" }}>
                    {exp.bullets.filter((b) => b && b.trim()).map((bullet, i) => (
                      <li key={i} style={{ marginBottom: "2px" }}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </ResumeBlock>
            ))}
          </section>
        )}

        {/* Featured Projects */}
        {hasProjects(data) && (
          <section>
            <ResumeBlock id="sec-projects-head" type="heading" headingFor="projects" pageBlocks={pageBlocks}>
              <h2 style={{ fontSize: "10pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: accentColor || "#ea580c", margin: "0 0 8px 0", borderBottom: `1.5px solid ${accentColor || "#ea580c"}30`, paddingBottom: "3px" }}>
                Featured Projects
              </h2>
            </ResumeBlock>
            {projects.map((proj, idx) => (
              <ResumeBlock key={proj.id || idx} id={`proj-${proj.id || idx}`} type="item" pageBlocks={pageBlocks} style={{ marginBottom: "10px", breakInside: "avoid" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: "9.5pt", color: "#0f172a" }}>{proj.name}</span>
                    {proj.techStack && (
                      <span style={{ color: "#64748b", fontSize: "8pt", marginLeft: "6px", fontStyle: "italic" }}>
                        ({proj.techStack})
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "8pt", display: "flex", gap: "6px" }}>
                    {proj.liveLink?.trim() && (
                      <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" style={{ color: accentColor || "#ea580c", textDecoration: "underline" }}>
                        Live Demo
                      </a>
                    )}
                    {proj.githubLink?.trim() && (
                      <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" style={{ color: accentColor || "#ea580c", textDecoration: "underline" }}>
                        Source
                      </a>
                    )}
                  </div>
                </div>
                {proj.bullets && proj.bullets.filter((b) => b && b.trim()).length > 0 && (
                  <ul style={{ marginTop: "3px", paddingLeft: "16px", fontSize: "8.5pt", lineHeight: 1.55, color: "#334155" }}>
                    {proj.bullets.filter((b) => b && b.trim()).map((bullet, i) => (
                      <li key={i} style={{ marginBottom: "2px" }}>{bullet}</li>
                    ))}
                  </ul>
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
            accentColor={accentColor || "#ea580c"}
            headingClass="text-[10pt] font-extrabold uppercase tracking-wider mb-2 border-b pb-1"
            pageBlocks={pageBlocks}
          />
        ))}
      </main>
    </div>
  );
}
