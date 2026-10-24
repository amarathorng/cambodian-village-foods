// components/ReviewCard.js
// One pending submission shown to a reviewer. Decisions are delegated to the
// parent so this file stays presentational.
import { colors, fonts } from "./theme.js";
import { getImageSrc } from "./image-src.js";
import StatusBadge from "./StatusBadge.js";

function excerpt(text, max = 320) {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max).trimEnd()} …` : text;
}

const buttonStyle = (tone) => ({
  fontFamily: fonts.stack,
  fontSize: 14,
  fontWeight: 700,
  padding: "9px 16px",
  borderRadius: 7,
  cursor: "pointer",
  color: tone === "publish" ? colors.text : colors.danger,
  backgroundColor: tone === "publish" ? colors.green : "transparent",
  border:
    tone === "publish"
      ? `1px solid ${colors.green}`
      : "1px solid rgba(201, 106, 91, 0.55)",
});

export default function ReviewCard({ entry, busy, onDecision }) {
  const imgSrc = getImageSrc(entry.image);

  return (
    <article
      style={{
        marginTop: 22,
        padding: 22,
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
            width={180}
            height={140}
            style={{
              width: 180,
              height: 140,
              objectFit: "cover",
              borderRadius: 9,
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: 180,
              height: 140,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 9,
              backgroundColor: colors.elevated,
              color: colors.muted,
              fontFamily: fonts.stack,
              fontSize: 13,
              textAlign: "center",
              padding: 12,
            }}
          >
            {entry.title}
          </div>
        )}

        <div style={{ flex: 1, minWidth: 240 }}>
          <StatusBadge status={entry.status} />
          <h2 style={{ margin: "10px 0 4px", fontFamily: fonts.stack, fontSize: 23, color: colors.text }}>
            {entry.title}
          </h2>
          {entry.khmerTitle && (
            <p style={{ margin: 0, fontFamily: fonts.khmer, fontSize: 17, color: colors.text2 }}>
              {entry.khmerTitle}
            </p>
          )}
          <p style={{ margin: "8px 0 0", fontFamily: fonts.stack, fontSize: 13.5, color: colors.muted }}>
            {[entry.contributor, entry.place].filter(Boolean).join(" · ")}
          </p>
          <p style={{ margin: "10px 0 0", fontFamily: fonts.stack, fontSize: 15, lineHeight: 1.6, color: colors.text2 }}>
            {excerpt(entry.description)}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
        <button
          type="button"
          disabled={busy}
          onClick={() => onDecision(entry.id, "publish")}
          style={buttonStyle("publish")}
        >
          {busy ? "Working…" : "Approve & publish"}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => onDecision(entry.id, "reject")}
          style={buttonStyle("reject")}
        >
          Reject
        </button>
      </div>
    </article>
  );
}
