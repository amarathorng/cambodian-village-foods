// components/MyEntryCard.js
// One row in the contributor's dashboard: the real photograph, both names, the
// place, the current review status, and the next useful action. Returned
// entries get the resubmit action in the primary style so it is easy to find.
import StatusBadge from "./StatusBadge.js";
import { getImageSrc } from "./image-src.js";

const t = {
  en: {
    view: "View entry",
    edit: "Edit",
    resubmit: "Edit and resubmit",
    awaiting: "Waiting for a reviewer. You can still edit it.",
    returned: "Returned with notes. Update the story, then resubmit.",
    published: "Published in the public archive.",
  },
  kh: {
    view: "មើលធាតុ",
    edit: "កែសម្រួល",
    resubmit: "កែសម្រួល និងដាក់ស្នើឡើងវិញ",
    awaiting: "កំពុងរង់ចាំអ្នកត្រួតពិនិត្យ។ អ្នកនៅតែអាចកែសម្រួលវាបាន។",
    returned: "បានបញ្ជូនមកវិញជាមួយកំណត់សម្គាល់។ សូមកែសម្រួលរឿងរ៉ាវ រួចដាក់ស្នើឡើងវិញ។",
    published: "បានចេញផ្សាយនៅក្នុងបណ្ណសារសាធារណៈ។",
  },
};

export default function MyEntryCard({ entry, language = "en" }) {
  const tUI = t[language] || t.en;
  const image = getImageSrc(entry.image);
  const note =
    entry.status === "returned"
      ? tUI.returned
      : entry.status === "pending"
        ? tUI.awaiting
        : tUI.published;

  return (
    <article className="entry-item">
      {image ? (
        <img
          className="entry-thumb"
          src={image}
          alt={entry.title}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="entry-thumb entry-thumb--empty">{entry.title}</div>
      )}

      <div className="entry-body">
        <StatusBadge status={entry.status} language={language} />
        <h3 className="entry-title">{entry.title}</h3>
        {entry.khmerTitle && (
          <p className="entry-khmer" lang="km">
            {entry.khmerTitle}
          </p>
        )}
        <p className="entry-meta">
          {entry.place}
          {entry.contributor ? ` · ${entry.contributor}` : ""}
        </p>
        <p className="entry-note">{note}</p>

        <div className="entry-actions">
          <a className="btn btn--quiet btn--sm" href={`/food/${entry.id}`}>
            {tUI.view}
          </a>
          {entry.status === "returned" ? (
            <a className="btn btn--primary btn--sm" href={`/food/${entry.id}/edit`}>
              {tUI.resubmit}
            </a>
          ) : (
            <a className="btn btn--secondary btn--sm" href={`/food/${entry.id}/edit`}>
              {tUI.edit}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
