// components/FoodFilters.js
// Minimal filters that only use data that actually exists: the collection as a
// whole plus the distinct locations present in the records. (No ingredients or
// category data exists, so no filters are built for them.)
import { colors, fonts } from "./theme.js";

const t = {
  en: { all: "All foods", location: "Location", label: "Filter foods" },
  kh: { all: "មុខម្ហូបទាំងអស់", location: "ទីកន្លែង", label: "តម្រងមុខម្ហូប" },
};

export default function FoodFilters({ language, locations, active, onChange }) {
  const tUI = t[language] || t.en;
  const base = (isActive) => ({
    fontFamily: fonts.stack,
    fontSize: 13,
    fontWeight: 600,
    background: isActive ? colors.green : "none",
    color: isActive ? colors.text : colors.text2,
    // The lighter accent border keeps the selected chip distinguishable from
    // the card surface (the green fill alone is under 2:1 against colors.card).
    border: `1px solid ${isActive ? colors.green2 : colors.border}`,
    borderRadius: 999,
    padding: "6px 14px",
    cursor: "pointer",
  });

  return (
    <div role="group" aria-label={tUI.label} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
      <span
        style={{
          fontFamily: fonts.stack,
          fontSize: 12,
          // Khmer clusters must not be tracked; only the English label gets
          // the uppercase spacing.
          letterSpacing: language === "en" ? "0.1em" : 0,
          color: colors.muted,
        }}
      >
        {tUI.location}:
      </span>
      <button type="button" className="filter-chip" onClick={() => onChange("")} aria-pressed={active === ""} style={base(active === "")}>
        {tUI.all}
      </button>
      {locations.map((loc) => (
        <button
          key={loc.value}
          type="button"
          className="filter-chip"
          onClick={() => onChange(active === loc.value ? "" : loc.value)}
          aria-pressed={active === loc.value}
          style={base(active === loc.value)}
        >
          {loc.label}
        </button>
      ))}
    </div>
  );
}