// components/ArchiveStory.js
// Storytelling section on a deep forest-green band: what the archive records
// and who holds the knowledge. Every statement describes the archive's actual
// practice (credited contributors, recorded places, reviewed entries).
import Reveal from "./Reveal.js";

const t = {
  en: {
    eyebrow: "WHY THIS ARCHIVE MATTERS",
    heading: "The knowledge lives with the people who cook.",
    body: "Traditional food knowledge is often carried by memory rather than written recipes. Recording it — in Khmer and in English, with the place and the person it came from — keeps that knowledge findable for the next generation.",
    points: [
      { title: "Local knowledge", text: "Recipes and memories come from parents, grandparents, neighbours, and village cooks." },
      { title: "Named places", text: "Every entry records the village, district, or province the food belongs to." },
      { title: "Reviewed with care", text: "New contributions are reviewed before they appear in the public archive." },
    ],
    action: "Add your village's story",
    caption: "Prahok grilled in banana leaves — village food from Pursat.",
    imageAlt:
      "Prahok Ang — fish mixed with pork and lemongrass, wrapped in banana leaves and grilled",
  },
  kh: {
    eyebrow: "ហេតុអ្វីបានជាបណ្ណសារនេះមានសារៈសំខាន់?",
    heading: "ចំណេះដឹងអាហាររស់នៅជាមួយមនុស្សដែលធ្វើម្ហូប។",
    // No verified Khmer translation exists for this passage in the project;
    // it stays in English rather than showing a guessed translation.
    body: "ចំណេះដឹងអំពីម្ហូបអាហារប្រពៃណី តែងតែត្រូវបានបន្តពីមនុស្សម្នាក់ទៅមនុស្សម្នាក់ តាមរយៈការចងចាំ និងការចែករំលែក មិនមែនតាមរយៈរូបមន្តដែលបានកត់ត្រាទុកនោះទេ។ ការកត់ត្រាចំណេះដឹងទាំងនេះជាភាសាខ្មែរ និងភាសាអង់គ្លេស ព្រមទាំងបញ្ជាក់ពីទីកន្លែង និងអ្នកផ្តល់ប្រភព នឹងជួយរក្សាចំណេះដឹងដ៏មានតម្លៃនេះ និងធ្វើឱ្យមនុស្សជំនាន់ក្រោយអាចស្វែងយល់ និងបន្តថែរក្សាបាន។",
    points: [
      { title: "ចំណេះដឹងទូទៅ", text: "រូបមន្តម្ហូបអាហារ និងអនុស្សាវរីយ៍ ត្រូវបានបន្តចែករំលែកពីឪពុកម្តាយ ជីដូនជីតា អ្នកជិតខាង និងអ្នកចម្អិនម្ហូបក្នុងភូមិ។" },
      { title: "ទីកន្លែង", text: "ម្ហូបនីមួយៗត្រូវបានកត់ត្រាភ្ជាប់ជាមួយទីតាំងភូមិ ឃុំ/សង្កាត់ ស្រុក/ខណ្ឌ ឬខេត្ត ដែលម្ហូបនោះមានប្រភពមកពី។" },
      { title: "ការត្រួតពិនិត្យ", text: "រាល់ការចែករំលែកថ្មី ត្រូវបានពិនិត្យ និងផ្ទៀងផ្ទាត់ជាមុនសិន មុនពេលបង្ហាញជាសាធារណៈនៅក្នុងបណ្ណសារនេះ។" },
    ],
    action: "ចូលរួមចំណែក",
    caption: "ប្រហុកអាំងក្នុងស្លឹកចេក — ម្ហូបភូមិពីខេត្តពោធិ៍សាត់។",
    imageAlt:
      "ប្រហុកអាំង — ត្រីលាយសាច់ជ្រូក និងស្លឹកគ្រៃ រុំក្នុងស្លឹកចេក ហើយអាំង",
  },
};

export default function ArchiveStory({ language }) {
  const tUI = t[language] || t.en;

  return (
    <section className="section section--green story-section" aria-labelledby="story-title">
      <div className="container story-grid">
        <Reveal as="figure" className="story-figure">
          <img
            src="/images/prahok-ang.jpg"
            alt={tUI.imageAlt}
            width={515}
            height={388}
            loading="lazy"
          />
          <figcaption>{tUI.caption}</figcaption>
        </Reveal>

        <Reveal className="story-copy" delay={120}>
          <p className="eyebrow">{tUI.eyebrow}</p>
          <h2 id="story-title" className="section-title">{tUI.heading}</h2>
          <p className="section-lead">{tUI.body}</p>

          <ol className="story-points">
            {tUI.points.map((point, index) => (
              <li className="story-point" key={point.title}>
                <span className="story-point-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="story-point-title">{point.title}</h3>
                  <p className="story-point-text">{point.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <a href="/contribute" className="btn btn--secondary">
            {tUI.action}
            <span className="arrow" aria-hidden="true">→</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
