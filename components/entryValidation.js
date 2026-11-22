// components/entryValidation.js
// Single source of truth for the entry form's field limits and validation rules.
// The create (/contribute) and edit (/food/[id]/edit) forms both import from here
// so every page enforces exactly the same rules with the same messages.
//
// `requirePhoto` is true when creating (a photo is mandatory) and false when
// editing (a user may keep the existing photo by not choosing a new file).
// `language` selects the message language; English stays the default.
import { validationCopy } from "./entry-form-copy.js";

export const TITLE_MAX = 120; // English and Khmer titles, contributor
export const PLACE_MAX = 200; // village / place
export const DESC_MIN = 30; // a story needs substance
export const DESC_MAX = 3000;
export const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// Returns an object of per-field error messages. Keys match the input names so
// a <p className="field-error"> can be shown right under the offending field.
export function validate(values, photo, requirePhoto = true, language = "en") {
  const e = {};
  const msg = validationCopy[language] || validationCopy.en;
  const te = values.title_english.trim();
  const tk = values.title_khmer.trim();
  const desc = values.description_english.trim();
  const contributor = values.contributor.trim();
  const place = values.place.trim();

  if (!te) e.title_english = msg.titleRequired;
  else if (te.length > TITLE_MAX) e.title_english = msg.titleMax(TITLE_MAX);
  if (!tk) e.title_khmer = msg.titleKhRequired;
  else if (tk.length > TITLE_MAX) e.title_khmer = msg.titleKhMax(TITLE_MAX);
  if (!desc) e.description_english = msg.storyRequired;
  else if (desc.length < DESC_MIN) e.description_english = msg.storyMin(DESC_MIN);
  else if (desc.length > DESC_MAX) e.description_english = msg.storyMax(DESC_MAX);
  if (contributor.length > TITLE_MAX) e.contributor = msg.contributorMax(TITLE_MAX);
  if (!place) e.place = msg.placeRequired;
  else if (place.length > PLACE_MAX) e.place = msg.placeMax(PLACE_MAX);

  // Creating always requires a photo. When editing, a photo is optional, but if
  // one is provided it must still be a valid image of an acceptable size.
  if (photo && photo.size) {
    if (photo.size > MAX_FILE_BYTES) e.photo = msg.photoTooLarge;
    else if (!ALLOWED_TYPES.includes(photo.type)) e.photo = msg.photoType;
  } else if (requirePhoto) {
    e.photo = msg.photoRequired;
  }

  return e;
}
