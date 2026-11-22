// components/StoryField.js
// The story textarea with a live character count and a gentle hint. The
// minimum and maximum come from entryValidation.js, the same rules the server
// enforces, so the two can never drift apart.
import { DESC_MIN, DESC_MAX } from "./entryValidation.js";
import { entryFormCopy } from "./entry-form-copy.js";

export default function StoryField({ values, errors, setField, language = "en" }) {
  const tUI = entryFormCopy[language] || entryFormCopy.en;

  return (
    <label className="auth-field" htmlFor="description_english">
      <span className="field-top">
        <span className="auth-label">
          {tUI.storyLabel} <span className="required" aria-hidden="true">*</span>
        </span>
        <span className="field-count">
          {values.description_english.length}/{DESC_MAX}
        </span>
      </span>
      <textarea
        id="description_english"
        className={language === "kh" ? "auth-input khmer" : "auth-input"}
        lang={language === "kh" ? "km" : undefined}
        value={values.description_english}
        onChange={setField("description_english")}
        maxLength={DESC_MAX}
        placeholder={tUI.storyPlaceholder}
        aria-invalid={errors.description_english ? "true" : undefined}
        aria-describedby={errors.description_english ? "description-error" : "description-hint"}
      />
      <p className="field-help" id="description-hint">
        {tUI.storyHelp} {tUI.minChars(DESC_MIN)}
      </p>
      {errors.description_english && (
        <p className="field-error" id="description-error" role="alert">
          {errors.description_english}
        </p>
      )}
    </label>
  );
}
