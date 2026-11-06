// app/review/ReviewQueue.js
// Client-side reviewer queue. Reads only pending entries and sends decisions to
// the server route, which calls the authorized review_entry database function.
"use client";

import { useEffect, useState } from "react";
import { colors, fonts } from "../../components/theme.js";
import Navbar from "../../components/Navbar.js";
import Footer from "../../components/Footer.js";
import ReviewCard from "../../components/ReviewCard.js";

const wrap = { maxWidth: 900, margin: "0 auto", padding: "48px 24px 72px" };

export default function ReviewQueue() {
  const [language, setLanguage] = useState("en");
  const [state, setState] = useState({ status: "loading", entries: [], message: "" });
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch("/api/review");
        const json = await res.json().catch(() => ({}));
        if (!active) return;
        if (res.status === 401) {
          setState({ status: "auth", entries: [], message: "Sign in to review entries." });
          return;
        }
        if (res.status === 403) {
          setState({ status: "forbidden", entries: [], message: "You do not have reviewer access." });
          return;
        }
        if (!res.ok) throw new Error(json.error || "Could not load the review queue.");
        setState({ status: "ready", entries: json.entries || [], message: "" });
      } catch (err) {
        if (active) setState({ status: "error", entries: [], message: err.message });
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  async function decide(entryId, decision) {
    setBusyId(entryId);
    setState((s) => ({ ...s, message: "" }));
    try {
      const res = await fetch(`/api/review/${entryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not review this entry.");
      setState((s) => ({
        ...s,
        entries: s.entries.filter((entry) => entry.id !== entryId),
      }));
    } catch (err) {
      setState((s) => ({ ...s, message: err.message }));
    } finally {
      setBusyId("");
    }
  }

  return (
    <main style={{ backgroundColor: colors.bg, color: colors.text, minHeight: "100vh" }}>
      <Navbar
        language={language}
        setLanguage={setLanguage}
        container={{ maxWidth: 1180, margin: "0 auto" }}
      />

      <div style={wrap}>
        <p className="auth-kicker" style={{ color: colors.gold, margin: 0 }}>
          REVIEW QUEUE
        </p>
        <h1 className="auth-title" style={{ color: colors.text, margin: "10px 0 8px" }}>
          Pending entries
        </h1>
        <p style={{ margin: "0 0 12px", fontFamily: fonts.stack, fontSize: 15, color: colors.text2 }}>
          Publishing makes an entry visible in the public archive. Rejecting
          returns the entry to its contributor, who can edit it and submit it for
          review again.
        </p>

        {state.message && (
          <p role="alert" style={{ color: colors.danger, fontFamily: fonts.stack, fontSize: 14 }}>
            {state.message}
            {state.status === "auth" && (
              <>
                {" "}
                <a href="/login" className="auth-link">
                  Sign in
                </a>
              </>
            )}
          </p>
        )}

        {state.status === "loading" ? (
          <p style={{ color: colors.text2, fontFamily: fonts.stack }}>Loading queue…</p>
        ) : state.status === "ready" && state.entries.length === 0 ? (
          <p style={{ color: colors.text2, fontFamily: fonts.stack }}>No pending entries.</p>
        ) : (
          state.entries.map((entry) => (
            <ReviewCard
              key={entry.id}
              entry={entry}
              busy={busyId === entry.id}
              onDecision={decide}
            />
          ))
        )}
      </div>

      <Footer language={language} copyright="© 2026 Khmer Living Archive - All rights reserved" />
    </main>
  );
}
