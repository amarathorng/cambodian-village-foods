// components/KhmerDescriptionField.js
// The optional Khmer version of the story. It sits beside StoryField but is
// never required: a contributor who leaves it blank still has a valid entry,
// and the public page falls back to the English story. The cap matches
// DESC_MAX from entryValidation.js so the two textareas cannot drift apart.
import { DESC_MAX } from "./entryValidation.js";
import { entryFormCopy } from "./entry-form-copy.js";

export default function KhmerDescriptionField({ values, errors, setField, language = "en" }) {
  const tUI = entryFormCopy[language] || entryFormCopy.en;
  const text = values.description_kh || "";

  return (
    <label className="auth-field" htmlFor="description_kh">
      <span className="field-top">
        <span className="auth-label">{tUI.khLabel}</span>
        <span className="field-count">
          {text.length}/{DESC_MAX}
        </span>
      </span>
      <textarea
        id="description_kh"
        className="auth-input khmer"
        lang="km"
        value={text}
        onChange={setField("description_kh")}
        maxLength={DESC_MAX}
        placeholder={tUI.khPlaceholder}
        aria-invalid={errors.description_kh ? "true" : undefined}
        aria-describedby={
          errors.description_kh ? "description_kh-error" : "description_kh-hint"
        }
      />
      <p className="field-help" id="description_kh-hint">
        {tUI.khHelp}
      </p>
      {errors.description_kh && (
        <p className="field-error" id="description_kh-error" role="alert">
          {errors.description_kh}
        </p>
      )}
    </label>
  );
}
