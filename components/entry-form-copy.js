// components/entry-form-copy.js
// Validation messages for the shared entry form. They live beside the rest of
// the form copy so the rules in entryValidation.js stay short, and so the
// client messages match the server's wording in both languages.
export const validationCopy = {
  en: {
    titleRequired: "Please enter a title.",
    titleMax: (max) => `Keep the title under ${max} characters.`,
    titleKhRequired: "Please enter the Khmer title.",
    titleKhMax: (max) => `Keep the Khmer title under ${max} characters.`,
    storyRequired: "Please tell the story.",
    storyMin: (min) => `Please write at least ${min} characters.`,
    storyMax: (max) => `Please keep the story under ${max} characters.`,
    contributorMax: (max) => `Keep the name under ${max} characters.`,
    placeRequired: "Please enter the village or place.",
    placeMax: (max) => `Keep the place under ${max} characters.`,
    photoTooLarge: "The photo must be 5 MB or smaller.",
    photoType: "The photo must be a JPG, PNG, WEBP, or GIF image.",
    photoRequired: "Please choose a photo.",
  },
  kh: {
    titleRequired: "សូមបញ្ចូលចំណងជើង។",
    titleMax: (max) => `សូមរក្សាចំណងជើងឱ្យមានមិនលើសពី ${max} តួអក្សរ។`,
    titleKhRequired: "សូមបញ្ចូលចំណងជើងជាភាសាខ្មែរ។",
    titleKhMax: (max) => `សូមរក្សាចំណងជើងជាភាសាខ្មែរឱ្យមានមិនលើសពី ${max} តួអក្សរ។`,
    storyRequired: "សូមសរសេររឿងរ៉ាវ។",
    storyMin: (min) => `សូមសរសេរយ៉ាងតិច ${min} តួអក្សរ។`,
    storyMax: (max) => `សូមរក្សារឿងរ៉ាវឱ្យមានមិនលើសពី ${max} តួអក្សរ។`,
    contributorMax: (max) => `សូមរក្សាឈ្មោះឱ្យមានមិនលើសពី ${max} តួអក្សរ។`,
    placeRequired: "សូមបញ្ចូលភូមិ ឬទីកន្លែង។",
    placeMax: (max) => `សូមរក្សាទីកន្លែងឱ្យមានមិនលើសពី ${max} តួអក្សរ។`,
    photoTooLarge: "រូបថតត្រូវមានទំហំ 5 MB ឬតូចជាង។",
    photoType: "រូបថតត្រូវជាឯកសារ JPG, PNG, WEBP ឬ GIF។",
    photoRequired: "សូមជ្រើសរើសរូបថត។",
  },
};

