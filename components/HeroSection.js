// components/HeroSection.js
// Immersive editorial hero. The headline is derived from collection.config.js;
// the photograph comes from the newest real archive record (or the local
// archive photo as a fallback). Layout and motion live in archive.css.
import collection, { collectionText } from "../collection.config.js";
import { heroCopy } from "./hero-copy.js";
import HeroMeta from "./HeroMeta.js";
import HeroFigure from "./HeroFigure.js";

export default function HeroSection({ language, heroImage, count = 0, places = 0 }) {
  const tUI = heroCopy[language] || heroCopy.en;
  // The English headline is split into two editorial lines; Khmer uses the
  // verified Khmer heading in hero-copy.js instead.
  const words = collectionText(collection.name, "en").split(/\s+/);
  const lead = words[0];
  const rest = words.slice(1).join(" ");

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">{tUI.label}</p>

          <h1
            id="hero-title"
            className={language === "kh" ? "hero-title hero-title--kh" : "hero-title"}
          >
            {language === "en" && rest ? (
              <>
                {lead}
                <br />
                <em>{rest}</em>
              </>
            ) : (
              tUI.heading
            )}
          </h1>

          <p className="hero-body">{tUI.body}</p>

          <div className="hero-actions">
            <a href="#collection" className="btn btn--primary">
              {tUI.explore}
              <span className="arrow" aria-hidden="true">→</span>
            </a>
            <a href="/contribute" className="btn btn--secondary">
              {tUI.contribute}
              <span className="arrow" aria-hidden="true">→</span>
            </a>
          </div>

          <HeroMeta tUI={tUI} language={language} count={count} places={places} />
        </div>

        <HeroFigure
          image={heroImage}
          alt={tUI.imageAlt}
          insetAlt={tUI.insetAlt}
          captionName={tUI.captionName}
          captionSub={tUI.captionSub}
        />
      </div>
    </section>
  );
}
