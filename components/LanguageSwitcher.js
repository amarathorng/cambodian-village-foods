// components/LanguageSwitcher.js
// English / Khmer toggle used in the navigation and the detail page.
// The active language gets a green border and tint; the inactive one is muted.
import { colors, fonts } from "./theme.js";

const t = {
  en: { label: "English" },
  kh: { label: "ខ្មែរ" },
};

export default function LanguageSwitcher({ language, setLanguage, size = "nav" }) {
  const base = { fontSize: size === "nav" ? 13 : 14 };
  return (
    <div
      role="group"
      aria-label="Language"
      style={{ display: "flex", gap: 6, alignItems: "center" }}
    >
      {["en", "kh"].map((code) => {
        const active = language === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLanguage(code)}
            aria-pressed={active}
            style={{
              ...base,
              fontFamily: fonts.stack,
              fontWeight: 600,
              background: "none",
              border: `1px solid ${active ? colors.green2 : colors.border}`,
              color: active ? colors.green2 : colors.muted,
              borderRadius: 6,
              padding: size === "nav" ? "3px 10px" : "6px 14px",
              cursor: "pointer",
            }}
          >
            {t[code].label}
          </button>
        );
      })}
    </div>
  );
}