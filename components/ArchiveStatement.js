// components/ArchiveStatement.js
// "The Knowledge Holders": the kinds of people whose knowledge the archive
// records, plus the source statement from collection.config.js. It does not
// claim any individual record was independently verified.
import Reveal from "./Reveal.js";

const t = {
  en: {
    eyebrow: "THE KNOWLEDGE HOLDERS",
    heading: "The Knowledge Holders",
    body: "These food stories are connected to the knowledge shared by the people who prepare, preserve, and remember the traditions of their communities.",
    holders: ["Village elders", "Local cooks", "Families", "Community storytellers"],
  },
  kh: {
    eyebrow: "អ្នកថែរក្សាចំណេះដឹងប្រពៃណី",
    heading: "អ្នករក្សាចំណេះដឹង",
    body: "រឿងនិទានអាហារទាំងនេះត្រូវបានភ្ជាប់ទៅនឹងចំណេះដឹងដែលមនុស្សដែលរៀបចំ រក្សា និងចងចាំប្រពៃណីនៃសហគមន៍របស់ពួកគេបានចែករំលែក។",
    holders: [
      "អ្នកភូមិជំនាន់មុន",
      "អ្នកចម្អិនតាមភូមិ",
      "គ្រួសារ",
      "អ្នកក្នុងសហគមន៍ដែលចែករំលែករឿងនិទាន",
    ],
  },
};

export default function ArchiveStatement({ language, source }) {
  const tUI = t[language] || t.en;

  return (
    <Reveal as="section" className="about-block" delay={120}>
      <p className="eyebrow">{tUI.eyebrow}</p>
      <h2 className={language === "kh" ? "about-heading about-heading--kh" : "about-heading"}>
        {tUI.heading}
      </h2>
      <div className="holders-list">
        {tUI.holders.map((holder) => (
          <span className={language === "kh" ? "holder-chip khmer" : "holder-chip"} key={holder}>
            {holder}
          </span>
        ))}
      </div>
      <p className={language === "kh" ? "about-body khmer" : "about-body"}>{tUI.body}</p>
      {source && (
        <blockquote className={language === "kh" ? "about-quote khmer" : "about-quote"}>
          {source}
        </blockquote>
      )}
    </Reveal>
  );
}
