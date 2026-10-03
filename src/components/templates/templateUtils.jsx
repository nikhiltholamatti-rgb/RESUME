import React from "react";
import { Mail, Phone, MapPin, Globe } from "lucide-react";

export function Linkedin({ size = 14, style = {}, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function Github({ size = 14, style = {}, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export function getLinkLabel(link) {
  if (link.type && link.type !== "Other") return link.type;
  try {
    const url = new URL(link.url);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return "Website";
  }
}

export function getLinkIcon(link, size = 14) {
  const type = (link.type || "").toLowerCase();
  if (type === "linkedin") return <Linkedin size={size} style={{ verticalAlign: "-2px", marginRight: "4px", display: "inline-block", flexShrink: 0 }} />;
  if (type === "github") return <Github size={size} style={{ verticalAlign: "-2px", marginRight: "4px", display: "inline-block", flexShrink: 0 }} />;
  return <Globe size={size} style={{ verticalAlign: "-2px", marginRight: "4px", display: "inline-block", flexShrink: 0 }} />;
}

export function getValidLinks(links = []) {
  return links.filter((l) => l && l.url && l.url.trim().length > 0);
}

export function hasSummary(state) {
  return Boolean(state.summary && state.summary.trim().length > 0);
}

export function hasEducation(state) {
  return (
    state.education &&
    state.education.length > 0 &&
    state.education.some((e) => (e.college && e.college.trim()) || (e.degree && e.degree.trim()))
  );
}

export function hasSkills(state) {
  if (!state.skills) return false;
  return Object.values(state.skills).some((arr) => Array.isArray(arr) && arr.length > 0);
}

export function hasProjects(state) {
  return (
    state.projects &&
    state.projects.length > 0 &&
    state.projects.some((p) => p.name && p.name.trim().length > 0)
  );
}

export function hasExperience(state) {
  return (
    state.experience &&
    state.experience.length > 0 &&
    state.experience.some((e) => (e.company && e.company.trim()) || (e.role && e.role.trim()))
  );
}

export function hasAchievements(state) {
  return (
    state.achievements &&
    state.achievements.length > 0 &&
    state.achievements.some((a) => a.text && a.text.trim().length > 0)
  );
}

/**
 * Standard Contact Line:
 * email · phone · city · [Links with lucide icons]
 */
export function ContactLine({
  personalInfo = {},
  links = [],
  separator = " · ",
  className = "resume-contact-row",
  linkClassName = "link-label",
  textColor,
  showIcons = true,
  iconSize = 14,
}) {
  const { email, phone, city } = personalInfo;
  const validLinks = getValidLinks(links);

  const baseItems = [];
  if (email?.trim()) {
    baseItems.push({
      key: "email",
      node: (
        <a
          href={`mailto:${email.trim()}`}
          style={{ color: textColor || "inherit", display: "inline-flex", alignItems: "center" }}
        >
          {showIcons && <Mail size={iconSize} style={{ verticalAlign: "-2px", marginRight: "4px", display: "inline-block", flexShrink: 0 }} />}
          {email.trim()}
        </a>
      ),
    });
  }
  if (phone?.trim()) {
    baseItems.push({
      key: "phone",
      node: (
        <span style={{ display: "inline-flex", alignItems: "center" }}>
          {showIcons && <Phone size={iconSize} style={{ verticalAlign: "-2px", marginRight: "4px", display: "inline-block", flexShrink: 0 }} />}
          {phone.trim()}
        </span>
      ),
    });
  }
  if (city?.trim()) {
    baseItems.push({
      key: "city",
      node: (
        <span style={{ display: "inline-flex", alignItems: "center" }}>
          {showIcons && <MapPin size={iconSize} style={{ verticalAlign: "-2px", marginRight: "4px", display: "inline-block", flexShrink: 0 }} />}
          {city.trim()}
        </span>
      ),
    });
  }

  validLinks.forEach((link, idx) => {
    const label = getLinkLabel(link);
    baseItems.push({
      key: `link-${link.id || idx}`,
      node: (
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
          style={{ color: textColor || "inherit", display: "inline-flex", alignItems: "center" }}
        >
          {showIcons && getLinkIcon(link, iconSize)}
          {label}
        </a>
      ),
    });
  });

  if (baseItems.length === 0) return null;

  return (
    <div className={className} style={{ color: textColor || "inherit" }}>
      {baseItems.map((item, index) => (
        <React.Fragment key={item.key}>
          {index > 0 && <span className="sep">{separator}</span>}
          {item.node}
        </React.Fragment>
      ))}
    </div>
  );
}
