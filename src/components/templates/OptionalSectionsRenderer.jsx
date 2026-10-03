import { ExternalLink } from "lucide-react";

export function isSectionActiveAndFilled(data, sectionId) {
  if (!data?.activeOptional?.includes(sectionId)) return false;
  const items = data[sectionId];
  if (!items) return false;
  if (!Array.isArray(items) || items.length === 0) return false;

  switch (sectionId) {
    case "achievements":
      return items.some((it) => it.text && it.text.trim());
    case "certifications":
      return items.some((it) => it.name && it.name.trim());
    case "leadership":
      return items.some((it) => (it.organization && it.organization.trim()) || (it.role && it.role.trim()));
    case "opensource":
      return items.some((it) => it.projectName && it.projectName.trim());
    case "publications":
      return items.some((it) => it.title && it.title.trim());
    case "languages":
      return items.some((it) => it.language && it.language.trim());
    case "interests":
      return items.some((it) => it.name && it.name.trim());
    case "custom":
      return items.some((it) => (it.heading && it.heading.trim()) || (it.bullets && it.bullets.some((b) => b && b.trim())));
    case "coursework":
      return items.some((it) => it.course && it.course.trim());
    case "testScores":
      return items.some((it) => it.examName && it.examName.trim());
    default:
      return false;
  }
}

