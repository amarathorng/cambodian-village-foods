// app/food/[id]/FoodDetail.js
// Archive story page. Loads the record from the existing /api/entries/:id
// endpoint and the published collection from /api/entries, then renders the
// article. Own records gain Edit and Delete actions; deleting asks through an
// accessible dialog and is verified with .select() before leaving the page.
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar.js";
import Footer from "../../../components/Footer.js";
import StatusBadge from "../../../components/StatusBadge.js";
import ConfirmDialog from "../../../components/ConfirmDialog.js";
import { useLanguage } from "../../../components/useLanguage.js";
import { useSessionUser } from "../../../components/useSessionUser.js";
import FoodArticle from "./FoodArticle.js";

const t = {
  en: {
    back: "Back to the collection",
    loading: "Loading the record…",
    error: "Could not load this record.",
    notFound: "This food could not be found.",
    edit: "Edit entry",
    delete: "Delete",
    deleteTitle: "Delete this entry?",
    deleteMessage:
      "This cannot be undone. The story and its photograph will be removed from the archive.",
    notSaved: "That change wasn't saved.",
    pendingNotice:
      "This entry is awaiting review and is not yet visible in the public archive.",
    returnedNotice:
      "This entry was not published. Edit it to submit it for review again.",
    retry: "Back to the collection",
  },
  kh: {
    back: "ត្រឡប់ទៅបណ្ដុំឯកសារ",
    loading: "កំពុងផ្ទុក…",
    error: "មិនអាចផ្ទុកទិន្នន័យបានទេ។",
    notFound: "រកមិនឃើញម្ហូបនេះទេ។",
    edit: "កែសម្រួលធាតុ",
    delete: "លុប",
    deleteTitle: "លុបធាតុនេះ?",
    deleteMessage:
      "សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។ រឿងរ៉ាវ និងរូបថតរបស់វានឹងត្រូវដកចេញពីបណ្ណសារ។",
    notSaved: "ការផ្លាស់ប្ដូរនេះមិនត្រូវបានរក្សាទុកទេ។",
    pendingNotice:
      "ធាតុនេះកំពុងរង់ចាំការត្រួតពិនិត្យ ហើយមិនទាន់បង្ហាញជាសាធារណៈនៅក្នុងបណ្ណសារទេ។",
    returnedNotice:
      "ធាតុនេះមិនត្រូវបានចេញផ្សាយទេ។ សូមកែសម្រួលវា ដើម្បីដាក់ស្នើសម្រាប់ការត្រួតពិនិត្យម្ដងទៀត។",
    retry: "ត្រឡប់ទៅបណ្ដុំឯកសារ",
  },
};

function pad2(value) {
  return String(value).padStart(2, "0");
}

export default function FoodDetail({ id }) {
  const [language, setLanguage] = useLanguage();
  const { user, supabase } = useSessionUser();
  const [state, setState] = useState({ status: "loading", entry: null, entries: [] });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionMsg, setActionMsg] = useState("");
  const router = useRouter();
  const tUI = t[language] || t.en;

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [entryResponse, listResponse] = await Promise.all([
          fetch(`/api/entries/${id}`),
          fetch("/api/entries"),
        ]);
        const entryJson = await entryResponse.json().catch(() => ({}));

        if (!entryResponse.ok) {
          if (!active) return;
          setState({
            status: entryResponse.status === 404 ? "notfound" : "error",
            entry: null,
            entries: [],
          });
          return;
        }

        const listJson = listResponse.ok
          ? await listResponse.json().catch(() => ({ entries: [] }))
          : { entries: [] };

        if (active) {
          setState({
            status: "ready",
            entry: entryJson.entry,
            entries: listJson.entries || [],
          });
        }
      } catch {
        if (active) setState({ status: "error", entry: null, entries: [] });
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [id]);

  const { entry, entries } = state;
  const index = entry
    ? entries.findIndex((item) => String(item.id) === String(id))
    : -1;
  const isOwner = !!entry && !!user && String(entry.owner) === String(user.id);

  async function handleDelete() {
    if (!entry || !user || deleting) return;
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
      setConfirmOpen(false);
    }
  }

  return (
    <div>
      <Navbar language={language} setLanguage={setLanguage} />

      <main id="main-content">
        <div className="container container--reading">
          <div className="article-topbar">
            <a href="/#collection" className="back-link">
              <span aria-hidden="true">←</span> {tUI.back}
            </a>
            {entry && index >= 0 && (
              <span className="archive-number">
                {pad2(index + 1)} / {pad2(entries.length)}
              </span>
            )}
          </div>

          {entry && entry.status !== "published" && (
            <div className="status-note status-note--inline" role="status">
              <StatusBadge status={entry.status} language={language} />
              <span>
                {entry.status === "returned" ? tUI.returnedNotice : tUI.pendingNotice}
              </span>
            </div>
          )}

          {isOwner && (
            <div className="article-owner">
              <a href={`/food/${entry.id}/edit`} className="btn btn--secondary btn--sm">
                {tUI.edit}
              </a>
              <button
                type="button"
                className="btn btn--danger btn--sm"
                onClick={() => {
                  setActionMsg("");
                  setConfirmOpen(true);
                }}
                disabled={deleting}
              >
                {tUI.delete}
              </button>
              {actionMsg && (
                <span className="toast toast--error" role="alert">{actionMsg}</span>
              )}
            </div>
          )}

          {state.status === "loading" ? (
            <p className="status-note">{tUI.loading}</p>
          ) : state.status === "error" ? (
            <div className="empty-state">
              <p className="empty-state-title">{tUI.error}</p>
              <a href="/#collection" className="btn btn--secondary btn--sm">{tUI.retry}</a>
            </div>
          ) : entry ? (
            <FoodArticle
              entry={entry}
              entries={entries}
              index={index}
              language={language}
            />
          ) : (
            <div className="empty-state">
              <p className="empty-state-title">{tUI.notFound}</p>
              <a href="/#collection" className="btn btn--secondary btn--sm">{tUI.retry}</a>
            </div>
          )}
        </div>
      </main>

      <Footer language={language} />

      <ConfirmDialog
        open={confirmOpen}
        title={tUI.deleteTitle}
        message={tUI.deleteMessage}
        confirmLabel={tUI.delete}
        tone="danger"
        busy={deleting}
        language={language}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

