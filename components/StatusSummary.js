// components/StatusSummary.js
// Counters for the contributor's own entries: how many are waiting, published,
// or returned. Presentational — the parent passes the entries it loaded, so the
// numbers are always real.
//
// "returned" is the stored value for a submission a reviewer rejected; see
// StatusBadge.js and supabase/review_entry.sql.
const t = {
  en: {
    pending: "Pending review",
    published: "Published",
    returned: "Returned to you",
    label: "Submission status summary",
  },
  kh: {
    pending: "រង់ចាំការត្រួតពិនិត្យ",
    published: "បានចេញផ្សាយ",
    returned: "បានបញ្ជូនមកវិញ",
    label: "សេចក្ដីសង្ខេបស្ថានភាពនៃការដាក់ស្នើ",
  },
};

const ORDER = ["pending", "published", "returned"];

export default function StatusSummary({ entries = [], language }) {
  const tUI = t[language] || t.en;

  const counts = ORDER.reduce((acc, status) => ({ ...acc, [status]: 0 }), {});
  entries.forEach((entry) => {
    if (counts[entry.status] !== undefined) counts[entry.status] += 1;
  });

  return (
    <section className="summary-grid" aria-label={tUI.label}>
      {ORDER.map((status) => (
        <div className={`summary-card summary-card--${status}`} key={status}>
          <span className="summary-value">{counts[status]}</span>
          <span className="summary-label">{tUI[status]}</span>
        </div>
      ))}
    </section>
  );
}
