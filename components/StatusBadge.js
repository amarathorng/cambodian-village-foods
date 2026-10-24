// components/StatusBadge.js
// Shared visual label for the review state stored in entries.status.
import { colors, fonts } from "./theme.js";

const LABELS = {
  pending: "Pending review",
  published: "Published",
  rejected: "Not published",
};

const TONES = {
  pending: colors.gold,
  published: colors.green2,
  rejected: colors.danger,
};

export default function StatusBadge({ status }) {
  if (!status) return null;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        width: "fit-content",
        padding: "4px 9px",
        borderRadius: 999,
        border: `1px solid ${TONES[status] || colors.border}`,
        color: TONES[status] || colors.text2,
        fontFamily: fonts.stack,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {LABELS[status] || status}
    </span>
  );
}
