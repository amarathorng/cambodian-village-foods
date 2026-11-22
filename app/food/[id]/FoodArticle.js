// app/food/[id]/FoodArticle.js
// One archive entry read as an editorial story: identity, photograph, the full
// personal story, contributor and place beside it, then related navigation.
// The text is the contributor's own; paragraphs are only split, never edited.
import ArticleHeader from "./ArticleHeader.js";
import ArticleFigure from "./ArticleFigure.js";
import ArticleAside from "./ArticleAside.js";
import RelatedNav from "./RelatedNav.js";

const t = {
  en: { story: "The story" },
  kh: { story: "រឿងរ៉ាវ" },
};

export default function FoodArticle({ entry, entries, index, language = "en" }) {
  const tUI = t[language] || t.en;
  const title = language === "kh" ? entry.khmerTitle || entry.title : entry.title;
  // The Khmer story is optional. Use it only when the reader chose Khmer and
  // the contributor actually wrote one; otherwise fall back to the English
  // story so an entry with no description_kh reads exactly as before.
  const khmerStory = (entry.descriptionKh || "").trim();
  const useKhmerStory = language === "kh" && khmerStory !== "";
  const story = useKhmerStory ? khmerStory : entry.description || "";
  const paragraphs = story
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <article className="article">
      <ArticleHeader entry={entry} language={language} />
      <ArticleFigure entry={entry} title={title} language={language} />

      <div className="article-layout">
        <section
          className={useKhmerStory ? "article-story khmer" : "article-story"}
          aria-labelledby="story-heading"
          lang={useKhmerStory ? "km" : "en"}
        >
          <h2 id="story-heading">{tUI.story}</h2>
          {paragraphs.map((paragraph, item) => (
            <p key={item}>{paragraph}</p>
          ))}
        </section>
        <ArticleAside entry={entry} language={language} />
      </div>

      <RelatedNav entries={entries} index={index} language={language} />
    </article>
  );
}
