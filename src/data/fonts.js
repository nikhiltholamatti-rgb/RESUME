export const FONT_OPTIONS = [
  {
    category: "Sans-Serif",
    fonts: [
      {
        id: "inter",
        name: "Inter",
        stack: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        desc: "Modern & Crisp (ATS Favorite)",
      },
      {
        id: "roboto",
        name: "Roboto",
        stack: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        desc: "Geometric & Clean",
      },
      {
        id: "lato",
        name: "Lato",
        stack: "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        desc: "Warm & Friendly",
      },
    ],
  },
  {
    category: "Serif",
    fonts: [
      {
        id: "merriweather",
        name: "Merriweather",
        stack: "'Merriweather', Georgia, 'Times New Roman', serif",
        desc: "Editorial & Authoritative",
      },
      {
        id: "playfair",
        name: "Playfair Display",
        stack: "'Playfair Display', Georgia, 'Times New Roman', serif",
        desc: "Elegant & Executive",
      },
    ],
  },
  {
    category: "Monospace",
    fonts: [
      {
        id: "jetbrains",
        name: "JetBrains Mono",
        stack: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
        desc: "Technical & Developer Focused",
      },
    ],
  },
];

// Flat list for easy direct selection
export const PRIMARY_FONTS = [
  {
    id: "inter",
    name: "Inter",
    badge: "Sans",
    stack: "'Inter', sans-serif",
    sample: "The quick brown fox",
  },
  {
    id: "roboto",
    name: "Roboto",
    badge: "Sans",
    stack: "'Roboto', sans-serif",
    sample: "The quick brown fox",
  },
  {
    id: "lato",
    name: "Lato",
    badge: "Sans",
    stack: "'Lato', sans-serif",
    sample: "The quick brown fox",
  },
  {
    id: "merriweather",
    name: "Merriweather",
    badge: "Serif",
    stack: "'Merriweather', serif",
    sample: "The quick brown fox",
  },
  {
    id: "playfair",
    name: "Playfair Display",
    badge: "Serif",
    stack: "'Playfair Display', serif",
    sample: "The quick brown fox",
  },
  {
    id: "jetbrains",
    name: "JetBrains Mono",
    badge: "Mono",
    stack: "'JetBrains Mono', monospace",
    sample: "The quick brown fox",
  },
];

export const DEFAULT_FONT = "inter";

export function getFontStack(fontId) {
  for (const cat of FONT_OPTIONS) {
    const found = cat.fonts.find((f) => f.id === fontId);
    if (found) return found.stack;
  }
  const direct = PRIMARY_FONTS.find((f) => f.id === fontId);
  if (direct) return direct.stack;

  return PRIMARY_FONTS[0].stack;
}
