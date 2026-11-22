// app/food/[id]/RelatedNav.js
// Previous / next movement through the published collection, using the same
// real records the index page loaded. Renders nothing when the entry is not
// part of that list (for example a pending owner preview).
const t = {
  en: { previous: "Previous", next: "Next", back: "Back to all foods", related: "Related foods" },
  kh: { previous: "មុន", next: "បន្ទាប់", back: "មុខម្ហូបទាំងអស់", related: "មុខម្ហូបពាក់ព័ន្ធ" },
};

export default function RelatedNav({ entries = [], index = -1, language }) {
  const tUI = t[language] || t.en;
  const total = entries.length;
  if (index < 0 || total < 2) return null;

  const previous = entries[(index - 1 + total) % total];
  const next = entries[(index + 1) % total];

  return (
    <nav className="related-nav" aria-label={tUI.related}>
      <a href={`/food/${previous.id}`} className="related-link">
        <span className="related-label">← {tUI.previous}</span>
        <span className="related-name">{previous.title}</span>
      </a>
      <a href="/#collection" className="btn btn--quiet btn--sm">
        {tUI.back}
      </a>
      <a href={`/food/${next.id}`} className="related-link related-link--next">
        <span className="related-label">{tUI.next} →</span>
        <span className="related-name">{next.title}</span>
      </a>
    </nav>
  );
}
