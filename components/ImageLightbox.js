// components/ImageLightbox.js
// Lightweight, accessible image viewer. Keyboard support (Escape, Tab trap),
// a visible close button, and a click on the backdrop all close it. No image
// library and no extra downloads: it reuses the already-loaded photograph.
"use client";

import { useId, useRef } from "react";
import { useModal } from "./useModal.js";

const t = {
  en: { close: "Close image" },
  kh: { close: "បិទរូបភាព" },
};

export default function ImageLightbox({ open, src, alt, caption, language = "en", onClose }) {
  const tUI = t[language] || t.en;
  const panelRef = useRef(null);
  const captionId = useId();
  useModal(open, panelRef, onClose);

  if (!open || !src) return null;

  return (
    <div
      className="lightbox-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="lightbox"
        role="dialog"
        aria-modal="true"
        aria-labelledby={captionId}
        ref={panelRef}
        tabIndex={-1}
      >
        <button type="button" className="lightbox-close" onClick={onClose} aria-label={tUI.close}>
          ×
        </button>
        <img src={src} alt={alt} />
        <p className="lightbox-caption" id={captionId}>{caption || alt}</p>
      </div>
    </div>
  );
}
