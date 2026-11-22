// components/ContributeCta.js
// Community contribution call-to-action. The button goes to the real
// contribution page, where the existing signed-in submit flow still applies.
import Reveal from "./Reveal.js";

const t = {
  en: {
    eyebrow: "COMMUNITY CONTRIBUTION",
    heading: "Every family has a food story.",
    body: "Share a dish from your village: its Khmer and English names, the place it comes from, the person who taught it, and a photograph. New entries are reviewed before they join the public archive.",
    action: "Contribute a Story",
    note: "“These are stories the community chose to share.”",
  },
  kh: {
    eyebrow: "ការចូលរួមចំណែក",
    heading: "គ្រួសារនីមួយៗមានរឿងរ៉ាវអាហារ។",
    // No verified Khmer translation in the project for this paragraph.
    body: "ចែករំលែកម្ហូបមួយមុខពីភូមិរបស់អ្នក ដោយបញ្ជាក់ឈ្មោះជាភាសាខ្មែរ និងភាសាអង់គ្លេស ទីកន្លែងដែលម្ហូបនោះមានប្រភពមកពី អ្នកដែលបានបង្រៀនអ្នកពីរបៀបធ្វើម្ហូបនេះ និងរូបថតមួយសន្លឹក។ រាល់ការចែករំលែកថ្មីនឹងត្រូវបានពិនិត្យជាមុនសិន មុនពេលបញ្ចូលទៅក្នុងបណ្ណសារសាធារណៈ។",
    action: "ចូលរួមចំណែក",
    note: "“ចំណេះដឹងដែលសហគមន៍បានជ្រើសរើសត្រូវចែករំលែក។”",
  },
};

export default function ContributeCta({ language }) {
  const tUI = t[language] || t.en;

  return (
    <section className="cta-section" aria-labelledby="cta-title">
      <div className="container">
        <Reveal className="cta-card">
          <div className="cta-copy">
            <p className="eyebrow">{tUI.eyebrow}</p>
            <h2 id="cta-title" className="cta-title">{tUI.heading}</h2>
            <p className="cta-body">{tUI.body}</p>
            <div className="cta-actions">
              <a href="/contribute" className="btn btn--primary">
                {tUI.action}
                <span className="arrow" aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <p className="cta-note">{tUI.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
