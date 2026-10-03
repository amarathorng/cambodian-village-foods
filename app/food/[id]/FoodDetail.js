// app/food/[id]/FoodDetail.js
// Story-first archive detail page. Loads the record from the existing
// /api/entries endpoint, then renders the article (see FoodArticle.js).
// No content is invented; any field without data is gracefully omitted.
// When the signed-in user is the entry's owner, an Edit link and a Delete
// button are shown. Delete asks for confirmation and removes the row through
// supabase-js, verifying with .select() that a row was actually deleted.
"use client";

import { useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { colors, fonts } from "../../../components/theme.js";
import Navbar from "../../../components/Navbar.js";
import Footer from "../../../components/Footer.js";
import FoodArticle from "./FoodArticle.js";

const t = {
  en: {
    back: "Back to the collection",
    loading: "Loading the record…",
    error: "Could not load this record.",
    notFound: "This food could not be found.",
    edit: "Edit",
    delete: "Delete",
    deleteConfirm: "Delete this entry? This cannot be undone.",
    notSaved: "That change wasn't saved",
  },
  kh: {
    back: "Back to the collection",
    loading: "កំពុងផ្ទុក…",
    error: "មិនអាចផ្ទុកធាតុបានទេ។",
    notFound: "This food could not be found.",
    edit: "Edit",
    delete: "Delete",
    deleteConfirm: "Delete this entry? This cannot be undone.",
    notSaved: "That change wasn't saved",
  },
};

export default function FoodDetail({ id }) {
  const [state, setState] = useState({ status: "loading", entries: [] });
  const [language, setLanguage] = useState("en");
  const [user, setUser] = useState(undefined); // undefined checking, null signed out
  const [actionMsg, setActionMsg] = useState("");
  const [deleting, setDeleting] = useState(false);
  const tUI = t[language] || t.en;
  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
      ),
    []
  );
  const router = useRouter();

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (active) setUser(data.user || null);
    });
    return () => {
      active = false;
    };
  }, [supabase]);

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
  const isOwner = !!entry && !!user && String(entry.owner) === String(user.id);
  const contentMax = { maxWidth: 840, margin: "0 auto" };

  async function handleDelete() {
    if (!entry || !user || deleting) return;
    if (!window.confirm(tUI.deleteConfirm)) return;
    setDeleting(true);
    setActionMsg("");
    try {
      // Delete through supabase-js, then confirm with .select() that a row was
      // actually removed. Filtering by owner is defense in depth on top of RLS.
      const { data, error } = await supabase
        .from("entries")
        .delete()
        .eq("id", entry.id)
        .eq("owner", user.id)
        .select();

      if (error || !data || data.length === 0) {
        console.error("Delete returned no row:", error || "no rows deleted");
        setActionMsg(tUI.notSaved);
        return;
      }
      router.push("/");
    } catch (err) {
      console.error("Delete failed:", err);
      setActionMsg(tUI.notSaved);
    } finally {
      setDeleting(false);
    }
  }

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

        {isOwner && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
            <a
              href={`/food/${entry.id}/edit`}
              style={{
                fontFamily: fonts.stack,
                fontSize: 14,
                fontWeight: 600,
                color: colors.text2,
                background: "none",
                border: `1px solid ${colors.border}`,
                borderRadius: 6,
                padding: "8px 16px",
                textDecoration: "none",
              }}
            >
              {tUI.edit}
            </a>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              style={{
                fontFamily: fonts.stack,
                fontSize: 14,
                fontWeight: 600,
                color: colors.danger,
                background: "none",
                border: `1px solid rgba(201, 106, 91, 0.55)`,
                borderRadius: 6,
                padding: "8px 16px",
                cursor: "pointer",
              }}
            >
              {deleting ? "Deleting…" : tUI.delete}
            </button>
            {actionMsg && (
              <span role="alert" style={{ fontFamily: fonts.stack, fontSize: 14, color: colors.danger }}>
                {actionMsg}
              </span>
            )}
          </div>
        )}

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