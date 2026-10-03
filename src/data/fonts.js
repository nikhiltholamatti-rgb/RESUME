export const FONT_OPTIONS = [
  {
    category: "Sans-Serif",
    fonts: [
      { id: "inter", name: "Inter", stack: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
      { id: "roboto", name: "Roboto", stack: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
      { id: "opensans", name: "Open Sans", stack: "'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
      { id: "lato", name: "Lato", stack: "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
      { id: "calibri", name: "Calibri (System)", stack: "Calibri, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif" },
      { id: "arial", name: "Arial (System)", stack: "Arial, Helvetica, 'Liberation Sans', sans-serif" },
    ],
  },
  {
    category: "Serif",
    fonts: [
      { id: "ebgaramond", name: "EB Garamond", stack: "'EB Garamond', Garamond, 'Times New Roman', serif" },
      { id: "merriweather", name: "Merriweather", stack: "'Merriweather', Georgia, 'Times New Roman', serif" },
      { id: "georgia", name: "Georgia (System)", stack: "Georgia, Cambria, 'Times New Roman', serif" },
      { id: "timesnewroman", name: "Times New Roman (System)", stack: "'Times New Roman', Times, Baskerville, Georgia, serif" },
    ],
  },
];

export const DEFAULT_FONT = "inter";

export function getFontStack(fontId) {
  for (const cat of FONT_OPTIONS) {
    const found = cat.fonts.find((f) => f.id === fontId);
    if (found) return found.stack;
  }
  return FONT_OPTIONS[0].fonts[0].stack;
}
