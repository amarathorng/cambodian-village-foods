// components/CuratorSection.js
// "About the Archive": states the archive's purpose and its curator (passed
// from collection.config.js). No credentials or claims are invented.
import Reveal from "./Reveal.js";

const t = {
  en: {
    eyebrow: "ABOUT THE ARCHIVE",
    heading: "About the Archive",
    body: "Khmer Living Archive is a digital collection documenting traditional foods connected to Cambodian villages and communities, preserving the stories and knowledge shared by the people who prepare and remember them.",
    curatedBy: "CURATED BY",
  },
  kh: {
    eyebrow: "អំពីបណ្ណសារ",
    heading: "អំពីបណ្ណសារ",
    body: "បណ្ណសារជីវិតខ្មែរគឺជាបណ្ដុំឯកសារឌីជីថលដែលចងក្រងឯកសារអំពីម្ហូបប្រពៃណីដែលទាក់ទងនឹងភូមិ និងសហគមន៍ខ្មែរ រក្សាទុករឿងរ៉ាវ និងចំណេះដឹងដែលបានចែករំលែកដោយមនុស្សដែលរៀបចំ និងចងចាំវា។",
    curatedBy: "រៀបរៀងដោយ",
  },
};

export default function CuratorSection({ language, curator }) {
  const tUI = t[language] || t.en;

  return (
    <Reveal as="section" className="about-block">
      <p className={language === "kh" ? "eyebrow khmer" : "eyebrow"}>{tUI.eyebrow}</p>
      <h2 className={language === "kh" ? "about-heading about-heading--kh" : "about-heading"}>
        {tUI.heading}
      </h2>
      <p className={language === "kh" ? "about-body khmer" : "about-body"}>{tUI.body}</p>
      <p className="curator-line">
        <span aria-hidden="true">▱</span>
        <span>{tUI.curatedBy}</span>
        <strong>{curator}</strong>
      </p>
    </Reveal>
  );
}
