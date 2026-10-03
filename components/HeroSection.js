// components/HeroSection.js
// Editorial hero for Khmer Living Archive. Asymmetric two-column layout:
// warm cream editorial typography on one side, an authentic village-food
// photograph (Prahok Ang) on the other, with restrained Khmer-inspired detail.
// Responsive layout and hover/focus states live in archive.css so the heading
// size and columns adapt without JavaScript viewport checks.
//
// Keep the documented interface: HeroSection({ language, heroImage }).
import { colors } from "./theme.js";

const t = {
  en: {
    label: "KHMER LIVING ARCHIVE",
    heading: "Cambodian Village Foods",
    body: "A living collection of traditional foods, local knowledge, and personal stories from Cambodian villages and communities.",
    action: "Explore the Collection",
    tagline: ["FOOD", "PLACE", "PEOPLE", "MEMORY"],
    captionName: "PRAHOK ANG",
    captionSub: "Traditional Cambodian food",
    imageAlt: "Prahok Ang — traditional Cambodian fish grilled in banana leaves",
  },
  kh: {
    // Verified Khmer, kept from the existing implementation.
    label: "បណ្ណសារជីវិតខ្មែរ",
    // Khmer heading is the archive's verified Khmer name for village foods.
    heading: "បណ្ដុំម្ហូបអាហារតាមភូមិ",
    // No verified Khmer translation in the project: keep English rather than
    // display incorrect Khmer.
    body: "A living collection of traditional foods, local knowledge, and personal stories from Cambodian villages and communities.",
    action: "Explore the Collection",
    tagline: ["FOOD", "PLACE", "PEOPLE", "MEMORY"],
    captionName: "PRAHOK ANG",
    captionSub: "Traditional Cambodian food",
    imageAlt: "Prahok Ang — traditional Cambodian fish grilled in banana leaves",
  },
};

export default function HeroSection({ language, heroImage }) {
  const tUI = t[language] || t.en;

  // Editorial two-line headline for English ("Cambodian" / "Village Foods").
  // Khmer uses the full string and wraps naturally (Khmer has no word spaces).
  const words = tUI.heading.split(/\s+/);
  const lead = words[0];
  const rest = words.slice(1).join(" ");

  return (
    <section className="hero-section reveal">
      <div className="hero-inner">
        {/* LEFT — editorial content */}
        <div className="hero-content">
          <span className="hero-rule" aria-hidden="true" style={{ backgroundColor: colors.gold }} />
          <p className="hero-label" style={{ color: colors.gold }}>{tUI.label}</p>
          <h1
            className={language === "kh" ? "hero-title hero-title--kh" : "hero-title"}
            style={{
              color: colors.text,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              overflowWrap: "anywhere",
            }}
          >
            {language === "en" && rest ? (
              <>
                {lead}
                <br />
                {rest}
              </>
            ) : (
              <>{tUI.heading}</>
            )}
          </h1>
          <p className="hero-body">{tUI.body}</p>

          <a href="#collection" className="hero-action">
            <span>{tUI.action}</span>
            <span className="arrow-dot" aria-hidden="true">→</span>
          </a>

          <p className="hero-tagline" aria-hidden="true">
            {tUI.tagline.map((item, i) => (
              <span key={item}>
                {i > 0 && (
                  <span className="hero-tagline-sep" aria-hidden="true">·</span>
                )}
                {item}
              </span>
            ))}
          </p>
        </div>

        {/* RIGHT — village-food photography */}
        <figure className="hero-figure">
          <span className="hero-motif" aria-hidden="true">
            <span style={{ display: "block", width: 26, height: 3, backgroundColor: colors.gold }} />
            <span style={{ display: "block", width: 18, height: 3, backgroundColor: colors.gold, marginTop: 4 }} />
            <span style={{ display: "block", width: 10, height: 3, backgroundColor: colors.gold, marginTop: 4 }} />
          </span>
          <div className="hero-image-frame">
            <img
              className="hero-image"
              src={heroImage}
              alt={tUI.imageAlt}
              width={1280}
              height={340}
              fetchPriority="high"
            />
          </div>
          <figcaption className="hero-caption">
            <span className="hero-caption-name" style={{ color: colors.gold }}>{tUI.captionName}</span>
            <span className="hero-caption-sub" style={{ color: colors.text2 }}>{tUI.captionSub}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}