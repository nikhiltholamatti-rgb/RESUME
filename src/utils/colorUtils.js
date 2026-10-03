/**
 * colorUtils.js
 * Helper utilities for color contrast and text-color decisions.
 */

/**
 * Convert a hex color like "#1e3a5f" to { r, g, b }.
 */
export function hexToRgb(hex) {
  const cleaned = hex.replace("#", "");
  const bigint = parseInt(cleaned, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

/**
 * Calculate relative luminance of a color (WCAG formula).
 * Returns a value between 0 (black) and 1 (white).
 */
export function getLuminance({ r, g, b }) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Given a background hex color, return "#ffffff" or "#111111"
 * depending on which provides better contrast for readability.
 */
export function getContrastText(bgHex) {
  const rgb = hexToRgb(bgHex);
  const lum = getLuminance(rgb);
  return lum > 0.4 ? "#111111" : "#ffffff";
}

/**
 * Pre-defined color palettes for the colored template.
 * Each palette has a sidebar color and an accent (heading) color.
 */
export const COLOR_PALETTES = [
  { name: "Navy & White", sidebar: "#1e3a5f", accent: "#2563eb" },
  { name: "Teal & Light Gray", sidebar: "#115e59", accent: "#14b8a6" },
  { name: "Maroon & Cream", sidebar: "#6b1d33", accent: "#be123c" },
  { name: "Charcoal & Gold", sidebar: "#1f2937", accent: "#d97706" },
  { name: "Deep Purple", sidebar: "#4c1d95", accent: "#7c3aed" },
  { name: "Forest & Sage", sidebar: "#14532d", accent: "#16a34a" },
  { name: "Slate & Coral", sidebar: "#334155", accent: "#f97316" },
  { name: "Midnight Blue", sidebar: "#0f172a", accent: "#3b82f6" },
];

/**
 * Generate a unique ID for repeatable items.
 */
export function generateId(prefix = "item") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
