const collection = {
  // What does your archive collect? e.g. "Khmer Proverbs"
  name: {
    en: "Cambodian Village Foods",
    kh: "ម្ហូបអាហារភូមិខ្មែរ",
  },

  // One sentence: what is this archive, and why does it matter?
  description: {
    en: "An archive of traditional foods special to specific Cambodian villages and communities.",
    kh: "បណ្ណសារម្ហូបអាហារប្រពៃណីដែលពិសេសតាមភូមិ និងសហគមន៍នានានៅកម្ពុជា។",
  },

  // Who is building this archive? Your name, as you want it shown.
  // The Khmer spelling is a transliteration — adjust it to match your name.
  curator: {
    en: "Thorng Amara",
    kh: "ថោង​ អមរា",
  },

  // Where does your knowledge come from? A person, a place, a community.
  source: {
    en: "Elder villagers and local cooks who share the history and cultural significance of traditional foods with their communities.",
    kh: "អ្នកភូមិជំនាន់មុន និងអ្នកចម្អិនតាមភូមិដែលចែករំលែកប្រវត្តិសាស្ត្រ និងសារៈសំខាន់នៃអាហារទៅកាន់សហគមន៍របស់ពួកគេ។",
  },
};

// Pick the value for the language being viewed, falling back to English.
// Accepts plain strings too, so a single-language value still works.
export function collectionText(value, language = "en") {
  if (typeof value === "string") return value;
  if (!value) return "";
  return value[language] || value.en || "";
}

export default collection;
