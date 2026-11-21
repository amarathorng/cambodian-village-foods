// components/FoodCardMedia.js
// Photo block for a food card. Every card uses the same 4:3 frame so the grid
// stays symmetrical no matter how different the source photos are. Shows the
// archive number as a pill, and falls back to a designed placeholder when the
// record has no embeddable image.
import { fonts } from "./theme.js";
import { getImageSrc, hasUnrenderableImage } from "./image-src.js";

const t = {
  en: { viewPhoto: "Photo on Google Drive" },
  kh: { viewPhoto: "រូបថតនៅលើ Google Drive" },
};

export default function FoodCardMedia({ entry, primary, number, language = "en" }) {
  const tUI = t[language] || t.en;
  const imgSrc = getImageSrc(entry.image);
  const driveOnly = hasUnrenderableImage(entry);

  return (
    <div className="food-card-media">
      {imgSrc ? (
        <img className="food-card-img" src={imgSrc} alt={primary} loading="lazy" />
      ) : (
        <div className="food-card-placeholder">
          {driveOnly ? (
            <span className="food-card-placeholder-text" style={{ fontFamily: fonts.stack }}>
              {tUI.viewPhoto}
            </span>
          ) : (
            <span className="food-card-placeholder-title" style={{ fontFamily: fonts.stack }}>
              {primary}
            </span>
          )}
        </div>
      )}
      <span className="food-card-number">{number}</span>
    </div>
  );
}
