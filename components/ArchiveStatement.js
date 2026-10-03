// components/ArchiveStatement.js
// "The Knowledge Holders" — presents the archive's general source statement and
// the kinds of people who contribute knowledge. It never claims any specific
// record was independently verified.
import { colors, fonts } from "./theme.js";

const t = {
  en: {
    label: "THE KNOWLEDGE HOLDERS",
    heading: "The Knowledge Holders",
    body: "These food stories are connected to the knowledge shared by the people who prepare, preserve, and remember the traditions of their communities.",
    holders: ["Village elders", "Local cooks", "Families", "Community storytellers"],
    source: "Village elders and local cooks who share the food's history and importance to their community.",
  },
  kh: {
    label: "THE KNOWLEDGE HOLDERS",
    heading: "The Knowledge Holders",
    body: "These food stories are connected to the knowledge shared by the people who prepare, preserve, and remember the traditions of their communities.",
    holders: ["Village elders", "Local cooks", "Families", "Community storytellers"],
    source: "Village elders and local cooks who share the food's history and importance to their community.",
  },
};

export default function ArchiveStatement({ language, source }) {
  const tUI = t[language] || t.en;
  return (
    <section className="reveal" style={{ padding: "40px 0" }}>
      <span className="section-label" style={{ fontFamily: fonts.stack, fontSize: 12, letterSpacing: "0.16em", color: colors.muted }}>
        {tUI.label}
      </span>
      <h2 style={{ margin: "14px 0 16px", fontFamily: fonts.stack, fontSize: 30, fontWeight: 700, color: colors.text }}>
        {tUI.heading}
      </h2>
      <div
        className="holders-list"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 22,
        }}
      >
        {tUI.holders.map((h) => (
          <span
            key={h}
            style={{
              fontFamily: fonts.stack,
              fontSize: 14,
              color: colors.text2,
              border: `1px solid ${colors.border}`,
              borderRadius: 999,
              padding: "6px 14px",
            }}
          >
            {h}
          </span>
        ))}
      </div>
      <p style={{ margin: 0, maxWidth: "62ch", fontFamily: fonts.stack, fontSize: 17, lineHeight: 1.7, color: colors.text2 }}>
        {tUI.body}
      </p>
      <p style={{ marginTop: 18, maxWidth: "62ch", fontFamily: fonts.stack, fontSize: 15, lineHeight: 1.6, color: colors.muted, fontStyle: "italic" }}>
        {source || tUI.source}
      </p>
    </section>
  );
}