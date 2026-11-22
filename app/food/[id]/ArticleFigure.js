// app/food/[id]/ArticleFigure.js
// The entry photograph presented as a click-to-enlarge figure. The lightbox
// reuses the already-loaded image, so opening it costs no extra download.
"use client";

import { useState } from "react";
import ImageLightbox from "../../../components/ImageLightbox.js";
import { getImageSrc, hasUnrenderableImage } from "../../../components/image-src.js";

const t = {
  en: {
    zoom: "View photograph larger",
    drive: "View photo on Google Drive",
    placeholder: "No photograph for this entry",
  },
  kh: {
    zoom: "មើលរូបភាពធំជាងនេះ",
    drive: "មើលរូបថតនៅលើ Google Drive",
    placeholder: "គ្មានរូបថតសម្រាប់ធាតុនេះទេ",
  },
};

export default function ArticleFigure({ entry, title, language = "en" }) {
  const tUI = t[language] || t.en;
  const [open, setOpen] = useState(false);
  const imgSrc = getImageSrc(entry.image);

  return (
    <>
      <figure className="article-figure">
        {imgSrc ? (
          <button
            type="button"
            className="article-figure-btn"
            onClick={() => setOpen(true)}
            aria-label={tUI.zoom}
          >
            <img src={imgSrc} alt={title} width={1280} height={800} />
            <span aria-hidden="true">⤢ {tUI.zoom}</span>
          </button>
        ) : hasUnrenderableImage(entry) ? (
          <div className="food-card-placeholder">
            <a href={entry.image} target="_blank" rel="noreferrer">
              {tUI.drive}
            </a>
          </div>
        ) : (
          <div className="food-card-placeholder">
            <span className="food-card-placeholder-title">{title}</span>
          </div>
        )}
      </figure>

      <ImageLightbox
        open={open}
        src={imgSrc}
        alt={title}
        caption={[title, entry.place].filter(Boolean).join(" · ")}
        language={language}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
