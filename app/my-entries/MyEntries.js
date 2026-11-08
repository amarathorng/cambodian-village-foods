// app/my-entries/MyEntries.js
// The contributor's own tracking page: every entry they submitted, at every
// status, so a reviewer's publish/return decision shows up here. Entries belong
// to the signed-in user only — the /api/my-entries route derives the owner from
// the session, so this page never takes an id from the URL.
"use client";

import { useEffect, useState } from "react";
import { colors, fonts } from "../../components/theme.js";
import Navbar from "../../components/Navbar.js";
import Footer from "../../components/Footer.js";
import StatusSummary from "../../components/StatusSummary.js";
import MyEntryCard from "../../components/MyEntryCard.js";

const wrap = { maxWidth: 900, margin: "0 auto", padding: "48px 24px 72px" };

// Unverified Khmer interface strings stay in English, matching the rest of the
// project; only labels that already exist elsewhere are translated.
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
  },
  kh: {
    kicker: "MY ENTRIES",
    title: "Your submissions",
    intro:
      "Every entry you have sent to the archive, and where it stands in review. Pending and returned entries stay private until a reviewer publishes them.",
    loading: "កំពុងផ្ទុក…",
    auth: "Sign in to see the entries you have submitted.",
    signIn: "ចូល",
    error: "មិនអាចផ្ទុកធាតុបានទេ។",
    empty: "You have not submitted an entry yet.",
    emptyHint: "Add an entry and it will appear here while it waits for review.",
    add: "Add an entry",
    refresh: "Refresh status",
    checked: "Last checked",
  },
};

const refreshStyle = {
  fontFamily: fonts.stack,
  fontSize: 14,
  fontWeight: 600,
  color: colors.text2,
  background: "none",
  border: `1px solid ${colors.border}`,
  borderRadius: 6,
  padding: "8px 16px",
  cursor: "pointer",
};

export default function MyEntries() {
  const [language, setLanguage] = useState("en");
  const [state, setState] = useState({ status: "loading", entries: [], message: "", checkedAt: "" });
  const [reloadKey, setReloadKey] = useState(0);
  const tUI = t[language] || t.en;

  // Reloads whenever "Refresh status" is pressed, so a decision a reviewer made
  // while this page was open shows up without signing out and back in.
  useEffect(() => {
    let active = true;

    async function load() {
      try {
        // no-store: the review status must be current on every visit.
        const res = await fetch("/api/my-entries", { cache: "no-store" });
        const json = await res.json().catch(() => ({}));
        if (!active) return;
        if (res.status === 401) {
          setState({ status: "auth", entries: [], message: "", checkedAt: "" });
          return;
        }
        if (!res.ok) throw new Error(json.error || "Could not load your entries.");
        setState({
          status: "ready",
          entries: json.entries || [],
          message: "",
          checkedAt: new Date().toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
      } catch (err) {
        if (active) setState({ status: "error", entries: [], message: err.message, checkedAt: "" });
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const message =
    state.status === "auth" ? tUI.auth : state.status === "error" ? state.message || tUI.error : "";

  return (
    <main style={{ backgroundColor: colors.bg, color: colors.text, minHeight: "100vh" }}>
      <Navbar language={language} setLanguage={setLanguage} container={{ maxWidth: 1180, margin: "0 auto" }} />

      <div style={wrap}>
        <p className="auth-kicker" style={{ color: colors.gold, margin: 0 }}>
          {tUI.kicker}
        </p>
        <h1 className="auth-title" style={{ color: colors.text, margin: "10px 0 8px" }}>
          {tUI.title}
        </h1>
        <p
          style={{
            margin: 0,
            maxWidth: "62ch",
            fontFamily: fonts.stack,
            fontSize: 15,
            lineHeight: 1.6,
            color: colors.text2,
          }}
        >
          {tUI.intro}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginTop: 20 }}>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            disabled={state.status === "loading"}
            style={refreshStyle}
          >
            {tUI.refresh}
          </button>
          {state.checkedAt && (
            <span style={{ fontFamily: fonts.stack, fontSize: 13, color: colors.muted }}>
              {tUI.checked} {state.checkedAt}
            </span>
          )}
        </div>

        {message && (
          <p
            role="alert"
            style={{
              margin: "16px 0 0",
              fontFamily: fonts.stack,
              fontSize: 14,
              color: state.status === "auth" ? colors.text2 : colors.danger,
            }}
          >
            {message}
            {state.status === "auth" && (
              <>
                {" "}
                <a href="/login" className="auth-link">
                  {tUI.signIn}
                </a>
              </>
            )}
          </p>
        )}

        {state.status === "loading" ? (
          <p style={{ marginTop: 22, fontFamily: fonts.stack, fontSize: 15, color: colors.text2 }}>
            {tUI.loading}
          </p>
        ) : state.status === "ready" && state.entries.length === 0 ? (
          <div
            style={{
              marginTop: 22,
              padding: "36px 24px",
              textAlign: "center",
              borderRadius: 14,
              border: `1px dashed ${colors.border}`,
              backgroundColor: colors.bg2,
            }}
          >
            <p style={{ margin: 0, fontFamily: fonts.stack, fontSize: 17, fontWeight: 600, color: colors.text }}>
              {tUI.empty}
            </p>
            <p style={{ margin: "8px 0 0", fontFamily: fonts.stack, fontSize: 14.5, color: colors.text2 }}>
              {tUI.emptyHint}
            </p>
            <a
              href="/contribute"
              className="auth-button"
              style={{ display: "inline-block", width: "auto", marginTop: 18, textDecoration: "none" }}
            >
              {tUI.add}
            </a>
          </div>
        ) : state.status === "ready" ? (
          <>
            <StatusSummary entries={state.entries} language={language} />
            {state.entries.map((entry) => (
              <MyEntryCard key={entry.id} entry={entry} />
            ))}
          </>
        ) : null}
      </div>

      <Footer language={language} copyright="© 2026 Khmer Living Archive" />
    </main>
  );
}
