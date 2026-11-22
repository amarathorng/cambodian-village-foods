// components/ConfirmDialog.js
// Accessible confirmation dialog used before a destructive or public action
// (delete an entry, publish it, return it). Replaces window.confirm so the
// question is styled, keyboard accessible, and can show a busy state.
"use client";

import { useId, useRef } from "react";
import { useModal } from "./useModal.js";

const t = {
  en: { cancel: "Cancel", working: "Working…" },
  kh: { cancel: "បោះបង់", working: "កំពុងដំណើរការ…" },
};

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  tone = "primary",
  busy = false,
  language = "en",
  onConfirm,
  onCancel,
}) {
  const tUI = t[language] || t.en;
  const panelRef = useRef(null);
  const titleId = useId();
  const bodyId = useId();
  useModal(open, panelRef, () => {
    if (!busy) onCancel();
  });

  if (!open) return null;

  return (
    <div
      className="dialog-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onCancel();
      }}
    >
      <div
        className="dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        ref={panelRef}
        tabIndex={-1}
      >
        <h2 id={titleId} className="dialog-title">{title}</h2>
        <p id={bodyId} className="dialog-body">{message}</p>
        <div className="dialog-actions">
          <button type="button" className="btn btn--quiet" onClick={onCancel} disabled={busy}>
            {cancelLabel || tUI.cancel}
          </button>
          <button
            type="button"
            className={`btn ${tone === "danger" ? "btn--danger" : "btn--primary"}`}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? (
              <>
                <span className="spinner" aria-hidden="true" />
                {tUI.working}
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
