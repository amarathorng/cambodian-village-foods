// components/FoodCardMedia.js
// Photo block for a food card: shared 4:3 frame, soft bottom shade, archive
// number, and a "read" affordance over the image. Falls back to a designed
// placeholder when the record has no embeddable photograph.
import { getImageSrc, hasUnrenderableImage } from "./image-src.js";

const t = {
  en: { viewPhoto: "Photo on Google Drive", view: "View story" },
  kh: { viewPhoto: "រូបថតនៅលើ Google Drive", view: "អានបន្ថែម" },
};

export default function FoodCardMedia({
  entry,
  primary,
  number,
  language = "en",
  priority = false,
}) {
  const tUI = t[language] || t.en;
  const imgSrc = getImageSrc(entry.image);
  const driveOnly = hasUnrenderableImage(entry);

  return (
    <div className="food-card-media">
      {imgSrc ? (
        <img
          className="food-card-img"
          src={imgSrc}
          alt={primary}
          width={800}
          height={600}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
        />
      ) : (
        <div className="food-card-placeholder">
          {driveOnly ? (
            <span className="food-card-placeholder-text">{tUI.viewPhoto}</span>
          ) : (
            <span className="food-card-placeholder-title">{primary}</span>
          )}
        </div>
      )}

      {number && <span className="food-card-number">{number}</span>}

      {/* The whole card is the link, so this affordance is decorative. */}
      <span className="food-card-overlay" aria-hidden="true">
        <span>{tUI.view}</span>
        <span className="arrow">→</span>
      </span>
    </div>
  );
}
