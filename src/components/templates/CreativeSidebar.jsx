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
  hasAchievements,
} from "./templateUtils";
import { RenderOptionalSection } from "./OptionalSectionsRenderer";

export default function CreativeSidebar({ data, accentColor = "#8b5cf6" }) {
  const { personalInfo = {}, links = [], summary, education = [], skills = {}, projects = [], experience = [], achievements = [] } = data;
  const validLinks = getValidLinks(links);

  const hasPhoto = Boolean(data.showPhoto && data.photo);

  return (
    <div className="resume-tpl tpl-creative" style={{ minHeight: "100%", background: "#fff" }}>
      {/* Sidebar with accent color gradient */}
      <aside
        className="cr-sidebar"
        style={{
          background: `linear-gradient(180deg, ${accentColor} 0%, #111827 100%)`,
          padding: "24px 18px",
          gap: "20px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: hasPhoto ? "8px" : "0px" }}>
          {/* Profile Photo: 150px circular photo with 4px white border and soft shadow. Never show placeholder on resume. */}
          {hasPhoto && (
            <div style={{ marginBottom: "14px", display: "flex", justifyContent: "center" }}>
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

          {personalInfo.fullName && <h1 className="cr-name">{personalInfo.fullName}</h1>}
          {personalInfo.headline && <p className="cr-headline">{personalInfo.headline}</p>}
        </div>

        {/* Contact details */}
        <div>
          <h2 className="cr-sec-title">Contact</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {personalInfo.email?.trim() && (
              <div className="cr-contact-item" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Mail size={14} style={{ flexShrink: 0, opacity: 0.9 }} />
                <a href={`mailto:${personalInfo.email.trim()}`} style={{ wordBreak: "break-all" }}>
                  {personalInfo.email.trim()}
                </a>
              </div>
            )}
            {personalInfo.phone?.trim() && (
              <div className="cr-contact-item" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Phone size={14} style={{ flexShrink: 0, opacity: 0.9 }} />
                <span>{personalInfo.phone.trim()}</span>
              </div>
            )}
            {personalInfo.city?.trim() && (
              <div className="cr-contact-item" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <MapPin size={14} style={{ flexShrink: 0, opacity: 0.9 }} />
                <span>{personalInfo.city.trim()}</span>
              </div>
            )}
            {validLinks.map((link) => (
              <div key={link.id} className="cr-contact-item" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {getLinkIcon(link, 14)}
                <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
                  {getLinkLabel(link)}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        {hasSkills(data) && (
          <div>
            <h2 className="cr-sec-title">Expertise</h2>
            <div>
              {Object.entries(skills).map(([grp, list]) =>
                list && list.length > 0 ? (
                  <div key={grp} style={{ marginBottom: "8px" }}>
                    <div style={{ fontSize: "7.5pt", textTransform: "uppercase", opacity: 0.8, marginBottom: "3px", letterSpacing: "0.06em" }}>
                      {grp}
                    </div>
                    <div>
                      {list.map((tag, i) => (
                        <span key={i} className="cr-skill-chip" style={{ fontSize: "7.5pt", padding: "2px 6px" }}>
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

        {/* Education in sidebar */}
        {hasEducation(data) && (
          <div>
            <h2 className="cr-sec-title">Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="cr-edu" style={{ marginBottom: "10px", breakInside: "avoid" }}>
                <div className="cr-edu-degree">{edu.degree || edu.college}</div>
                {edu.college && edu.degree && <div className="cr-edu-college">{edu.college}</div>}
                {edu.branch && <div className="cr-edu-meta">{edu.branch}</div>}
                <div className="cr-edu-meta">
                  {[edu.startYear, edu.endYear].filter(Boolean).join(" – ")}
                  {edu.cgpa && ` · ${edu.cgpa} CGPA`}
                </div>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* Main Column */}
      <main className="cr-main" style={{ padding: "26px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {hasSummary(data) && (
          <section style={{ breakInside: "avoid" }}>
            <h2 className="cr-main-sec" style={{ color: accentColor, marginTop: 0, marginBottom: "8px" }}>
              About Me
            </h2>
            <p style={{ fontSize: "9.5pt", color: "#333", lineHeight: 1.5 }}>{summary}</p>
          </section>
        )}

        {hasExperience(data) && (
          <section>
            <h2 className="cr-main-sec" style={{ color: accentColor, marginBottom: "10px" }}>
              Work Experience
            </h2>
            {experience.map((exp) => (
              <div key={exp.id} className="cr-entry" style={{ marginBottom: "12px", breakInside: "avoid" }}>
                <div className="cr-entry-header">
                  <div>
                    <span className="cr-entry-title">{exp.role}</span>
                    {exp.company && <span className="cr-entry-sub" style={{ color: "#64748b" }}> • {exp.company}</span>}
                  </div>
                  {exp.duration && <span className="cr-entry-date" style={{ color: "#64748b" }}>{exp.duration}</span>}
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
            <h2 className="cr-main-sec" style={{ color: accentColor, marginBottom: "10px" }}>
              Featured Projects
            </h2>
            {projects.map((proj) => (
              <div key={proj.id} className="cr-entry" style={{ marginBottom: "12px", breakInside: "avoid" }}>
                <div className="cr-entry-header">
                  <span className="cr-entry-title">{proj.name}</span>
                  <div className="cr-links">
                    {proj.liveLink?.trim() && (
                      <a href={proj.liveLink} target="_blank" rel="noopener noreferrer">Live Demo</a>
                    )}
                    {proj.githubLink?.trim() && (
                      <a href={proj.githubLink} target="_blank" rel="noopener noreferrer">Source</a>
                    )}
                  </div>
                </div>
                {proj.techStack && (
                  <div style={{ fontSize: "8.5pt", color: "#64748b", fontStyle: "italic", marginBottom: "3px" }}>
                    {proj.techStack}
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
        {(data.activeOptional || []).map((secId) => (
          <RenderOptionalSection
            key={secId}
            sectionId={secId}
            data={data}
            accentColor={accentColor}
            headingClass="cr-main-sec"
            entryTitleClass="cr-entry-title"
            dateClass="cr-entry-date"
          />
        ))}
      </main>
    </div>
  );
}
