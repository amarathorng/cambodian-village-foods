// components/EntryFields.js
// Shared form body for /contribute and /food/[id]/edit. Each section is its own
// small component so the create and edit forms stay identical while the markup
// remains readable. The parent owns state, validation, and submission.
import NameFields from "./NameFields.js";
import StoryField from "./StoryField.js";
import KhmerDescriptionField from "./KhmerDescriptionField.js";
import PlaceFields from "./PlaceFields.js";
import PhotoField from "./PhotoField.js";
import { entryFormCopy } from "./entry-form-copy.js";

export default function EntryFields({
  values,
  errors,
  setField,
  handlePhoto,
  onRemovePhoto,
  photo,
  photoNote,
  photoRequired = true,
  language = "en",
}) {
  const tUI = entryFormCopy[language] || entryFormCopy.en;

  return (
    <>
      <div className="form-section">
        <div className="form-section-head">
          <h2 className="form-section-title">{tUI.namesTitle}</h2>
          <span className="form-section-note">{tUI.namesNote}</span>
        </div>
        <NameFields values={values} errors={errors} setField={setField} language={language} />
      </div>

      <div className="form-section">
        <div className="form-section-head">
          <h2 className="form-section-title">{tUI.storyTitle}</h2>
          <span className="form-section-note">{tUI.storyNote}</span>
        </div>
        <StoryField values={values} errors={errors} setField={setField} language={language} />
        <KhmerDescriptionField
          values={values}
          errors={errors}
          setField={setField}
          language={language}
        />
      </div>

      <div className="form-section">
        <div className="form-section-head">
          <h2 className="form-section-title">{tUI.placeTitle}</h2>
          <span className="form-section-note">{tUI.placeNote}</span>
        </div>
        <PlaceFields values={values} errors={errors} setField={setField} language={language} />
      </div>

      <div className="form-section">
        <div className="form-section-head">
          <h2 className="form-section-title">{tUI.photoTitle}</h2>
          <span className="form-section-note">{tUI.photoNote}</span>
        </div>
        <PhotoField
          photo={photo}
          error={errors.photo}
          handlePhoto={handlePhoto}
          onRemove={onRemovePhoto}
          note={photoNote || tUI.photograph}
          required={photoRequired}
          language={language}
        />
      </div>
    </>
  );
}
