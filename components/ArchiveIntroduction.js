// components/ArchiveIntroduction.js
// Short editorial section between hero and collection. Establishes why the
// archive exists without adding unverified historical claims.
import { colors, fonts } from "./theme.js";

const t = {
  en: {
    heading: "Food is more than something we eat.",
    body: "Across Cambodian villages, food carries memories of family, place, seasons, and traditions. Every dish has a story shaped by the people who prepare it and the communities that keep it alive.",
  },
  kh: {
    // No verified Khmer translation in the project for this passage.
    heading: "Food is more than something we eat.",
    body: "Across Cambodian villages, food carries memories of family, place, seasons, and traditions. Every dish has a story shaped by the people who prepare it and the communities that keep it alive.",
  },
};

export default function ArchiveIntroduction({ language }) {
  const tUI = t[language] || t.en;
  return (
    <section id="introduction" className="reveal" style={{ padding: "72px 0" }}>
      <span
        aria-hidden="true"
        style={{
          display: "block",
          margin: "0 auto 28px",
          width: 44,
          height: 22,
          color: colors.gold,
          textAlign: "center",
          fontSize: 20,
          transform: "rotate(0deg)",
        }}
      >
        ·⋆·
      </span>
      <h2
        style={{
          margin: "0 auto 18px",
          maxWidth: "26ch",
          fontFamily: fonts.stack,
          fontSize: 34,
          lineHeight: 1.25,
          fontWeight: 700,
          color: colors.text,
          textAlign: "center",
        }}
      >
        {tUI.heading}
      </h2>
      <p
        style={{
          margin: "0 auto",
          maxWidth: "60ch",
          fontFamily: fonts.stack,
          fontSize: 18,
          lineHeight: 1.75,
          color: colors.text2,
          textAlign: "center",
        }}
      >
        {tUI.body}
      </p>
    </section>
  );
}