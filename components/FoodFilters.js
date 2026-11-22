// components/FoodFilters.js
// Location filters built only from places that exist in the loaded records —
// no invented categories or ingredients.
const t = {
  en: { all: "All places", location: "Location", label: "Filter by location" },
  kh: { all: "ទីកន្លែងទាំងអស់", location: "ទីកន្លែង", label: "តម្រងតាមទីកន្លែង" },
};

export default function FoodFilters({ language, locations, active, onChange }) {
  const tUI = t[language] || t.en;

  return (
    <div className="filter-row" role="group" aria-label={tUI.label}>
      <span className={language === "kh" ? "filter-label khmer" : "filter-label"}>
        {tUI.location}
      </span>
      <button
        type="button"
        className="filter-chip"
        onClick={() => onChange("")}
        aria-pressed={active === ""}
      >
        {tUI.all}
      </button>
      {locations.map((location) => (
        <button
          key={location.value}
          type="button"
          className="filter-chip"
          onClick={() => onChange(active === location.value ? "" : location.value)}
          aria-pressed={active === location.value}
        >
          {location.label}
        </button>
      ))}
    </div>
  );
}
