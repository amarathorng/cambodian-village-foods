// components/theme.js
// Design tokens for the Khmer Living Archive redesign.
// A warm, nature-inspired palette drawn from Cambodian village life:
// rice fields, clay pots, woven baskets, tropical green, and wooden homes.
// Single source of token values so every component stays consistent.

export const colors = {
  bg: "#111513",          // main background
  bg2: "#171C19",         // secondary background
  card: "#202620",        // card surface
  elevated: "#252C26",    // elevated surface
  text: "#F2EADB",        // primary text
  text2: "#B8B9AD",       // secondary text
  muted: "#92998F",       // muted text
  green: "#245B43",       // khmer forest green (primary accent)
  green2: "#5D8A68",      // accent green
  terracotta: "#A85E43",  // terracotta (used sparingly)
  gold: "#B69A61",        // muted traditional gold (used sparingly)
  border: "#303831",      // borders / dividers
  danger: "#C96A5B",      // soft error tone (warm, not neon)
};

// Type stack. English uses Inter (modern sans); Khmer text falls through to
// Noto Sans Khmer so every character renders cleanly at any size.
export const fonts = {
  stack:
    "'Inter', 'Noto Sans Khmer', ui-sans-serif, system-ui, 'Segoe UI', sans-serif",
  khmer: "'Noto Sans Khmer', 'Inter', sans-serif",
  label: "'Inter', 'Noto Sans Khmer', ui-sans-serif, sans-serif", // uppercase archive labels
};

// Convert a Latin digit string to Khmer numerals (0-9 -> \u17F0-\u17F9).
export function toKhmerNumber(value) {
  const map = ["\u17F0", "\u17F1", "\u17F2", "\u17F3", "\u17F4", "\u17F5", "\u17F6", "\u17F7", "\u17F8", "\u17F9"];
  return String(value).replace(/\d/g, (d) => map[Number(d)]);
}