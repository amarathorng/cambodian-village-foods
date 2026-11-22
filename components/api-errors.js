// components/api-errors.js
// Localized text for the error codes the API routes return.
//
// Every user-facing route sends a stable `code` next to its English `error`
// string. The English string stays as-is for logs and for English mode; pages
// render apiMessage() so a Khmer reader never sees an English error. An unknown
// or missing code falls back to the page's own localized message.
const MESSAGES = {
  load_failed: {
    en: "Could not load entries.",
    kh: "មិនអាចផ្ទុកធាតុបានទេ។",
  },
  entry_not_found: {
    en: "Entry not found.",
    kh: "រកមិនឃើញធាតុនេះទេ។",
  },
  load_entry_failed: {
    en: "Could not load the entry.",
    kh: "មិនអាចផ្ទុកធាតុនេះបានទេ។",
  },
  sign_in_to_contribute: {
    en: "You must be signed in to add an entry.",
    kh: "អ្នកត្រូវចូលគណនីជាមុនសិន ទើបអាចបន្ថែមធាតុបាន។",
  },
  invalid_title: {
    en: "Title must be between 1 and 120 characters.",
    kh: "ចំណងជើងត្រូវមានពី 1 ដល់ 120 តួអក្សរ។",
  },
  invalid_title_kh: {
    en: "Khmer title must be between 1 and 120 characters.",
    kh: "ចំណងជើងជាភាសាខ្មែរត្រូវមានពី 1 ដល់ 120 តួអក្សរ។",
  },
  invalid_description: {
    en: "The story must be between 30 and 3000 characters.",
    kh: "រឿងរ៉ាវត្រូវមានពី 30 ដល់ 3000 តួអក្សរ។",
  },
  invalid_description_kh: {
    en: "The Khmer story must be 3000 characters or fewer.",
    kh: "រឿងរ៉ាវជាភាសាខ្មែរត្រូវមានមិនលើសពី 3000 តួអក្សរ។",
  },
  invalid_contributor: {
    en: "Contributor name must be 120 characters or fewer.",
    kh: "ឈ្មោះអ្នកចូលរួមត្រូវមានមិនលើសពី 120 តួអក្សរ។",
  },
  invalid_place: {
    en: "Place must be between 1 and 200 characters.",
    kh: "ទីកន្លែងត្រូវមានពី 1 ដល់ 200 តួអក្សរ។",
  },
  photo_required: {
    en: "A photo is required.",
    kh: "ត្រូវការរូបថតមួយសន្លឹក។",
  },
  photo_too_large: {
    en: "The photo must be 5 MB or smaller.",
    kh: "រូបថតត្រូវមានទំហំ 5 MB ឬតូចជាង។",
  },
  photo_type: {
    en: "The photo must be a JPG, PNG, WEBP, or GIF image.",
    kh: "រូបថតត្រូវជាឯកសារ JPG, PNG, WEBP ឬ GIF។",
  },
  photo_upload_failed: {
    en: "Could not upload the photo. Please try again.",
    kh: "មិនអាចផ្ទុករូបថតឡើងបានទេ។ សូមព្យាយាមម្ដងទៀត។",
  },
  save_failed: {
    en: "Could not save the entry. Please try again.",
    kh: "មិនអាចរក្សាទុកធាតុបានទេ។ សូមព្យាយាមម្ដងទៀត។",
  },
  sign_in_my_entries: {
    en: "You must be signed in to see your entries.",
    kh: "អ្នកត្រូវចូលគណនីជាមុនសិន ទើបមើលធាតុរបស់អ្នកបាន។",
  },
  my_entries_failed: {
    en: "Could not load your entries.",
    kh: "មិនអាចផ្ទុកធាតុរបស់អ្នកបានទេ។",
  },
  sign_in_to_review: {
    en: "You must be signed in to review entries.",
    kh: "អ្នកត្រូវចូលគណនីជាមុនសិន ទើបអាចត្រួតពិនិត្យធាតុបាន។",
  },
  reviewer_check_failed: {
    en: "Could not verify reviewer access.",
    kh: "មិនអាចផ្ទៀងផ្ទាត់សិទ្ធិអ្នកត្រួតពិនិត្យបានទេ។",
  },
  no_reviewer_access: {
    en: "You do not have reviewer access.",
    kh: "អ្នកមិនមានសិទ្ធិជាអ្នកត្រួតពិនិត្យទេ។",
  },
  review_load_failed: {
    en: "Could not load the review queue.",
    kh: "មិនអាចផ្ទុកបញ្ជីរង់ចាំត្រួតពិនិត្យបានទេ។",
  },
  invalid_request: {
    en: "Invalid request.",
    kh: "សំណើមិនត្រឹមត្រូវ។",
  },
  invalid_decision: {
    en: "Decision must be publish or reject.",
    kh: "ការសម្រេចត្រូវជា «ផ្សព្វផ្សាយ» ឬ «បញ្ជូនត្រឡប់»។",
  },
  review_function_stale: {
    en: "The review_entry database function is out of date. Run supabase/review_entry.sql in the Supabase SQL editor, then try again.",
    kh: "មុខងារ review_entry ក្នុងមូលដ្ឋានទិន្នន័យមិនទាន់ថ្មីទេ។ សូមដំណើរការ supabase/review_entry.sql ក្នុង Supabase SQL editor រួចព្យាយាមម្ដងទៀត។",
  },
  review_failed: {
    en: "Could not review this entry.",
    kh: "មិនអាចត្រួតពិនិត្យធាតុនេះបានទេ។",
  },
  review_refused: {
    en: "The database refused this decision and the entry was not changed. Check that supabase/review_entry.sql has been run and that the entry is still pending.",
    kh: "មូលដ្ឋានទិន្នន័យបានបដិសេធការសម្រេចនេះ ហើយធាតុមិនត្រូវបានផ្លាស់ប្ដូរទេ។ សូមពិនិត្យថា supabase/review_entry.sql ត្រូវបានដំណើរការរួចហើយ និងថាធាតុនៅរង់ចាំការត្រួតពិនិត្យ។",
  },
  review_status_unchanged: {
    en: "The review did not change the entry status.",
    kh: "ការត្រួតពិនិត្យមិនបានផ្លាស់ប្ដូរស្ថានភាពធាតុទេ។",
  },
};

// Look up a code. Unknown codes return the caller's own localized fallback.
export function apiMessage(code, language = "en", fallback = "") {
  const entry = MESSAGES[code];
  if (!entry) return fallback;
  return entry[language] || entry.en;
}

// Convenience wrapper for a parsed JSON error body. An unknown code never
// leaks the raw English message into Khmer mode: the caller's localized
// fallback wins, and json.error is only a last resort in English mode.
export function apiErrorMessage(json, language = "en", fallback = "") {
  const entry = MESSAGES[json?.code];
  if (entry) return entry[language] || entry.en;
  if (fallback) return fallback;
  return language === "en" ? json?.error || "" : "";
}
