// components/ReviewCard.js
// One pending submission shown to a reviewer. It is presentational: the parent
// owns the decision dialog and the API call. Publish and return are deliberately
// different in tone so the safer, public action is not mistaken for the other.
import StatusBadge from "./StatusBadge.js";
import { getImageSrc } from "./image-src.js";

function excerpt(text, max = 300) {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max).trimEnd()} …` : text;
}

const t = {
  en: {
    open: "Open entry",
    publish: "Approve & publish",
    reject: "Return to contributor",
    working: "Working…",
  },
  kh: {
    open: "បើកធាតុ",
    publish: "អនុម័ត និងផ្សព្វផ្សាយ",
    reject: "បញ្ជូនត្រឡប់ទៅអ្នកចូលរួម",
    working: "កំពុងដំណើរការ…",
  },
};

export default function ReviewCard({ entry, busy, language = "en", onRequest }) {
  const tUI = t[language] || t.en;
  const image = getImageSrc(entry.image);

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
        <h2 className="entry-title">{entry.title}</h2>
        {entry.khmerTitle && (
          <p className="entry-khmer" lang="km">
            {entry.khmerTitle}
          </p>
        )}
        <p className="entry-meta">
          {[entry.contributor, entry.place].filter(Boolean).join(" · ")}
        </p>
        <p className="entry-note">{excerpt(entry.description)}</p>

        <div className="entry-actions">
          <a className="btn btn--quiet btn--sm" href={`/food/${entry.id}`}>
            {tUI.open}
          </a>
        </div>

        <div className="review-actions">
          <button
            type="button"
            className="btn btn--primary btn--sm"
            disabled={busy}
            onClick={() => onRequest(entry, "publish")}
          >
            {busy ? tUI.working : tUI.publish}
          </button>
          <button
            type="button"
            className="btn btn--danger btn--sm"
            disabled={busy}
            onClick={() => onRequest(entry, "reject")}
          >
            {tUI.reject}
          </button>
        </div>
      </div>
    </article>
  );
}
