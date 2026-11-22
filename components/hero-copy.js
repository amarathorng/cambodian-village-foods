// components/hero-copy.js
// Interface copy for the hero, kept in one module so HeroSection itself stays a
// small composition. Food names and photographs come from the archive, never
// from this file.
import { toKhmerNumber } from "./theme.js";

export const heroCopy = {
  en: {
    label: "KHMER LIVING ARCHIVE",
    body: "A living collection of traditional foods, local knowledge, and personal stories from Cambodian villages and communities.",
    explore: "Explore the Collection",
    contribute: "Share a Story",
    foodsLabel: "Foods archived",
    foodsUnit: "foods",
    placesLabel: "Places recorded",
    placesUnit: "places",
    languagesLabel: "Languages",
    languagesValue: "English · ខ្មែរ",
    captionName: "NOM BANH CHOK",
    captionSub: "Traditional Cambodian food",
    imageAlt: "Nom Banh Chok — Khmer rice noodles with curry soup",
    insetAlt: "fish and rice noodles in a bowl with herbs and vegetables",
  },
  kh: {
    label: "បណ្ណសារជីវិតខ្មែរ",
    heading: "បណ្ដុំម្ហូបអាហារតាមភូមិ",
    body: "បណ្ដុំឯកសាររស់រវើកដែលប្រមូលផ្ដុំរឿងរ៉ាវអំពីម្ហូបប្រពៃណី ចំណេះដឹងក្នុងតំបន់ និងបទពិសោធន៍ផ្ទាល់ខ្លួនពីភូមិ និងសហគមន៍នានានៅកម្ពុជា។",
    explore: "ស្វែងរកបណ្ដុំឯកសារ",
    contribute: "ចូលរួមចំណែក",
    foodsLabel: "មុខម្ហូប",
    foodsUnit: "មុខម្ហូប",
    placesLabel: "ទីកន្លែង",
    placesUnit: "ទីកន្លែង",
    languagesLabel: "ភាសា",
    languagesValue: "ខ្មែរ · English",
    captionName: "នំបញ្ចុក",
    captionSub: "ម្ហូបប្រពៃណីខ្មែរ",
    imageAlt: "នំបញ្ចុក — ម្ហូបប្រពៃណីខ្មែរ",
    insetAlt: "ត្រី និងគុយទាវក្នុងចាន ជាមួយបន្លែ និងគ្រឿងទេស",
  },
};

// Pad to two digits and use Khmer numerals in Khmer mode.
export function formatCount(value, language) {
  const padded = String(value).padStart(2, "0");
  return language === "kh" ? toKhmerNumber(padded) : padded;
}
