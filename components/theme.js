// components/theme.js
// Design tokens for the Khmer Living Archive editorial design system.
// A warm, archival palette: warm cream paper, soft ivory surfaces, deep forest
// green for identity, and muted gold / terracotta used only as small accents.
// Every component reads these values, so the palette lives in one place.
//
// These values mirror the CSS custom properties in app/archive.css. Inline
// styles read the JS tokens; CSS rules read the variables.

export const colors = {
  bg: "#FFFDF8", // soft ivory — page background
  bg2: "#F7F3EA", // warm cream — alternate section background
  card: "#FFFFFF", // card surface
  elevated: "#F1ECDF", // inset / media surface
  text: "#252923", // dark charcoal — primary text
  text2: "#5C5D55", // secondary text (AA on cream and ivory)
  muted: "#6E6F67", // muted labels (AA at 12px+ semibold)
  green: "#183F35", // deep forest green — primary identity
  greenDeep: "#102D26", // dark green — headings, dark sections
  green2: "#2F6249", // accent green — links, arrows, small highlights
  greenSoft: "#E8EDE4", // tinted green surface
  gold: "#B99758", // muted gold — rules, motifs, decorative only
  goldText: "#86672F", // darker gold that passes AA as small text
  terracotta: "#A65D43", // terracotta — small accents
  border: "#E4DECF", // hairline borders / dividers
  borderStrong: "#CFC7B4", // stronger borders for inputs and chips
  onGreen: "#FFFDF8", // text on green surfaces
  danger: "#A3482F", // warm error tone (AA on cream)
};

// Type stacks. English headings use Fraunces (an editorial serif); interface
// text uses Inter; Khmer falls through to Noto Sans Khmer for body copy and
// Noto Serif Khmer for headings and food names, so Khmer never renders in a
// Latin-only face or loses its clusters.
export const fonts = {
  display: "'Fraunces', Georgia, 'Times New Roman', serif",
  stack:
    "'Inter', 'Noto Sans Khmer', ui-sans-serif, system-ui, 'Segoe UI', sans-serif",
  khmer: "'Noto Serif Khmer', 'Noto Sans Khmer', serif",
  khmerBody: "'Noto Sans Khmer', 'Inter', sans-serif",
  label: "'Inter', 'Noto Sans Khmer', ui-sans-serif, sans-serif",
};

// Convert a Latin digit string to Khmer numerals (0-9 -> Khmer digits).
export function toKhmerNumber(value) {
  const map = ["\u17E0", "\u17E1", "\u17E2", "\u17E3", "\u17E4", "\u17E5", "\u17E6", "\u17E7", "\u17E8", "\u17E9"];
  return String(value).replace(/\d/g, (d) => map[Number(d)]);
}
