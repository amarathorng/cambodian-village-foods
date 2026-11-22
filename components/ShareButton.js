// components/ShareButton.js
// Shares the current entry with the native share sheet when the browser has
// one, otherwise copies the real page URL to the clipboard. The status text is
// announced politely and clears itself.
"use client";

import { useState } from "react";

const t = {
  en: {
    share: "Share",
    copied: "Link copied",
    failed: "Could not share this page",
  },
  kh: {
    share: "ចែករំលែក",
    copied: "បានចម្លងតំណ",
    failed: "មិនអាចចែករំលែកបានទេ",
  },
};

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Fallback for browsers without the async clipboard API.
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(area);
  if (!copied) throw new Error("copy failed");
}

export default function ShareButton({ title, text, language = "en" }) {
  const tUI = t[language] || t.en;
  const [status, setStatus] = useState("");

  async function handleShare() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        setStatus("");
        return;
      }
      await copyText(url);
      setStatus(tUI.copied);
    } catch (error) {
      if (error?.name === "AbortError") return;
      setStatus(tUI.failed);
    }
    window.setTimeout(() => setStatus(""), 4000);
  }

  return (
    <>
      <button type="button" className="btn btn--secondary btn--sm" onClick={handleShare}>
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.6" y1="10.6" x2="15.4" y2="6.4" />
          <line x1="8.6" y1="13.4" x2="15.4" y2="17.6" />
        </svg>
        {tUI.share}
      </button>
      <span className="share-status" role="status" aria-live="polite">{status}</span>
    </>
  );
}
