// components/PhotoField.js
// File input with a live local preview. The preview uses an object URL, so the
// image is shown before anything is uploaded — nothing is sent to the server
// until the form is submitted. Removing the file clears the input as well, so
// choosing the same file again still fires a change event.
"use client";

import { useEffect, useMemo, useRef } from "react";
import { entryFormCopy } from "./entry-form-copy.js";

const PHOTO_ACCEPT =
  ".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif";

export default function PhotoField({
  photo,
  error,
  handlePhoto,
  onRemove,
  note,
  required = true,
  hint,
  language = "en",
}) {
  const tUI = entryFormCopy[language] || entryFormCopy.en;
  const inputRef = useRef(null);
  const previewUrl = useMemo(
    () => (photo ? URL.createObjectURL(photo) : ""),
    [photo]
  );

  // Release the object URL when the file changes or the form unmounts.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const sizeKb = photo?.size ? Math.max(1, Math.round(photo.size / 1024)) : 0;

  return (
    <div className="auth-field">
      <span className="field-top">
        <span className="auth-label">
          {note || tUI.photograph}{" "}
          {required && <span className="required" aria-hidden="true">*</span>}
        </span>
        {photo && <span className="field-count">{sizeKb} KB</span>}
      </span>

      <input
        ref={inputRef}
        id="photo"
        className="file-input"
        type="file"
        accept={PHOTO_ACCEPT}
        onChange={handlePhoto}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? "photo-error" : "photo-hint"}
      />
      <label htmlFor="photo" className="file-trigger">
        {photo ? tUI.changePhoto : tUI.choosePhoto}
      </label>
      <p className="field-help" id="photo-hint">{hint || tUI.photoHint}</p>

      {previewUrl && (
        <div className="photo-preview">
          <img src={previewUrl} alt={tUI.previewAlt(photo?.name)} />
          <div className="photo-preview-bar">
            <span className="photo-preview-name">{photo?.name}</span>
            <button
              type="button"
              className="btn btn--quiet btn--sm"
              onClick={() => {
                if (inputRef.current) inputRef.current.value = "";
                onRemove?.();
              }}
            >
              {tUI.removePhoto}
            </button>
          </div>
        </div>
      )}

      {error && <p className="field-error" id="photo-error" role="alert">{error}</p>}
    </div>
  );
}