export function RenderOptionalSection({ sectionId, data, accentColor = "#6366f1", headingClass = "", entryTitleClass = "", dateClass = "", pageBlocks }) {
  if (!isSectionActiveAndFilled(data, sectionId)) return null;
  const blockId = `sec-${sectionId}-block`;
  if (pageBlocks && !pageBlocks.includes(blockId) && !pageBlocks.includes(`sec-${sectionId}-head`)) {
    return null;
  }
  const items = data[sectionId] || [];

  switch (sectionId) {
    case "certifications":
      return (
        <section
          data-page-block="true"
          data-block-id={blockId}
          data-block-type="item"
        >
          <h2 className={headingClass} style={{ color: accentColor, breakAfter: "avoid", pageBreakAfter: "avoid" }}>Certifications & Licenses</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {items
              .filter((c) => c.name && c.name.trim())
              .map((c) => (
                <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", breakInside: "avoid", pageBreakInside: "avoid" }}>
                  <div>
                    <span className={entryTitleClass} style={{ fontWeight: 600 }}>{c.name}</span>
                    {c.issuer && <span style={{ color: "#64748b", marginLeft: "6px" }}> — {c.issuer}</span>}
                    {c.url && (
                      <a href={c.url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "6px", textDecoration: "underline", fontSize: "8.5pt" }}>
                        View Credential
                      </a>
                    )}
                  </div>
                  {c.issueDate && <span className={dateClass} style={{ color: "#64748b", fontSize: "8.5pt" }}>{c.issueDate}</span>}
                </div>
              ))}
          </div>
        </section>
      );

    case "leadership":
      return (
        <section>
          <h2 className={headingClass} style={{ color: accentColor, breakAfter: "avoid", pageBreakAfter: "avoid" }}>Leadership & Volunteering</h2>
          {items
            .filter((l) => (l.organization && l.organization.trim()) || (l.role && l.role.trim()))
            .map((l) => (
              <div key={l.id} style={{ marginBottom: "10px", breakInside: "avoid", pageBreakInside: "avoid" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span className={entryTitleClass} style={{ fontWeight: 600 }}>{l.role}</span>
                    {l.organization && <span style={{ color: "#64748b" }}> | {l.organization}</span>}
                  </div>
                  {l.duration && <span className={dateClass} style={{ color: "#64748b", fontSize: "8.5pt" }}>{l.duration}</span>}
                </div>
                {l.bullets && l.bullets.filter((b) => b && b.trim()).length > 0 && (
                  <ul style={{ marginTop: "3px" }}>
                    {l.bullets.filter((b) => b && b.trim()).map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
        </section>
      );

    case "achievements":
      return (
        <section>
          <h2 className={headingClass} style={{ color: accentColor, breakAfter: "avoid", pageBreakAfter: "avoid" }}>Achievements & Awards</h2>
          <ul>
            {items
              .filter((a) => a.text && a.text.trim())
              .map((a) => (
                <li key={a.id} style={{ marginBottom: "2px", breakInside: "avoid", pageBreakInside: "avoid" }}>{a.text}</li>
              ))}
          </ul>
        </section>
      );

    case "opensource":
      return (
        <section>
          <h2 className={headingClass} style={{ color: accentColor, breakAfter: "avoid", pageBreakAfter: "avoid" }}>Open Source Contributions</h2>
          {items
            .filter((o) => o.projectName && o.projectName.trim())
            .map((o) => (
              <div key={o.id} style={{ marginBottom: "8px", breakInside: "avoid", pageBreakInside: "avoid" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span className={entryTitleClass} style={{ fontWeight: 600 }}>{o.projectName}</span>
                    {o.role && <span style={{ color: "#64748b", marginLeft: "6px" }}>({o.role})</span>}
                  </div>
                  {o.link && (
                    <a href={o.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", fontSize: "8.5pt" }}>
                      Repository
                    </a>
                  )}
                </div>
                {o.description && <p style={{ fontSize: "9pt", color: "#333", marginTop: "2px" }}>{o.description}</p>}
              </div>
            ))}
        </section>
      );

    case "publications":
      return (
        <section>
          <h2 className={headingClass} style={{ color: accentColor, breakAfter: "avoid", pageBreakAfter: "avoid" }}>Publications</h2>
          {items
            .filter((p) => p.title && p.title.trim())
            .map((p) => (
              <div key={p.id} style={{ marginBottom: "6px", breakInside: "avoid", pageBreakInside: "avoid" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span className={entryTitleClass} style={{ fontWeight: 600 }}>{p.title}</span>
                    {p.venue && <span style={{ color: "#64748b", fontStyle: "italic", marginLeft: "6px" }}> — {p.venue}</span>}
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "6px", textDecoration: "underline", fontSize: "8.5pt" }}>
                        DOI/Link
                      </a>
                    )}
                  </div>
                  {p.date && <span className={dateClass} style={{ color: "#64748b", fontSize: "8.5pt" }}>{p.date}</span>}
                </div>
              </div>
            ))}
        </section>
      );

    case "languages":
      return (
        <section>
          <h2 className={headingClass} style={{ color: accentColor, breakAfter: "avoid", pageBreakAfter: "avoid" }}>Languages</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 18px" }}>
            {items
              .filter((l) => l.language && l.language.trim())
              .map((l) => (
                <div key={l.id} style={{ fontSize: "9pt", breakInside: "avoid", pageBreakInside: "avoid" }}>
                  <strong>{l.language}</strong>
                  {l.proficiency && <span style={{ color: "#64748b", marginLeft: "4px" }}>({l.proficiency})</span>}
                </div>
              ))}
          </div>
        </section>
      );

    case "interests":
      return (
        <section>
          <h2 className={headingClass} style={{ color: accentColor, breakAfter: "avoid", pageBreakAfter: "avoid" }}>Interests & Hobbies</h2>
          <p style={{ fontSize: "9.5pt", color: "#333", breakInside: "avoid", pageBreakInside: "avoid" }}>
            {items.filter((it) => it.name && it.name.trim()).map((it) => it.name).join(" · ")}
          </p>
        </section>
      );

    case "custom":
      return (
        <div>
          {items.map((cust) => (
            <section key={cust.id} style={{ marginBottom: "12px" }}>
              <h2 className={headingClass} style={{ color: accentColor, breakAfter: "avoid", pageBreakAfter: "avoid" }}>{cust.heading || "Additional Information"}</h2>
              {cust.bullets && cust.bullets.filter((b) => b && b.trim()).length > 0 && (
                <ul>
                  {cust.bullets.filter((b) => b && b.trim()).map((b, i) => (
                    <li key={i} style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      );

    case "coursework":
      return (
        <section>
          <h2 className={headingClass} style={{ color: accentColor, breakAfter: "avoid", pageBreakAfter: "avoid" }}>Relevant Coursework</h2>
          <p style={{ fontSize: "9.5pt", color: "#333", breakInside: "avoid", pageBreakInside: "avoid" }}>
            {items.filter((it) => it.course && it.course.trim()).map((it) => it.course).join(" · ")}
          </p>
        </section>
      );

    case "testScores":
      return (
        <section>
          <h2 className={headingClass} style={{ color: accentColor, breakAfter: "avoid", pageBreakAfter: "avoid" }}>Test Scores & Exams</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 24px" }}>
            {items
              .filter((t) => t.examName && t.examName.trim())
              .map((t) => (
                <div key={t.id} style={{ fontSize: "9pt", breakInside: "avoid", pageBreakInside: "avoid" }}>
                  <strong>{t.examName}</strong>: {t.score}
                  {t.percentile && <span style={{ color: "#64748b", marginLeft: "4px" }}>({t.percentile})</span>}
                  {t.date && <span style={{ color: "#64748b", marginLeft: "6px" }}> · {t.date}</span>}
                </div>
              ))}
          </div>
        </section>
      );

    default:
      return null;
  }
}
