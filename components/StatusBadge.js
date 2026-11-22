// components/StatusBadge.js
// Shared visual label for the review state stored in entries.status.
// Styling lives in archive.css (.status-badge--pending|published|returned) so
// the badge matches the design system everywhere it appears.
//
// "returned" is the stored value for a submission a reviewer rejected; the
// entries_status_check constraint allows pending, published, and returned only.
// Every call site passes the interface language, so the badge is Khmer whenever
// the reader chose Khmer.
const LABELS = {
  en: { pending: "Pending review", published: "Published", returned: "Not published" },
  kh: { pending: "រង់ចាំការត្រួតពិនិត្យ", published: "បានចេញផ្សាយ", returned: "មិនបានចេញផ្សាយ" },
};

export default function StatusBadge({ status, language = "en" }) {
  if (!status) return null;
  const labels = LABELS[language] || LABELS.en;

  return (
    <span className={`status-badge status-badge--${status}`}>
      {labels[status] || status}
    </span>
  );
}
