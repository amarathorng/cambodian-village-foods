// app/review/ReviewQueue.js
// Client-side reviewer queue. Reads only pending entries and sends decisions to
// the server route, which calls the authorized review_entry database function.
// Publishing and returning both ask for confirmation first; the dialog is styled
// and keyboard accessible, and the real authorization still happens on the server.
"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar.js";
import Footer from "../../components/Footer.js";
import ReviewCard from "../../components/ReviewCard.js";
import ConfirmDialog from "../../components/ConfirmDialog.js";
import { apiErrorMessage, apiMessage } from "../../components/api-errors.js";
import { toKhmerNumber } from "../../components/theme.js";
import { useLanguage } from "../../components/useLanguage.js";

const t = {
  en: {
    kicker: "REVIEW QUEUE",
    title: "Pending entries",
    lead: "Publishing makes an entry visible in the public archive. Returning sends it back to its contributor, who can edit it and submit it for review again.",
    loading: "Loading the queue…",
    empty: "No pending entries.",
    emptyHint: "Everything waiting has been reviewed. New submissions appear here.",
    auth: "Sign in to review entries.",
    signIn: "Sign in",
    forbidden: "You do not have reviewer access.",
    error: "Could not load the review queue.",
    retry: "Try again",
    publishTitle: "Publish this entry?",
    publishMessage:
      "It will become visible in the public archive immediately, credited to its contributor.",
    publishConfirm: "Publish",
    rejectTitle: "Return this entry?",
    rejectMessage:
      "The contributor will be able to edit it and submit it for review again.",
    rejectConfirm: "Return to contributor",
    published: "Published. The entry is now in the public archive.",
    returned: "Returned to the contributor.",
    failed: "That decision wasn't saved.",
    waiting: (count) => `${count} ${count === 1 ? "entry" : "entries"} waiting`,
  },
  kh: {
    kicker: "បញ្ជីរង់ចាំត្រួតពិនិត្យ",
    title: "ធាតុរង់ចាំការត្រួតពិនិត្យ",
    lead: "ការផ្សព្វផ្សាយធ្វើឱ្យធាតុមួយបង្ហាញនៅក្នុងបណ្ណសារសាធារណៈ។ ការបញ្ជូនត្រឡប់ ផ្ញើវាទៅអ្នកចូលរួមវិញ ដែលអាចកែសម្រួល និងដាក់ស្នើឡើងវិញបាន។",
    loading: "កំពុងផ្ទុកបញ្ជី…",
    empty: "គ្មានធាតុរង់ចាំការត្រួតពិនិត្យទេ។",
    emptyHint: "ធាតុដែលរង់ចាំទាំងអស់ត្រូវបានត្រួតពិនិត្យរួចហើយ។ ការដាក់ស្នើថ្មីនឹងបង្ហាញនៅទីនេះ។",
    auth: "សូមចូលគណនី ដើម្បីត្រួតពិនិត្យធាតុ។",
    signIn: "ចូល",
    forbidden: "អ្នកមិនមានសិទ្ធិជាអ្នកត្រួតពិនិត្យទេ។",
    error: "មិនអាចផ្ទុកបញ្ជីរង់ចាំត្រួតពិនិត្យបានទេ។",
    retry: "ព្យាយាមម្ដងទៀត",
    publishTitle: "ផ្សព្វផ្សាយធាតុនេះ?",
    publishMessage:
      "វានឹងបង្ហាញនៅក្នុងបណ្ណសារសាធារណៈភ្លាមៗ ដោយកត់ត្រាឈ្មោះអ្នកចូលរួម។",
    publishConfirm: "ផ្សព្វផ្សាយ",
    rejectTitle: "បញ្ជូនធាតុនេះត្រឡប់វិញ?",
    rejectMessage:
      "អ្នកចូលរួមនឹងអាចកែសម្រួលវា និងដាក់ស្នើឡើងវិញសម្រាប់ការត្រួតពិនិត្យ។",
    rejectConfirm: "បញ្ជូនត្រឡប់ទៅអ្នកចូលរួម",
    published: "បានផ្សព្វផ្សាយ។ ធាតុនេះឥឡូវនៅក្នុងបណ្ណសារសាធារណៈ។",
    returned: "បានបញ្ជូនត្រឡប់ទៅអ្នកចូលរួមវិញ។",
    failed: "ការសម្រេចនេះមិនត្រូវបានរក្សាទុកទេ។",
    waiting: (count) => `${toKhmerNumber(count)} ធាតុកំពុងរង់ចាំ`,
  },
};

