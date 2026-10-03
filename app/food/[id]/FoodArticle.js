// app/food/[id]/FoodArticle.js
// Renders one archive entry as an editorial reading page: identity, photograph,
// the full personal story, contributor, place, source note, and prev/next links.
import { colors, fonts } from "../../../components/theme.js";
import { getImageSrc, hasUnrenderableImage } from "../../../components/image-src.js";

const t = {
  en: {
    entryKicker: "KHMER LIVING ARCHIVE — ARCHIVE ENTRY",
    story: "The story",
    contributor: "Contributor",
    place: "Place",
    source: "Source & community knowledge",
    sourceText: "Village elders and local cooks who share the food's history and importance to their community.",
    prev: "‹ Previous",
    next: "Next ›",
    back: "Back to all foods",
    viewPhoto: "View photo on Google Drive",
  },
  kh: {
    entryKicker: "KHMER LIVING ARCHIVE — ARCHIVE ENTRY",
    story: "The story",
    contributor: "អ្នកចូលរួម",
    place: "ទីកន្លែង",
    source: "Source & community knowledge",
    sourceText: "Village elders and local cooks who share the food's history and importance to their community.",
    prev: "‹ Previous",
    next: "Next ›",
    back: "Back to all foods",
    viewPhoto: "មើលរូបថតនៅលើ Google Drive",
  },
};

export default function FoodArticle({ entry, entries, index, language = "en" }) {
  const tUI = t[language] || t.en;
  const primary = language === "kh" ? (entry.khmerTitle || entry.title) : entry.title;
  const alternate = language === "kh" ? entry.title : (entry.khmerTitle || "");
  const imgSrc = getImageSrc(entry.image);
  const prevId = index - 1 >= 0 ? entries[index - 1].id : entries[entries.length - 1].id;
  const nextId = index + 1 < entries.length ? entries[index + 1].id : entries[0].id;

  return (
    <article className="reveal" style={{ marginTop: 32 }}>
      <p style={{ margin: 0, fontFamily: fonts.stack, fontSize: 12, letterSpacing: "0.16em", color: colors.muted }}>
        {tUI.entryKicker}
      </p>
      <h1 style={{ margin: "16px 0 8px", fontFamily: fonts.stack, fontSize: 44, lineHeight: 1.1, fontWeight: 700, color: colors.text }}>
        {primary}
      </h1>
      {alternate && (
        <p style={{ margin: "0 0 8px", fontFamily: fonts.khmer, fontSize: 24, lineHeight: 1.4, color: colors.text2 }}>
          {alternate}
        </p>
      )}
      <p style={{ margin: "8px 0 0", fontFamily: fonts.stack, fontSize: 16, color: colors.text2 }}>{entry.place}</p>

      <figure style={{ margin: "30px 0 0" }}>
        {imgSrc ? (
          <div style={{ borderRadius: 16, overflow: "hidden" }}>
            <img src={imgSrc} alt={primary} width={1280} height={960} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
          </div>
        ) : hasUnrenderableImage(entry) ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 320, borderRadius: 16, backgroundColor: colors.elevated, color: colors.muted }}>
            <a href={entry.image} target="_blank" rel="noreferrer" style={{ color: colors.green2, textDecoration: "none", fontWeight: 600 }}>
              {tUI.viewPhoto}
            </a>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 320, borderRadius: 16, backgroundColor: colors.elevated, color: colors.text2 }}>
            <span style={{ fontFamily: fonts.stack, fontSize: 18, fontWeight: 700 }}>{primary}</span>
          </div>
        )}
      </figure>

      <section style={{ marginTop: 36 }}>
        <h2 style={{ margin: "0 0 14px", fontFamily: fonts.stack, fontSize: 20, fontWeight: 700, color: colors.green2 }}>
          {tUI.story}
        </h2>
        <p style={{ margin: 0, fontFamily: fonts.stack, fontSize: 19, lineHeight: 1.85, color: colors.text2 }}>
          {entry.description}
        </p>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 40 }}>
        <div>
          <p style={{ margin: "0 0 8px", fontFamily: fonts.stack, fontSize: 14, letterSpacing: "0.08em", color: colors.muted }}>{tUI.contributor}</p>
          <p style={{ margin: 0, fontFamily: fonts.stack, fontSize: 19, fontWeight: 700, color: colors.text }}>{entry.contributor}</p>
        </div>
        <div>
          <p style={{ margin: "0 0 8px", fontFamily: fonts.stack, fontSize: 14, letterSpacing: "0.08em", color: colors.muted }}>{tUI.place}</p>
          <p style={{ margin: 0, fontFamily: fonts.stack, fontSize: 16, color: colors.text2 }}>{entry.place}</p>
        </div>
      </div>

      <p style={{ marginTop: 26, fontFamily: fonts.stack, fontSize: 14, lineHeight: 1.6, color: colors.muted, fontStyle: "italic", borderLeft: "2px solid " + colors.gold, paddingLeft: 14 }}>
        <span style={{ color: colors.text2, fontWeight: 600 }}>{tUI.source}: </span>
        {tUI.sourceText}
      </p>

      <nav aria-label="Related foods" style={{ display: "flex", gap: 20, marginTop: 48, alignItems: "center", flexWrap: "wrap" }}>
        <a href={`/food/${prevId}`} className="pref-next" style={{ fontFamily: fonts.stack, fontSize: 15, color: colors.green2, textDecoration: "none", fontWeight: 600 }}>{tUI.prev}</a>
        <a href="/#collection" style={{ fontFamily: fonts.stack, fontSize: 15, color: colors.text2, textDecoration: "none" }}>{tUI.back}</a>
        <a href={`/food/${nextId}`} className="pref-next" style={{ fontFamily: fonts.stack, fontSize: 15, color: colors.green2, textDecoration: "none", fontWeight: 600 }}>{tUI.next}</a>
      </nav>
    </article>
  );
}