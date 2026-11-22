// components/FoodSearch.js
// Bilingual search field. It filters the real archive records by English name,
// Khmer name, story text, contributor, and place (see app/page.js). The clear
// button appears only when there is something to clear.
const t = {
  en: {
    placeholder: "Search foods, villages, or contributors…",
    clear: "Clear search",
    label: "Search the archive",
  },
  kh: {
    placeholder: "ស្វែងរកអាហារ ទីកន្លែង ឬអ្នកចូលរួម…",
    clear: "សម្អាតការស្វែងរក",
    label: "ស្វែងរកក្នុងបណ្ណសារ",
  },
};

export default function FoodSearch({ language, value, onChange, onClear }) {
  const tUI = t[language] || t.en;

  return (
    <div className="food-search" role="search">
      <span className="search-icon" aria-hidden="true">
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" />
        </svg>
      </span>
      <input
        type="search"
        className="search-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={tUI.placeholder}
        aria-label={tUI.label}
        autoComplete="off"
        spellCheck="false"
      />
      {value.length > 0 && (
        <button
          type="button"
          className="search-clear"
          onClick={onClear}
          aria-label={tUI.clear}
          title={tUI.clear}
        >
          ×
        </button>
      )}
    </div>
  );
}
