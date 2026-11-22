// components/NameFields.js
// The two required food names, side by side. Both languages are mandatory in
// the archive, so each field shows a required marker, a character counter, and
// its own validation message.
import { TITLE_MAX } from "./entryValidation.js";
import { entryFormCopy } from "./entry-form-copy.js";

export default function NameFields({ values, errors, setField, language = "en" }) {
  const tUI = entryFormCopy[language] || entryFormCopy.en;

  return (
    <div className="field-row">
      <label className="auth-field" htmlFor="title_english">
        <span className="field-top">
          <span className="auth-label">
            {tUI.titleEnglish} <span className="required" aria-hidden="true">*</span>
          </span>
          <span className="field-count">
            {values.title_english.length}/{TITLE_MAX}
          </span>
        </span>
        <input
          id="title_english"
          className="auth-input"
          type="text"
          value={values.title_english}
          onChange={setField("title_english")}
          maxLength={TITLE_MAX}
          aria-invalid={errors.title_english ? "true" : undefined}
          aria-describedby={errors.title_english ? "title_english-error" : undefined}
        />
        {errors.title_english && (
          <p className="field-error" id="title_english-error" role="alert">
            {errors.title_english}
          </p>
        )}
      </label>

      <label className="auth-field" htmlFor="title_khmer">
        <span className="field-top">
          <span className="auth-label">
            {tUI.titleKhmer}{" "}
            <span className="required" aria-hidden="true">*</span>
          </span>
          <span className="field-count">
            {values.title_khmer.length}/{TITLE_MAX}
          </span>
        </span>
        <input
          id="title_khmer"
          className="auth-input khmer"
          type="text"
          lang="km"
          value={values.title_khmer}
          onChange={setField("title_khmer")}
          maxLength={TITLE_MAX}
          aria-invalid={errors.title_khmer ? "true" : undefined}
          aria-describedby={errors.title_khmer ? "title_khmer-error" : undefined}
        />
        {errors.title_khmer && (
          <p className="field-error" id="title_khmer-error" role="alert">
            {errors.title_khmer}
          </p>
        )}
      </label>
    </div>
  );
}
