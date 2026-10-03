// components/EntryFields.js
// The input set shared by the create (/contribute) and edit (/food/[id]/edit)
// forms, so both pages render identical fields, limits, and per-field messages.
// The parent owns state and submit logic; this component is presentational only.
import { TITLE_MAX, PLACE_MAX, DESC_MAX } from "./entryValidation.js";

const PHOTO_ACCEPT =
  ".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif";

export default function EntryFields({ values, errors, setField, handlePhoto, photoNote }) {
  return (
    <>
      <label className="auth-field" htmlFor="title_english">
        <span className="auth-label">Title (English)</span>
        <input id="title_english" className="auth-input" type="text" value={values.title_english} onChange={setField("title_english")} maxLength={TITLE_MAX} />
        {errors.title_english && <p className="field-error" role="alert">{errors.title_english}</p>}
      </label>

      <label className="auth-field" htmlFor="title_khmer">
        <span className="auth-label">Title (Khmer / ចំណងជើងជាភាសាខ្មែរ)</span>
        <input id="title_khmer" className="auth-input" type="text" value={values.title_khmer} onChange={setField("title_khmer")} maxLength={TITLE_MAX} />
        {errors.title_khmer && <p className="field-error" role="alert">{errors.title_khmer}</p>}
      </label>

      <label className="auth-field" htmlFor="description_english">
        <span className="auth-label">The story</span>
        <textarea id="description_english" className="auth-input" value={values.description_english} onChange={setField("description_english")} maxLength={DESC_MAX} placeholder="Who made it, when, and why is it special to your family?" />
        {errors.description_english && <p className="field-error" role="alert">{errors.description_english}</p>}
      </label>

      <label className="auth-field" htmlFor="contributor">
        <span className="auth-label">Contributor (who shared the story)</span>
        <input id="contributor" className="auth-input" type="text" value={values.contributor} onChange={setField("contributor")} maxLength={TITLE_MAX} />
        {errors.contributor && <p className="field-error" role="alert">{errors.contributor}</p>}
      </label>

      <label className="auth-field" htmlFor="place">
        <span className="auth-label">Village / Place</span>
        <input id="place" className="auth-input" type="text" value={values.place} onChange={setField("place")} maxLength={PLACE_MAX} />
        {errors.place && <p className="field-error" role="alert">{errors.place}</p>}
      </label>

      <label className="auth-field" htmlFor="photo">
        <span className="auth-label">{photoNote}</span>
        <input id="photo" className="auth-input" type="file" accept={PHOTO_ACCEPT} onChange={handlePhoto} />
        {errors.photo && <p className="field-error" role="alert">{errors.photo}</p>}
      </label>
    </>
  );
}
