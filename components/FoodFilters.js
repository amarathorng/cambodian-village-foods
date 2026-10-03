// components/FoodFilters.js
// Minimal filters that only use data that actually exists: the collection as a
// whole plus the distinct locations present in the records. (No ingredients or
// category data exists, so no filters are built for them.)
import { colors, fonts } from "./theme.js";

const t = {
  en: { all: "All foods", location: "Location", label: "Filter foods" },
  kh: { all: "All foods", location: "ទីកន្លែង", label: "Filter foods" },
};

export default function FoodFilters({ language, locations, active, onChange }) {
  const tUI = t[language] || t.en;
  const base = (isActive) => ({
    fontFamily: fonts.stack,
    fontSize: 13,
    fontWeight: 600,
    background: isActive ? colors.green : "none",
    color: isActive ? colors.text : colors.text2,
    border: `1px solid ${isActive ? colors.green : colors.border}`,
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
          letterSpacing: "0.1em",
          color: colors.muted,
        }}
      >
        {tUI.location}:
      </span>
      <button type="button" onClick={() => onChange("")} aria-pressed={active === ""} style={base(active === "")}>
        {tUI.all}
      </button>
      {locations.map((loc) => (
        <button
          key={loc.value}
          type="button"
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