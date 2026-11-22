// components/FeaturedFoods.js
// "From the collection": a magazine-style spread of the three newest published
// records — one lead story beside two smaller cards. Renders nothing when the
// archive has no published entries yet.
import FoodCard from "./FoodCard.js";
import Reveal from "./Reveal.js";

const t = {
  en: {
    eyebrow: "FEATURED STORIES",
    title: "From the collection",
    lead: "Recent entries from Cambodian villages, with the people who shared them.",
    all: "View all foods",
  },
  kh: {
    eyebrow: "រឿងរ៉ាវដែលបានជ្រើសរើស",
    title: "រឿងនិទានអាហារ",
    lead: "ធាតុថ្មីៗពីភូមិនានានៅកម្ពុជា ព្រមទាំងមនុស្សដែលបានចែករំលែកពួកវា។",
    all: "មុខម្ហូបទាំងអស់",
  },
};

function pad2(value) {
  return String(value).padStart(2, "0");
}

export default function FeaturedFoods({ entries = [], language = "en" }) {
  const tUI = t[language] || t.en;
  if (entries.length === 0) return null;

  const featured = entries.slice(0, 3);
  const [lead, ...rest] = featured;
  const total = entries.length;
  const numberFor = (entry) => {
    const index = entries.findIndex((item) => item.id === entry.id);
    return `${pad2(index + 1)} / ${pad2(total)}`;
  };

  return (
    <section className="section featured-section" aria-labelledby="featured-title">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <p className="eyebrow">{tUI.eyebrow}</p>
            <h2 id="featured-title" className="section-title">{tUI.title}</h2>
            <p className="section-lead">{tUI.lead}</p>
          </div>
          <a href="#collection" className="btn btn--secondary btn--sm">
            {tUI.all}
            <span className="arrow" aria-hidden="true">→</span>
          </a>
        </Reveal>

        <div className={`featured-grid${rest.length === 0 ? " featured-grid--single" : ""}`}>
          <FoodCard
            entry={lead}
            number={numberFor(lead)}
            language={language}
            variant="feature"
            priority
            index={0}
          />
          {rest.length === 1 && (
            <FoodCard
              entry={rest[0]}
              number={numberFor(rest[0])}
              language={language}
              index={1}
            />
          )}
          {rest.length > 1 && (
            <div className="featured-stack">
              {rest.map((entry, index) => (
                <FoodCard
                  key={entry.id}
                  entry={entry}
                  number={numberFor(entry)}
                  language={language}
                  index={index + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
