// app/food/[id]/FoodDetail.js
// Story-first archive detail page. Loads the record from the existing
// /api/entries endpoint, then renders the article (see FoodArticle.js).
// No content is invented; any field without data is gracefully omitted.
"use client";

import { useEffect, useState } from "react";
import { colors, fonts } from "../../../components/theme.js";
import Navbar from "../../../components/Navbar.js";
import Footer from "../../../components/Footer.js";
import FoodArticle from "./FoodArticle.js";

const t = {
  en: { back: "Back to the collection", loading: "Loading the record…", error: "Could not load this record.", notFound: "This food could not be found." },
  kh: { back: "Back to the collection", loading: "កំពុងផ្ទុក…", error: "មិនអាចផ្ទុកធាតុបានទេ។", notFound: "This food could not be found." },
};

export default function FoodDetail({ id }) {
  const [state, setState] = useState({ status: "loading", entries: [] });
  const [language, setLanguage] = useState("en");
  const tUI = t[language] || t.en;

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/entries");
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Could not load.");
        if (active) setState({ status: "ready", entries: json.entries });
      } catch {
        if (active) setState({ status: "error", entries: [] });
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const entries = state.entries;
  const index = entries.findIndex((e) => String(e.id) === String(id));
  const entry = index >= 0 ? entries[index] : null;
  const contentMax = { maxWidth: 840, margin: "0 auto" };

  return (
    <main style={{ backgroundColor: colors.bg, color: colors.text }}>
      <Navbar language={language} setLanguage={setLanguage} container={{ maxWidth: 1180, margin: "0 auto" }} />

      <div style={contentMax}>
        <nav aria-label="Archive" style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <a href="/#collection" className="back-link" style={{ fontFamily: fonts.stack, fontSize: 14, color: colors.green2, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span aria-hidden="true">←</span> {tUI.back}
          </a>
          {entry && (
            <span className="archive-number" style={{ fontFamily: fonts.stack, fontSize: 13, letterSpacing: "0.1em", color: colors.muted }}>
              {String(index + 1).padStart(2, "0")} / {String(entries.length).padStart(2, "0")}
            </span>
          )}
        </nav>

        {state.status === "loading" ? (
          <p style={{ color: colors.text2, paddingTop: 24 }}>{tUI.loading}</p>
        ) : state.status === "error" ? (
          <p style={{ color: colors.danger, paddingTop: 24 }}>{tUI.error}</p>
        ) : entry ? (
          <FoodArticle entry={entry} entries={entries} index={index} language={language} />
        ) : (
          <p style={{ color: colors.text2, paddingTop: 24 }}>{tUI.notFound}</p>
        )}
      </div>

      <Footer language={language} copyright="© 2026 Khmer Living Archive" />
    </main>
  );
}