export default function ReviewQueue() {
  const [language, setLanguage] = useLanguage();
  const [state, setState] = useState({ status: "loading", entries: [], code: "" });
  const [busyId, setBusyId] = useState("");
  const [pending, setPending] = useState(null);
  const [notice, setNotice] = useState({ tone: "", text: "" });
  const tUI = t[language] || t.en;

  // Load-state message in the reader's current language. It is computed at
  // render time, so switching language re-labels an error already on screen.
  const stateMessage =
    state.status === "auth"
      ? tUI.auth
      : state.status === "forbidden"
        ? tUI.forbidden
        : state.status === "error"
          ? apiMessage(state.code, language, tUI.error)
          : "";

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await fetch("/api/review");
        const json = await response.json().catch(() => ({}));
        if (!active) return;
        if (response.status === 401) {
          setState({ status: "auth", entries: [], code: "" });
          return;
        }
        if (response.status === 403) {
          setState({ status: "forbidden", entries: [], code: "" });
          return;
        }
        if (!response.ok) {
          // The API code is localized when the message is rendered.
          setState({ status: "error", entries: [], code: json.code || "" });
          return;
        }
        setState({ status: "ready", entries: json.entries || [], code: "" });
      } catch (error) {
        // Raw error stays in the console; the reviewer sees a localized line.
        console.error("Review queue request failed:", error);
        if (active) setState({ status: "error", entries: [], code: "" });
      }
    }

    load();
    return () => {
      active = false;
    };
    // tUI is derived from language; re-reading the queue when the language
    // changes is unnecessary, so the effect intentionally runs once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function decide(entryId, decision) {
    setBusyId(entryId);
    setNotice({ tone: "", text: "" });
    try {
      const response = await fetch(`/api/review/${entryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        // Localized by error code; the raw English text stays in the console.
        console.error("Review decision failed:", json.error || `HTTP ${response.status}`);
        setNotice({ tone: "error", text: apiErrorMessage(json, language, tUI.failed) });
        return;
      }
      setState((current) => ({
        ...current,
        entries: current.entries.filter((entry) => entry.id !== entryId),
      }));
      setNotice({
        tone: "success",
        text: decision === "publish" ? tUI.published : tUI.returned,
      });
    } catch (error) {
      console.error("Review decision request failed:", error);
      setNotice({ tone: "error", text: tUI.failed });
    } finally {
      setBusyId("");
      setPending(null);
    }
  }
  return (
    <div>
      <Navbar language={language} setLanguage={setLanguage} />

      <main id="main-content" className="container">
        <div className="page-head">
          <div>
            <p className="eyebrow">{tUI.kicker}</p>
            <h1 className="page-title">{tUI.title}</h1>
            <p className="page-lead">{tUI.lead}</p>
          </div>
          {state.status === "ready" && (
            <p className="page-meta">{tUI.waiting(state.entries.length)}</p>
          )}
        </div>

        {notice.text && (
          <div
            className={`toast${notice.tone === "error" ? " toast--error" : ""}`}
            role={notice.tone === "error" ? "alert" : "status"}
          >
            {notice.text}
          </div>
        )}

        {stateMessage && (
          <div className="status-note" role="alert">
            {stateMessage}
            {state.status === "auth" && (
              <>
                {" "}
                <a className="auth-link" href="/login">
                  {tUI.signIn}
                </a>
              </>
            )}
            {state.status === "error" && (
              <>
                {" "}
                <button
                  type="button"
                  className="link-action"
                  onClick={() => window.location.reload()}
                >
                  {tUI.retry}
                </button>
              </>
            )}
          </div>
        )}

        {state.status === "loading" ? (
          <p className="status-note" role="status">
            {tUI.loading}
          </p>
        ) : state.status === "ready" && state.entries.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-motif" aria-hidden="true">✦</p>
            <h2 className="empty-state-title">{tUI.empty}</h2>
            <p className="empty-state-text">{tUI.emptyHint}</p>
          </div>
        ) : state.status === "ready" ? (
          <div className="entry-list">
            {state.entries.map((entry) => (
              <ReviewCard
                key={entry.id}
                entry={entry}
                language={language}
                busy={busyId === entry.id}
                onRequest={(item, decision) => setPending({ entry: item, decision })}
              />
            ))}
          </div>
        ) : null}
      </main>

      <Footer language={language} />

      <ConfirmDialog
        open={!!pending}
        title={pending?.decision === "publish" ? tUI.publishTitle : tUI.rejectTitle}
        message={pending?.decision === "publish" ? tUI.publishMessage : tUI.rejectMessage}
        confirmLabel={pending?.decision === "publish" ? tUI.publishConfirm : tUI.rejectConfirm}
        tone={pending?.decision === "publish" ? "primary" : "danger"}
        busy={!!pending && busyId === pending.entry.id}
        language={language}
        onConfirm={() => decide(pending.entry.id, pending.decision)}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}

