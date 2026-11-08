// components/MyEntryCard.js
// One submission in the contributor's own list (app/my-entries). Presentational:
// it shows the current review status and links out to the entry (view) and the
// edit form (which resubmits a returned entry for review).
import { colors, fonts } from "./theme.js";
import { getImageSrc } from "./image-src.js";
import StatusBadge from "./StatusBadge.js";

// What the stored status means for the contributor who owns this entry.
const NOTES = {
  pending: "Waiting for a reviewer. Only you can see it right now.",
  published: "Live in the public archive.",
  returned: "Not published. Edit it to submit it for review again.",
};

// Same date style as the rest of the archive: "8 Nov 2026".
function submittedOn(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const actionStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontFamily: fonts.stack,
  fontSize: 14,
  fontWeight: 600,
  color: colors.text2,
  textDecoration: "none",
  background: "none",
  border: `1px solid ${colors.border}`,
  borderRadius: 6,
  padding: "8px 16px",
};

const resubmitStyle = {
  ...actionStyle,
  color: colors.text,
  backgroundColor: colors.green,
  border: `1px solid ${colors.green}`,
};

export default function MyEntryCard({ entry }) {
  const imgSrc = getImageSrc(entry.image);
  const date = submittedOn(entry.created_at);
  // A returned entry needs an edit before it can be published again, so that
  // action is the emphasised one for that status.
  const needsEdit = entry.status === "returned";

  return (
    <article
      style={{
        marginTop: 16,
        padding: 20,
        borderRadius: 12,
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`,
      }}
    >
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={entry.title}
            loading="lazy"
            width={140}
            height={110}
            style={{
              width: 140,
              height: 110,
              objectFit: "cover",
              borderRadius: 9,
              display: "block",
            }}
          />
        ) : (
          <div
            aria-hidden="true"
            style={{
              width: 140,
              height: 110,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 9,
              backgroundColor: colors.elevated,
              color: colors.muted,
              fontFamily: fonts.stack,
              fontSize: 12.5,
              textAlign: "center",
              padding: 10,
            }}
          >
            {entry.title}
          </div>
        )}

        <div style={{ flex: 1, minWidth: 220 }}>
          <StatusBadge status={entry.status} />
          <h2 style={{ margin: "10px 0 4px", fontFamily: fonts.stack, fontSize: 20, color: colors.text }}>
            {entry.title}
          </h2>
          {entry.khmerTitle && (
            <p style={{ margin: 0, fontFamily: fonts.khmer, fontSize: 16, color: colors.text2 }}>
              {entry.khmerTitle}
            </p>
          )}
          <p style={{ margin: "8px 0 0", fontFamily: fonts.stack, fontSize: 13.5, color: colors.muted }}>
            {[entry.place, date ? `Submitted ${date}` : ""].filter(Boolean).join(" · ")}
          </p>
          <p style={{ margin: "10px 0 0", fontFamily: fonts.stack, fontSize: 14.5, lineHeight: 1.55, color: colors.text2 }}>
            {NOTES[entry.status] || null}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
        <a href={`/food/${entry.id}`} style={needsEdit ? actionStyle : resubmitStyle}>
          View entry
        </a>
        <a href={`/food/${entry.id}/edit`} style={needsEdit ? resubmitStyle : actionStyle}>
          {needsEdit ? "Edit and resubmit" : "Edit"}
        </a>
      </div>
    </article>
  );
}
