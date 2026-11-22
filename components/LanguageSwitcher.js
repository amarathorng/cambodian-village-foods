// components/LanguageSwitcher.js
// English / Khmer segmented control used in the navigation. It changes only
// interface labels; food names and stories are never translated.
"use client";

const NAMES = { en: "English", kh: "ខ្មែរ" };

export default function LanguageSwitcher({ language, setLanguage }) {
  return (
    <div
      className="lang-switch"
      role="group"
      aria-label={language === "kh" ? "ភាសា" : "Language"}
    >
      {["en", "kh"].map((code) => (
        <button
          key={code}
          type="button"
          className="lang-btn"
          aria-pressed={language === code}
          lang={code === "kh" ? "km" : "en"}
          onClick={() => setLanguage(code)}
        >
          {NAMES[code]}
        </button>
      ))}
    </div>
  );
}
