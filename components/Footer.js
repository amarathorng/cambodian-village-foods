// components/Footer.js
// Restrained footer with wordmark, tagline, navigation, language, and copyright.
import { colors, fonts } from "./theme.js";

const t = {
  en: {
    tagline: "Preserving everyday Cambodian food stories.",
    foods: "Foods",
    stories: "Stories",
    about: "About",
  },
  kh: {
    tagline: "Preserving everyday Cambodian food stories.",
    foods: "អាហារ",
    stories: "Stories",
    about: "About",
  },
};

export default function Footer({ language, copyright }) {
  const tUI = t[language] || t.en;
  const nav = [
    { label: tUI.foods, href: "#collection" },
    { label: tUI.stories, href: "#introduction" },
    { label: tUI.about, href: "#about" },
  ];
  return (
    <footer className="footer" style={{ borderTop: `1px solid ${colors.border}`, marginTop: 64, padding: "44px 24px 40px" }}>
      <div className="footer-inner" style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <p style={{ margin: 0, fontFamily: fonts.stack, fontSize: 16, fontWeight: 700, letterSpacing: "0.06em", color: colors.text }}>
            KHMER LIVING ARCHIVE
          </p>
          <p style={{ margin: 0, fontFamily: fonts.stack, fontSize: 14, color: colors.text2 }}>
            {tUI.tagline}
          </p>
          <nav aria-label="Footer" style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {nav.map((n) => (
              <a key={n.href} href={n.href} style={{ fontFamily: fonts.stack, fontSize: 14, color: colors.text2, textDecoration: "none" }}>
                {n.label}
              </a>
            ))}
          </nav>
          <span
            aria-hidden="true"
            style={{
              display: "block",
              width: 52,
              height: 1,
              backgroundColor: colors.gold,
              marginTop: 6,
            }}
          />
          <p style={{ margin: 0, fontFamily: fonts.stack, fontSize: 13, color: colors.muted }}>
            {copyright || "© 2026 Khmer Living Archive"}
          </p>
        </div>
      </div>
    </footer>
  );
}