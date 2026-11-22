// components/ArchiveIntroduction.js
// Short editorial passage explaining why village food deserves preservation,
// plus three pillars drawn from the archive's own vocabulary:
// food · place · people · memory.
import Reveal from "./Reveal.js";

const t = {
  en: {
    heading: "Food is more than something we eat.",
    body: "Across Cambodian villages, food carries memories of family, place, seasons, and traditions. Every dish has a story shaped by the people who prepare it and the communities that keep it alive.",
    pillars: [
      { label: "Food", text: "Recipes that families cook from memory." },
      { label: "Place", text: "Each entry is tied to the village or community it comes from." },
      { label: "People", text: "Stories credited to the person who shared them." },
    ],
  },
  kh: {
    heading: "ម្ហូបអាហារគឺលើសពីអ្វីដែលយើងគ្រាន់តែទទួលទានទេ។",
    body: "នៅក្នុងភូមិខ្មែរទូទាំងប្រទេស ម្ហូបអាហារនាំមកនូវអនុស្សាវរីយ៍អំពីគ្រួសារ ទីកន្លែង រដូវកាល និងប្រពៃណី។ ម្ហូបនីមួយៗមានរឿងរ៉ាវដែលបានបង្កើតឡើងដោយមនុស្សដែលរៀបចំវា និងសហគមន៍ដែលរក្សាវាឱ្យរស់នៅ។",
    // Pillar labels and descriptions use the archive's own Khmer vocabulary.
    pillars: [
      { label: "អាហារ", text: "រូបមន្តដែលគ្រួសារចម្អិនតាមការចងចាំ។" },
      { label: "ទីកន្លែង", text: "ធាតុនីមួយៗភ្ជាប់ទៅនឹងភូមិ ឬសហគមន៍ដែលវាមានប្រភពមកពី។" },
      { label: "មនុស្ស", text: "រឿងរ៉ាវដែលបានកត់ត្រាឈ្មោះអ្នកដែលចែករំលែកវា។" },
    ],
  },
};

export default function ArchiveIntroduction({ language }) {
  const tUI = t[language] || t.en;

  return (
    <section id="introduction" className="intro" aria-labelledby="intro-title">
      <Reveal className="container intro-inner">
        <p className="divider-motif" aria-hidden="true"><span>✦</span></p>
        <h2
          id="intro-title"
          className={language === "kh" ? "intro-heading intro-heading--kh" : "intro-heading"}
        >
          {tUI.heading}
        </h2>
        <p className="intro-body">{tUI.body}</p>

        <div className="intro-pillars">
          {tUI.pillars.map((pillar) => (
            <div className="intro-pillar" key={pillar.label}>
              <p className={language === "kh" ? "intro-pillar-label khmer" : "intro-pillar-label"}>
                {pillar.label}
              </p>
              <p className="intro-pillar-text">{pillar.text}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
