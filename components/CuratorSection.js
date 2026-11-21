// components/CuratorSection.js
// "About the Archive" — preserves the Curated By information (Thorng Amara)
// and describes the archive modestly, without inventing credentials.
import { colors, fonts } from "./theme.js";

const t = {
  en: {
    // label: "ABOUT",
    heading: "About the Archive",
    body: "Khmer Living Archive is a digital collection documenting traditional foods connected to Cambodian villages and communities, preserving the stories and knowledge shared by the people who prepare and remember them.",
    curatedBy: "CURATED BY",
  },
  kh: {
    // label: "អំពីបណ្ណសារ",
    heading: "អំពីបណ្ណសារ",
    body: "បណ្ណសារជីវិតខ្មែរគឺជាបណ្ដុំឯកសារឌីជីថលដែលចងក្រងឯកសារអំពីម្ហូបប្រពៃណីដែលទាក់ទងនឹងភូមិ និងសហគមន៍ខ្មែរ រក្សាទុករឿងរ៉ាវ និងចំណេះដឹងដែលបានចែករំលែកដោយមនុស្សដែលរៀបចំ និងចងចាំវា។",
    curatedBy: "រៀបរៀងដោយ",
  },
};

export default function CuratorSection({ language, curator }) {
  const tUI = t[language] || t.en;
  return (
    <section id="about" className="reveal" style={{ padding: "40px 0" }}>
      <span className="section-label" style={{ fontFamily: fonts.stack, fontSize: 12, letterSpacing: "0.16em", color: colors.muted }}>
        {tUI.label}
      </span>
      <h2 style={{ margin: "14px 0 16px", fontFamily: fonts.stack, fontSize: 30, fontWeight: 700, color: colors.text }}>
        {tUI.heading}
      </h2>
      <p style={{ margin: 0, maxWidth: "62ch", fontFamily: fonts.stack, fontSize: 17, lineHeight: 1.7, color: colors.text2 }}>
        {tUI.body}
      </p>
      <div
        className="curator-line"
        style={{
          marginTop: 26,
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontFamily: fonts.stack,
          fontSize: 14,
          color: colors.muted,
        }}
      >
        <span aria-hidden="true" style={{ color: colors.gold }}>▱</span>
        <span style={{ letterSpacing: language === "kh" ? 0 : "0.08em" }}>{tUI.curatedBy}</span>
        <span style={{ color: colors.text, fontWeight: 700 }}>{curator}</span>
      </div>
    </section>
  );
}