// app/food/[id]/ArticleAside.js
// The facts beside a story: who shared it, the place it belongs to, and the
// archive's standing note about where community knowledge comes from.
const t = {
  en: {
    facts: "Record details",
    contributor: "Contributor",
    place: "Place",
    anonymous: "Anonymous",
    source: "Source & community knowledge",
    sourceText:
      "Village elders and local cooks who share the food's history and importance to their community.",
  },
  kh: {
    facts: "ព័ត៌មានធាតុ",
    contributor: "អ្នកចូលរួម",
    place: "ទីកន្លែង",
    anonymous: "អនាមិក",
    source: "ប្រភព និងចំណេះដឹងសហគមន៍",
    sourceText:
      "អ្នកភូមិជំនាន់មុន និងអ្នកចម្អិនម្ហូបក្នុងតំបន់ ដែលចែករំលែកប្រវត្តិរបស់ម្ហូបនេះ និងសារៈសំខាន់របស់វាចំពោះសហគមន៍របស់ពួកគេ។",
  },
};

export default function ArticleAside({ entry, language }) {
  const tUI = t[language] || t.en;

  return (
    <aside className="article-aside" aria-label={tUI.facts}>
      <div>
        <p className="aside-label">{tUI.contributor}</p>
        <p className="aside-value">{entry.contributor || tUI.anonymous}</p>
      </div>
      <div>
        <p className="aside-label">{tUI.place}</p>
        <p className="aside-value">{entry.place}</p>
      </div>
      <p className="aside-source">
        <strong>{tUI.source}: </strong>
        {tUI.sourceText}
      </p>
    </aside>
  );
}
