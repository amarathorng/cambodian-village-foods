// app/food/[id]/ArticleHeader.js
// Identity block of a food story: the archive kicker, the food name in the
// selected language, the other language beneath it, the recorded place, and
// the share action. Nothing is invented if a field is missing.
"use client";

import ShareButton from "../../../components/ShareButton.js";

const t = {
  en: { kicker: "KHMER LIVING ARCHIVE — ARCHIVE ENTRY" },
  kh: { kicker: "បណ្ណសារជីវិតខ្មែរ — ធាតុបណ្ណសារ" },
};

export default function ArticleHeader({ entry, language }) {
  const tUI = t[language] || t.en;
  const primary = language === "kh" ? entry.khmerTitle || entry.title : entry.title;
  const alternate = language === "kh" ? entry.title : entry.khmerTitle || "";
  const shareText = [entry.title, entry.khmerTitle, entry.place].filter(Boolean).join(" · ");

  return (
    <header>
      <p className="article-kicker">{tUI.kicker}</p>
      <h1 className="article-title">{primary}</h1>
      {alternate && (
        <p
          className={language === "kh" ? "article-alternate" : "article-khmer"}
          lang={language === "kh" ? "en" : "km"}
        >
          {alternate}
        </p>
      )}
      {entry.place && <p className="article-place">{entry.place}</p>}

      <div className="article-actions">
        <ShareButton title={primary} text={shareText} language={language} />
      </div>
    </header>
  );
}
