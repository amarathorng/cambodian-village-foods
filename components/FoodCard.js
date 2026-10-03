// components/FoodCard.js
// Editorial archive card. The whole card links to the food's detail page so it
// is keyboard-accessible. Shows photograph, archive number, bilingual names, a
// short story excerpt, then a compact contributor / location metadata row.
import { colors, fonts } from "./theme.js";
import { getImageSrc, hasUnrenderableImage } from "./image-src.js";

const t = {
  en: { contributor: "Contributor", place: "Place", read: "Read the story", viewPhoto: "View photo on Google Drive" },
  kh: { contributor: "អ្នកចូលរួម", place: "ទីកន្លែង", read: "Read the story", viewPhoto: "មើលរូបថតនៅលើ Google Drive" },
};

function excerpt(text, words) {
  if (!text) return "";
  const parts = text.split(/\s+/);
  if (parts.length <= words) return text;
  return parts.slice(0, words).join(" ") + " …";
}

export default function FoodCard({ entry, number, total, language = "en", featured = false }) {
  const tUI = t[language] || t.en;
  const primary = language === "kh" ? (entry.khmerTitle || entry.title) : entry.title;
  const secondary = language === "kh" ? entry.title : (entry.khmerTitle || "");

  const imgSrc = getImageSrc(entry.image);
  const driveOnly = hasUnrenderableImage(entry);

  const excerptWords = featured ? 26 : 16;
  const village = (entry.place || "").split(",")[0].trim();

  return (
    <a
      href={`/food/${entry.id}`}
      className="food-card"
      style={{
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        borderRadius: 14,
        overflow: "hidden",
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`,
        height: "100%",
      }}
      aria-label={`${entry.title} — ${entry.contributor}, ${entry.place}`}
    >
      <div className="food-card-media" style={{ position: "relative", aspectRatio: "3/3", overflow: "hidden" }}>
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={primary}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : driveOnly ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: colors.muted, fontSize: 14, fontFamily: fonts.stack }}>
            {tUI.viewPhoto}
          </div>
        ) : (
          <div className="food-card-placeholder" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", backgroundColor: colors.elevated }}>
            <span style={{ fontFamily: fonts.stack, fontSize: 18, fontWeight: 700, color: colors.text2 }}>{primary}</span>
          </div>
        )}
        <span
          className="food-card-number"
          style={{
            position: "absolute",
            left: 10,
            top: 10,
            fontFamily: fonts.stack,
            fontSize: 12,
            letterSpacing: "0.08em",
            color: colors.green2,
            backgroundColor: "rgba(23,28,25,0.85)",
            padding: "2px 8px",
            borderRadius: 6,
          }}
        >
          {number}
        </span>
      </div>

      <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
        <h3 style={{ margin: 0, fontFamily: fonts.stack, fontSize: 21, fontWeight: 700, color: colors.text, lineHeight: 1.2 }}>
          {primary}
        </h3>
        {secondary && (
          <p style={{ margin: 0, fontFamily: fonts.khmer, fontSize: 17, fontWeight: 500, color: colors.text2, lineHeight: 1.4 }}>
            {secondary}
          </p>
        )}
        <p
          style={{
            margin: 0,
            fontFamily: fonts.stack,
            fontSize: featured ? 16 : 14.5,
            lineHeight: 1.55,
            color: colors.text2,
            display: "-webkit-box",
            WebkitLineClamp: featured ? 5 : 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {excerpt(entry.description || "", excerptWords)}
        </p>

        <div style={{ display: "flex", gap: 8, marginTop: 4, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontFamily: fonts.stack, fontSize: 12, letterSpacing: "0.06em", color: colors.muted }}>{tUI.contributor}:</span>
          <span style={{ fontFamily: fonts.stack, fontSize: 13.5, fontWeight: 600, color: colors.text2 }}>{entry.contributor}</span>
          <span aria-hidden="true" style={{ color: colors.border }}>·</span>
          <span style={{ fontFamily: fonts.stack, fontSize: 12, letterSpacing: "0.06em", color: colors.muted }}>{tUI.place}:</span>
          <span style={{ fontFamily: fonts.stack, fontSize: 13.5, color: colors.text2 }}>{entry.place}</span>
        </div>

        <span className="food-card-link" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, alignSelf: "flex-start", fontFamily: fonts.stack, fontSize: 14, fontWeight: 700, color: colors.green2 }}>
          <span className="read-link-text">{tUI.read}</span>
          <span className="arrow-dot" aria-hidden="true">→</span>
        </span>
      </div>
    </a>
  );
}