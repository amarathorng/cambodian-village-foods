// components/FoodCard.js
// Editorial archive card. The whole card is one link, so it is keyboard
// accessible and works without hover. It shows both names (the selected
// language first), a short excerpt of the real story, contributor, place, and
// a clear read action.
import FoodCardMedia from "./FoodCardMedia.js";

const t = {
  en: {
    contributor: "Contributor",
    place: "Place",
    read: "Read the story",
    anonymous: "Anonymous",
  },
  kh: {
    contributor: "អ្នកចូលរួម",
    place: "ទីកន្លែង",
    read: "អានបន្ថែម",
    anonymous: "អនាមិក",
  },
};

function excerpt(text, words) {
  if (!text) return "";
  const parts = text.split(/\s+/);
  if (parts.length <= words) return text;
  return `${parts.slice(0, words).join(" ")} …`;
}

// Khmer is normally written without spaces between words, so counting words
// cannot shorten it. Cut the Khmer story by characters instead; whatever is
// left over is trimmed visually by the card's CSS line clamp.
function khmerExcerpt(text, max = 150) {
  const clean = (text || "").trim();
  return clean.length > max ? `${clean.slice(0, max).trimEnd()} …` : clean;
}

export default function FoodCard({
  entry,
  number,
  language = "en",
  variant,
  index = 0,
  priority = false,
}) {
  const tUI = t[language] || t.en;
  const primary = language === "kh" ? entry.khmerTitle || entry.title : entry.title;
  const secondary = language === "kh" ? entry.title : entry.khmerTitle || "";
  const village = (entry.place || "").split(",")[0].trim();
  // Same rule as the detail page: the Khmer story is optional, so use it only
  // when the reader chose Khmer and the contributor wrote one. Otherwise the
  // English story is shown exactly as before.
  const khmerStory = (entry.descriptionKh || "").trim();
  const useKhmerStory = language === "kh" && khmerStory !== "";
  const storyExcerpt = useKhmerStory
    ? khmerExcerpt(khmerStory)
    : excerpt(entry.description || "", 26);
  const className = `food-card${variant === "feature" ? " food-card--feature" : ""}`;

  return (
    <a
      href={`/food/${entry.id}`}
      className={className}
      style={{ "--i": index }}
      aria-label={`${primary}${secondary ? ` — ${secondary}` : ""}, ${village}`}
    >
      <FoodCardMedia
        entry={entry}
        primary={primary}
        number={number}
        language={language}
        priority={priority}
      />

      <div className="food-card-body">
        <h3 className={language === "kh" ? "food-card-title food-card-title--kh" : "food-card-title"}>
          {primary}
        </h3>
        <p
          className={language === "kh" ? "food-card-subtitle food-card-subtitle--latin" : "food-card-subtitle"}
          lang={language === "kh" ? "en" : "km"}
        >
          {secondary}
        </p>
        <p
          className={
            useKhmerStory ? "food-card-excerpt food-card-excerpt--kh" : "food-card-excerpt"
          }
          lang={useKhmerStory ? "km" : "en"}
        >
          {storyExcerpt}
        </p>

        <div className="food-card-meta">
          <div className="food-card-meta-item">
            <span className="food-card-meta-label">{tUI.contributor}</span>
            <span className="food-card-meta-value">{entry.contributor || tUI.anonymous}</span>
          </div>
          <div className="food-card-meta-item">
            <span className="food-card-meta-label">{tUI.place}</span>
            <span className="food-card-meta-value">{village}</span>
          </div>
        </div>

        <span className="food-card-link">
          {tUI.read}
          <span className="arrow" aria-hidden="true">→</span>
        </span>
      </div>
    </a>
  );
}
