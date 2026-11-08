// components/StatusSummary.js
// Counters for the contributor's own entries: how many are waiting, published,
// or returned. Presentational — the parent passes the entries it loaded.
import { colors, fonts } from "./theme.js";

// "returned" is the stored value for a submission a reviewer rejected; see
// StatusBadge.js and supabase/review_entry.sql.
const t = {
  en: { pending: "Pending review", published: "Published", returned: "Returned to you" },
  // Unverified Khmer interface strings stay in English, matching the rest of the
  // project; only verified labels are translated.
  kh: { pending: "Pending review", published: "Published", returned: "Returned to you" },
};

const ORDER = ["pending", "published", "returned"];

const TONES = {
  pending: colors.gold,
  published: colors.green2,
  returned: colors.danger,
};

export default function StatusSummary({ entries = [], language }) {
  const tUI = t[language] || t.en;

  const counts = ORDER.reduce((acc, status) => ({ ...acc, [status]: 0 }), {});
  entries.forEach((entry) => {
    if (counts[entry.status] !== undefined) counts[entry.status] += 1;
  });

  return (
    <section
      aria-label="Submission status summary"
      style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "22px 0 4px" }}
    >
      {ORDER.map((status) => (
        <div
          key={status}
          style={{
            flex: "1 1 150px",
            padding: "14px 16px",
            borderRadius: 10,
            backgroundColor: colors.card,
            border: `1px solid ${colors.border}`,
          }}
        >
          <span
            style={{
              display: "block",
              fontFamily: fonts.stack,
              fontSize: 26,
              fontWeight: 700,
              lineHeight: 1,
              color: TONES[status],
            }}
          >
            {counts[status]}
          </span>
          <span
            style={{
              display: "block",
              marginTop: 7,
              fontFamily: fonts.stack,
              fontSize: 12.5,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: colors.text2,
            }}
          >
            {tUI[status]}
          </span>
        </div>
      ))}
    </section>
  );
}
