// components/PlaceFields.js
// Who shared the story and where it comes from. The contributor may stay empty
// for people who prefer to remain anonymous; the place is required because it
// is part of how the archive is organised.
import { TITLE_MAX, PLACE_MAX } from "./entryValidation.js";
import { entryFormCopy } from "./entry-form-copy.js";

export default function PlaceFields({ values, errors, setField, language = "en" }) {
  const tUI = entryFormCopy[language] || entryFormCopy.en;

  return (
    <div className="field-row">
      <label className="auth-field" htmlFor="contributor">
        <span className="field-top">
          <span className="auth-label">{tUI.contributor}</span>
          <span className="field-count">
            {values.contributor.length}/{TITLE_MAX}
          </span>
        </span>
        <input
          id="contributor"
          className="auth-input"
          type="text"
          value={values.contributor}
          onChange={setField("contributor")}
          maxLength={TITLE_MAX}
          placeholder={tUI.contributorPlaceholder}
          aria-invalid={errors.contributor ? "true" : undefined}
          aria-describedby={errors.contributor ? "contributor-error" : "contributor-hint"}
        />
        <p className="field-help" id="contributor-hint">
          {tUI.contributorHelp}
        </p>
        {errors.contributor && (
          <p className="field-error" id="contributor-error" role="alert">
            {errors.contributor}
          </p>
        )}
      </label>

      <label className="auth-field" htmlFor="place">
        <span className="field-top">
          <span className="auth-label">
            {tUI.place} <span className="required" aria-hidden="true">*</span>
          </span>
          <span className="field-count">
            {values.place.length}/{PLACE_MAX}
          </span>
        </span>
        <input
          id="place"
          className="auth-input"
          type="text"
          value={values.place}
          onChange={setField("place")}
          maxLength={PLACE_MAX}
          placeholder={tUI.placePlaceholder}
          aria-invalid={errors.place ? "true" : undefined}
          aria-describedby={errors.place ? "place-error" : undefined}
        />
        {errors.place && (
          <p className="field-error" id="place-error" role="alert">
            {errors.place}
          </p>
        )}
      </label>
    </div>
  );
}
