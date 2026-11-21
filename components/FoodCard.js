// components/FoodCard.js
// Editorial archive card. The whole card links to the food's detail page so it
// is keyboard-accessible. Every card shares one fixed frame — photo, bilingual
// names, a short story excerpt, contributor / place, read link — and the text
// blocks are clamped to a set number of lines, so the grid stays symmetrical
// even when entries have very different amounts of content.
import { colors } from "./theme.js";
import FoodCardMedia from "./FoodCardMedia.js";

const t = {
  en: { contributor: "Contributor", place: "Place", read: "Read the story" },
  kh: { contributor: "អ្នកចូលរួម", place: "ទីកន្លែង", read: "អានបន្ថែម" },
};

function excerpt(text, words) {
  if (!text) return "";
  const parts = text.split(/\s+/);
  if (parts.length <= words) return text;
  return parts.slice(0, words).join(" ") + " …";
}

export default function FoodCard({ entry, number, language = "en" }) {
  const tUI = t[language] || t.en;
  const primary = language === "kh" ? (entry.khmerTitle || entry.title) : entry.title;
  const secondary = language === "kh" ? entry.title : (entry.khmerTitle || "");

  // Only the village name, so the meta column never wraps to a second line.
  const village = (entry.place || "").split(",")[0].trim();

  return (
    <a
      href={`/food/${entry.id}`}
      className="food-card"
      aria-label={`${entry.title} — ${entry.contributor}, ${entry.place}`}
    >
      <FoodCardMedia entry={entry} primary={primary} number={number} language={language} />

      <div className="food-card-body">
        <h3 className="food-card-title">{primary}</h3>
        <h4 className="food-card-subtitle">{secondary}</h4>
        <p className="food-card-excerpt">{excerpt(entry.description || "", 26)}</p>

        <div className="food-card-meta">
          <div className="food-card-meta-item">
            <span className="food-card-meta-label">{tUI.contributor}</span>
            <span className="food-card-meta-value">{entry.contributor}</span>
          </div>
          <div className="food-card-meta-item">
            <span className="food-card-meta-label">{tUI.place}</span>
            <span className="food-card-meta-value">{village}</span>
          </div>
        </div>

        <span className="food-card-link" style={{ color: colors.green2 }}>
          <span>{tUI.read}</span>
          <span className="arrow-dot" aria-hidden="true">→</span>
        </span>
      </div>
    </a>
  );
}