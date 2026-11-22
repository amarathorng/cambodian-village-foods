// app/my-entries/MyEntries.js
// The contributor's own tracking page: every entry they submitted, at every
// status, so a reviewer's publish/return decision shows up here. Entries belong
// to the signed-in user only — the /api/my-entries route derives the owner from
// the session, so this page never takes an id from the URL.
"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar.js";
import Footer from "../../components/Footer.js";
import StatusSummary from "../../components/StatusSummary.js";
import MyEntryCard from "../../components/MyEntryCard.js";
import { apiMessage } from "../../components/api-errors.js";
import { toKhmerNumber } from "../../components/theme.js";
import { useLanguage } from "../../components/useLanguage.js";

// Khmer UI strings cover every label on this page; entry titles, stories,
// names, and places are contributor content and are shown exactly as entered.
const t = {
  en: {
    kicker: "MY ENTRIES",
    title: "Your submissions",
    intro:
      "Every entry you have sent to the archive, and where it stands in review. Pending and returned entries stay private until a reviewer publishes them.",
    loading: "Loading your entries…",
    auth: "Sign in to see the entries you have submitted.",
    signIn: "Sign in",
    error: "Could not load your entries.",
    empty: "You have not submitted an entry yet.",
    emptyHint: "Add an entry and it will appear here while it waits for review.",
    add: "Add an entry",
    refresh: "Refresh status",
    checked: "Last checked",
    retry: "Try again",
  },
  kh: {
    kicker: "ការបញ្ចូលរបស់ខ្ញុំ",
    title: "ការដាក់ស្នើរបស់អ្នក",
    intro:
      "រាល់ធាតុដែលអ្នកបានផ្ញើទៅបណ្ណសារ និងស្ថានភាពត្រួតពិនិត្យរបស់វា។ ធាតុដែលកំពុងរង់ចាំ និងធាតុដែលបានបញ្ជូនមកវិញ នៅឯកជន រហូតដល់អ្នកត្រួតពិនិត្យចេញផ្សាយវា។",
    loading: "កំពុងផ្ទុក…",
    auth: "សូមចូលគណនី ដើម្បីមើលធាតុដែលអ្នកបានដាក់ស្នើ។",
    signIn: "ចូល",
    error: "មិនអាចផ្ទុកធាតុរបស់អ្នកបានទេ។",
    empty: "អ្នកមិនទាន់បានដាក់ស្នើធាតុណាមួយនៅឡើយទេ។",
    emptyHint: "បន្ថែមធាតុមួយ ហើយវានឹងបង្ហាញនៅទីនេះ ខណៈពេលរង់ចាំការត្រួតពិនិត្យ។",
    add: "បន្ថែមធាតុ",
    refresh: "ធ្វើបច្ចុប្បន្នភាពស្ថានភាព",
    checked: "ពិនិត្យចុងក្រោយ",
    retry: "ព្យាយាមម្ដងទៀត",
  },
};

export default function MyEntries() {
  const [language, setLanguage] = useLanguage();
  const [state, setState] = useState({
    status: "loading",
    entries: [],
    code: "",
    checkedAt: "",
  });
  const [reloadKey, setReloadKey] = useState(0);
  const tUI = t[language] || t.en;

  // Reloads whenever "Refresh status" is pressed, so a decision a reviewer made
  // while this page was open shows up without signing out and back in.
  useEffect(() => {
    let active = true;

    async function load() {
      try {
        // no-store: the review status must be current on every visit.
        const response = await fetch("/api/my-entries", { cache: "no-store" });
        const json = await response.json().catch(() => ({}));
        if (!active) return;
        if (response.status === 401) {
          setState({ status: "auth", entries: [], code: "", checkedAt: "" });
          return;
        }
        if (!response.ok) {
          // Keep the API's stable code; the message is localized at render time
          // so it follows the language the reader is using right now.
          setState({ status: "error", entries: [], code: json.code || "", checkedAt: "" });
          return;
        }
        setState({
          status: "ready",
          entries: json.entries || [],
          code: "",
          checkedAt: new Date().toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
      } catch (error) {
        // The raw error stays in the console; the reader sees a localized line.
        console.error("My entries request failed:", error);
        if (active)
          setState({
            status: "error",
            entries: [],
            code: "",
            checkedAt: "",
          });
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const message =
    state.status === "auth"
      ? tUI.auth
      : state.status === "error"
        ? apiMessage(state.code, language, tUI.error)
        : "";
  return (
    <div>
      <Navbar language={language} setLanguage={setLanguage} />

      <main id="main-content" className="container">
        <div className="page-head">
          <div>
            <p className="eyebrow">{tUI.kicker}</p>
            <h1 className="page-title">{tUI.title}</h1>
            <p className="page-lead">{tUI.intro}</p>
          </div>
          <div className="page-actions">
            <button
              type="button"
              className="btn btn--quiet btn--sm"
              onClick={() => setReloadKey((key) => key + 1)}
              disabled={state.status === "loading"}
            >
              {tUI.refresh}
            </button>
            <a className="btn btn--primary btn--sm" href="/contribute">
              {tUI.add}
            </a>
          </div>
        </div>

        {state.checkedAt && (
          <p className="page-meta">
            {tUI.checked}{" "}
            {language === "kh" ? toKhmerNumber(state.checkedAt) : state.checkedAt}
          </p>
        )}

        {message && (
          <div className="status-note" role="alert">
            {message}
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
                  onClick={() => setReloadKey((key) => key + 1)}
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
            <div className="empty-state-actions">
              <a className="btn btn--primary btn--sm" href="/contribute">
                {tUI.add}
                <span className="arrow" aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        ) : state.status === "ready" ? (
          <>
            <StatusSummary entries={state.entries} language={language} />
            <div className="entry-list">
              {state.entries.map((entry) => (
                <MyEntryCard key={entry.id} entry={entry} language={language} />
              ))}
            </div>
          </>
        ) : null}
      </main>

      <Footer language={language} />
    </div>
  );
}

