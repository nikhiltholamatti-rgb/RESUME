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
} from "./templateUtils";
import { RenderOptionalSection } from "./OptionalSectionsRenderer";

export default function ModernTwoColumn({ data, accentColor = "#1e3a5f" }) {
  const { personalInfo = {}, links = [], summary, education = [], skills = {}, projects = [], experience = [] } = data;
  const validLinks = getValidLinks(links);
  const hasPhoto = Boolean(data.showPhoto && data.photo);
  const activeOptional = data.activeOptional || [];

  return (
    <div className="resume-tpl tpl-modern" style={{ minHeight: "100%", background: "#fff" }}>
      {/* Left Sidebar */}
      <aside className="mod-sidebar" style={{ backgroundColor: accentColor, padding: "26px 18px", gap: "20px" }}>
        {/* Profile Photo: 150px, 4px white border, soft shadow */}
        {hasPhoto && (
          <div style={{ textAlign: "center", marginBottom: "4px", display: "flex", justifyContent: "center" }}>
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
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
                display: "block",
              }}
            />
          </div>
        )}

        {personalInfo.fullName && (
          <div>
            <h1 className="mod-name">{personalInfo.fullName}</h1>
            {personalInfo.headline && <p className="mod-headline" style={{ marginTop: "4px" }}>{personalInfo.headline}</p>}
          </div>
        )}

        {/* Contact info */}
        <div>
          <h2 className="mod-sec-title">Contact</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {personalInfo.email?.trim() && (
              <div className="mod-contact-item" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Mail size={14} style={{ flexShrink: 0, opacity: 0.9 }} />
                <a href={`mailto:${personalInfo.email.trim()}`} style={{ wordBreak: "break-all" }}>
                  {personalInfo.email.trim()}
                </a>
              </div>
            )}
            {personalInfo.phone?.trim() && (
              <div className="mod-contact-item" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Phone size={14} style={{ flexShrink: 0, opacity: 0.9 }} />
                <span>{personalInfo.phone.trim()}</span>
              </div>
            )}
            {personalInfo.city?.trim() && (
              <div className="mod-contact-item" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <MapPin size={14} style={{ flexShrink: 0, opacity: 0.9 }} />
                <span>{personalInfo.city.trim()}</span>
              </div>
            )}
            {validLinks.map((link) => (
              <div key={link.id} className="mod-contact-item" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {getLinkIcon(link, 14)}
                <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
                  {getLinkLabel(link)}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Education in Sidebar */}
        {hasEducation(data) && (
          <div>
            <h2 className="mod-sec-title">Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="mod-edu-item" style={{ marginBottom: "10px", breakInside: "avoid" }}>
                <div className="mod-edu-degree">{edu.degree || edu.college}</div>
                {edu.degree && edu.college && <div className="mod-edu-college">{edu.college}</div>}
                {edu.branch && <div className="mod-edu-meta">{edu.branch}</div>}
                <div className="mod-edu-meta">
                  {[edu.startYear, edu.endYear].filter(Boolean).join(" – ")}
                  {edu.cgpa && ` · CGPA ${edu.cgpa}`}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills in Sidebar */}
        {hasSkills(data) && (
          <div>
            <h2 className="mod-sec-title">Skills</h2>
            {skills.languages?.length > 0 && (
              <div className="mod-skill-group" style={{ marginBottom: "8px" }}>
                <div className="mod-skill-label" style={{ fontSize: "7.5pt" }}>Languages</div>
                <div className="mod-skill-tags">
                  {skills.languages.map((s, i) => (
                    <span key={i} className="mod-skill-tag" style={{ fontSize: "7.5pt", padding: "2px 6px" }}>{s}</span>
                  ))}
                </div>
              </div>
            )}
            {skills.web?.length > 0 && (
              <div className="mod-skill-group" style={{ marginBottom: "8px" }}>
                <div className="mod-skill-label" style={{ fontSize: "7.5pt" }}>Web / Frameworks</div>
                <div className="mod-skill-tags">
                  {skills.web.map((s, i) => (
                    <span key={i} className="mod-skill-tag" style={{ fontSize: "7.5pt", padding: "2px 6px" }}>{s}</span>
                  ))}
                </div>
              </div>
            )}
            {skills.databases?.length > 0 && (
              <div className="mod-skill-group" style={{ marginBottom: "8px" }}>
                <div className="mod-skill-label" style={{ fontSize: "7.5pt" }}>Databases</div>
                <div className="mod-skill-tags">
                  {skills.databases.map((s, i) => (
                    <span key={i} className="mod-skill-tag" style={{ fontSize: "7.5pt", padding: "2px 6px" }}>{s}</span>
                  ))}
                </div>
              </div>
            )}
            {skills.tools?.length > 0 && (
              <div className="mod-skill-group" style={{ marginBottom: "8px" }}>
                <div className="mod-skill-label" style={{ fontSize: "7.5pt" }}>Tools & Platforms</div>
                <div className="mod-skill-tags">
                  {skills.tools.map((s, i) => (
                    <span key={i} className="mod-skill-tag" style={{ fontSize: "7.5pt", padding: "2px 6px" }}>{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </aside>

      {/* Right Main Content */}
      <main className="mod-main" style={{ padding: "26px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {hasSummary(data) && (
          <section style={{ breakInside: "avoid" }}>
            <h2 className="mod-main-sec" style={{ color: accentColor, marginTop: 0, marginBottom: "8px" }}>Summary</h2>
            <p style={{ fontSize: "9.5pt", color: "#333", lineHeight: 1.5 }}>{summary}</p>
          </section>
        )}

        {hasExperience(data) && (
          <section>
            <h2 className="mod-main-sec" style={{ color: accentColor, marginBottom: "10px" }}>Experience</h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mod-entry" style={{ marginBottom: "12px", breakInside: "avoid" }}>
                <div className="mod-entry-header">
                  <div>
                    <span className="mod-entry-title">{exp.role}</span>
                    {exp.company && <span className="mod-entry-sub" style={{ color: "#64748b" }}> @ {exp.company}</span>}
                  </div>
                  {exp.duration && <span className="mod-entry-date" style={{ color: "#64748b" }}>{exp.duration}</span>}
                </div>
                {exp.bullets && exp.bullets.filter((b) => b && b.trim()).length > 0 && (
                  <ul style={{ marginTop: "4px" }}>
                    {exp.bullets
                      .filter((b) => b && b.trim())
                      .map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {hasProjects(data) && (
          <section>
            <h2 className="mod-main-sec" style={{ color: accentColor, marginBottom: "10px" }}>Projects</h2>
            {projects.map((proj) => (
              <div key={proj.id} className="mod-entry" style={{ marginBottom: "12px", breakInside: "avoid" }}>
                <div className="mod-entry-header">
                  <span className="mod-entry-title">{proj.name}</span>
                  <div className="mod-main-links">
                    {proj.liveLink?.trim() && (
                      <a href={proj.liveLink} target="_blank" rel="noopener noreferrer">Live Demo</a>
                    )}
                    {proj.githubLink?.trim() && (
                      <a href={proj.githubLink} target="_blank" rel="noopener noreferrer">GitHub</a>
                    )}
                  </div>
                </div>
                {proj.techStack && (
                  <div style={{ fontSize: "8.5pt", color: "#64748b", fontStyle: "italic", marginBottom: "3px" }}>
                    Stack: {proj.techStack}
                  </div>
                )}
                {proj.bullets && proj.bullets.filter((b) => b && b.trim()).length > 0 && (
                  <ul style={{ marginTop: "4px" }}>
                    {proj.bullets
                      .filter((b) => b && b.trim())
                      .map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Active Optional Sections */}
        {activeOptional.map((secId) => (
          <RenderOptionalSection
            key={secId}
            sectionId={secId}
            data={data}
            accentColor={accentColor}
            headingClass="mod-main-sec"
            entryTitleClass="mod-entry-title"
            dateClass="mod-entry-date"
          />
        ))}
      </main>
    </div>
  );
}