// Interface copy for the shared entry form (/contribute and /food/[id]/edit).
// Kept in one module so each field component stays small and both forms show
// identical wording. Contributor-written content never comes from here.
export const entryFormCopy = {
  en: {
    namesTitle: "Food names",
    namesNote: "English and Khmer are both required",
    storyTitle: "The story",
    storyNote: "Written in your own words",
    placeTitle: "Place & people",
    placeNote: "Where the story comes from",
    photoTitle: "Photograph",
    photoNote: "A picture of the food itself",
    photograph: "Photograph",

    titleEnglish: "Title (English)",
    titleKhmer: "Title (Khmer / ចំណងជើងជាភាសាខ្មែរ)",

    storyLabel: "What is the food, and why does it matter?",
    storyPlaceholder: "Who makes it, when, and why is it special to your family or village?",
    storyHelp:
      "Write it the way you would tell it out loud. Khmer names and words can stay exactly as written.",
    minChars: (count) => `At least ${count} characters.`,

    khLabel: "Story (Khmer) — optional",
    khPlaceholder: "Write the story in Khmer if you would like to.",
    khHelp:
      "Optional. Readers browsing in Khmer see this story instead of the English one. Leave it empty and the English story is shown to everyone.",

    contributor: "Contributor (who shared the story)",
    contributorPlaceholder: "e.g. My grandmother, or Anonymous",
    contributorHelp: "Leave this empty if the person prefers to stay anonymous.",
    place: "Village / Place",
    placePlaceholder: "e.g. Kandieng District, Pursat Province",

    choosePhoto: "Choose a photo",
    changePhoto: "Choose a different photo",
    removePhoto: "Remove",
    previewAlt: (name) => `Preview of ${name || "the chosen photograph"}`,
    photoHint: "JPG, PNG, WEBP or GIF · up to 5 MB · Khmer text in the photo is welcome.",
  },
  kh: {
    namesTitle: "ឈ្មោះម្ហូប",
    namesNote: "ត្រូវការទាំងភាសាអង់គ្លេស និងភាសាខ្មែរ",
    storyTitle: "រឿងរ៉ាវ",
    storyNote: "សរសេរតាមពាក្យរបស់អ្នកផ្ទាល់",
    placeTitle: "ទីកន្លែង និងបុគ្គល",
    placeNote: "រឿងនេះមកពីណា",
    photoTitle: "រូបថត",
    photoNote: "រូបភាពរបស់ម្ហូបផ្ទាល់",
    photograph: "រូបថត",

    titleEnglish: "ចំណងជើង (អង់គ្លេស)",
    titleKhmer: "ចំណងជើង (ខ្មែរ)",

    storyLabel: "ម្ហូបនេះជាអ្វី ហើយហេតុអ្វីបានជាវាសំខាន់?",
    storyPlaceholder: "តើអ្នកណាធ្វើវា ពេលណា ហើយហេតុអ្វីបានជាវាពិសេសសម្រាប់គ្រួសារ ឬភូមិរបស់អ្នក?",
    storyHelp:
      "សរសេរដូចអ្នកកំពុងនិយាយប្រាប់។ ឈ្មោះ និងពាក្យខ្មែរអាចរក្សាទុកដូចដើម។",
    minChars: (count) => `យ៉ាងតិច ${count} តួអក្សរ។`,

    khLabel: "រឿងរ៉ាវ (ខ្មែរ) — មិនចាំបាច់",
    khPlaceholder: "សរសេររឿងរ៉ាវជាភាសាខ្មែរ ប្រសិនបើអ្នកចង់។",
    khHelp:
      "មិនចាំបាច់ទេ។ អ្នកអានដែលប្រើភាសាខ្មែរនឹងឃើញរឿងរ៉ាវនេះជំនួសរឿងរ៉ាវជាភាសាអង់គ្លេស។ ប្រសិនបើទុកទំនេរ អ្នកគ្រប់គ្នានឹងឃើញរឿងរ៉ាវជាភាសាអង់គ្លេស។",

    contributor: "អ្នកចូលរួម (អ្នកដែលចែករំលែករឿងនេះ)",
    contributorPlaceholder: "ឧ. ជីដូនរបស់ខ្ញុំ ឬ អនាមិក",
    contributorHelp: "ទុកទំនេរ ប្រសិនបើអ្នកនោះចង់រក្សាអនាមិកភាព។",
    place: "ភូមិ / ទីកន្លែង",
    placePlaceholder: "ឧ. ស្រុកកណ្ដៀង ខេត្តពោធិ៍សាត់",

    choosePhoto: "ជ្រើសរើសរូបថត",
    changePhoto: "ជ្រើសរើសរូបថតផ្សេង",
    removePhoto: "ដកចេញ",
    previewAlt: (name) => `ការមើលជាមុននៃ ${name || "រូបថតដែលបានជ្រើសរើស"}`,
    photoHint: "JPG, PNG, WEBP ឬ GIF · ទំហំរហូតដល់ 5 MB · អក្សរខ្មែរក្នុងរូបថតគឺស្វាគមន៍។",
  },
};
