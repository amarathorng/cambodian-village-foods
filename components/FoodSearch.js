// components/FoodSearch.js
// Bilingual search input with an icon, healthy focus ring (CSS class), and a
// clear action. Search terms match fields that actually exist in the data
// (English name, Khmer name, story, contributor, place).
import { colors, fonts } from "./theme.js";

const t = {
  en: { placeholder: "Search foods or communities…", clear: "Clear search", label: "Search the archive" },
  kh: {
    placeholder: "ស្វែងរកអាហារ…",
    clear: "សម្អាតការស្វែងរក",
    label: "Search the archive",
  },
};

export default function FoodSearch({ language, value, onChange, onClear }) {
  const tUI = t[language] || t.en;
  return (
    <div className="food-search" role="search" style={{ position: "relative" }}>
      <span aria-hidden="true" style={{ position: "absolute", left: 12, top: 0, bottom: 0, display: "flex", alignItems: "center", color: colors.muted }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ display: "block" }}>
          <circle cx="11" cy="11" r="7" />
          <line x1="11" y1="5.2" x2="11" y2="15" />
          <line x1="4.4" y1="15" x2="17.6" y2="15" />
          <line x1="6" y1="7.5" x2="6" y2="13.5" />
        </svg>
      </span>
      <input
        type="search"
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={tUI.placeholder}
        aria-label={tUI.label}
        autoComplete="off"
        spellCheck="false"
        style={{
          width: "100%",
          padding: "12px 16px 12px 38px",
          fontSize: 15,
          fontFamily: fonts.stack,
          color: colors.text,
          border: `1px solid ${colors.border}`,
          borderRadius: 10,
          backgroundColor: colors.card,
        }}
      />
      {value.length > 0 && (
        <button
          type="button"
          className="search-clear"
          onClick={onClear}
          aria-label={tUI.clear}
          style={{
            position: "absolute",
            right: 12,
            top: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            background: "none",
            border: "none",
            color: colors.muted,
            fontSize: 18,
            padding: "0 6px",
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}