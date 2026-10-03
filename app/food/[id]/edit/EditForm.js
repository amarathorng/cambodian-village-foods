// app/food/[id]/edit/EditForm.js
// Edit page for an entry the signed-in user owns. Loads the record from the
// existing /api/entries endpoint, pre-fills the same form used by /contribute
// (shared fields + shared validation), and on save updates the row through
// supabase-js. The photo is optional here: leaving the file input empty keeps the
// existing photo. After the update it chains .select() and, if no row came back
// (e.g. ownership no longer matches), tells the user the change wasn't saved.
"use client";

import { useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { colors } from "../../../../components/theme.js";
import Navbar from "../../../../components/Navbar.js";
import Footer from "../../../../components/Footer.js";
import EntryFields from "../../../../components/EntryFields.js";
import { validate } from "../../../../components/entryValidation.js";

const wrapStyle = {
  maxWidth: 640,
  margin: "0 auto",
  padding: "56px 24px 72px",
  display: "flex",
  flexDirection: "column",
};

export default function EditForm({ id }) {
  const [language, setLanguage] = useState("en");
  const [loadStatus, setLoadStatus] = useState("loading"); // loading | ready | notfound
  const [entry, setEntry] = useState(null);
  const [user, setUser] = useState(undefined); // undefined = checking, null = signed out
  const [values, setValues] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
      ),
    []
  );
  const router = useRouter();

  // Current signed-in user.
  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (active) setUser(data.user || null);
    });
    return () => {
      active = false;
    };
  }, [supabase]);

  // Load the record so the form can be pre-filled.
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/entries");
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Could not load.");
        const found = (json.entries || []).find((e) => String(e.id) === String(id));
        if (!found) {
          if (active) setLoadStatus("notfound");
          return;
        }
        if (!active) return;
        setEntry(found);
        setValues({
          title_english: found.title || "",
          title_khmer: found.khmerTitle || "",
          description_english: found.description || "",
          contributor: found.contributor || "",
          place: found.place || "",
        });
        setLoadStatus("ready");
      } catch {
        if (active) setLoadStatus("notfound");
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [id, supabase]);

  // The record must belong to the current session user.
  const isOwner = !!entry && !!user && String(entry.owner) === String(user.id);

  const setField = (name) => (e) => {
    setValues((v) => ({ ...v, [name]: e.target.value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const handlePhoto = (e) => {
    setPhoto(e.target.files && e.target.files[0] ? e.target.files[0] : null);
    setErrors((prev) => (prev.photo ? { ...prev, photo: undefined } : prev));
  };

  async function handleSubmit(ev) {
    ev.preventDefault();
    setGeneralError("");
    // Same validation rules as /contribute, but the photo is optional here.
    const nextErrors = validate(values, photo, false);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      // Keep the existing photo unless the user picked a new one.
      let photoUrl = entry.image;
      if (photo && photo.size) {
        const originalName = String(photo.name || "").toLowerCase();
        const dot = originalName.lastIndexOf(".");
        const extension = dot >= 0 ? originalName.slice(dot) : "";
        const objectPath = `${user.id}/${crypto.randomUUID()}${extension}`;
        const { error: uploadError } = await supabase.storage
          .from("photos")
          .upload(objectPath, photo, {
            contentType: photo.type,
            upsert: false,
            cacheControl: "3600",
          });
        if (uploadError) {
          console.error("Edit photo upload failed:", uploadError);
          setGeneralError("Could not upload the new photo. Please try again.");
          return;
        }
        photoUrl = supabase.storage.from("photos").getPublicUrl(objectPath).data.publicUrl;
      }

      const updates = {
        title_english: values.title_english.trim(),
        title_khmer: values.title_khmer.trim(),
        description_english: values.description_english.trim(),
        contributor: values.contributor.trim() || null,
        place: values.place.trim(),
        photo: photoUrl,
      };

      // Update through supabase-js, then confirm with .select() that a row actually
      // changed. Filtering by owner is defense in depth on top of row-level security.
      const { data, error } = await supabase
        .from("entries")
        .update(updates)
        .eq("id", id)
        .eq("owner", user.id)
        .select();

      if (error || !data || data.length === 0) {
        console.error("Update returned no row:", error || "no rows updated");
        setGeneralError("That change wasn't saved");
        return;
      }

      router.push(`/food/${id}`);
    } catch (err) {
      console.error("Edit failed:", err);
      setGeneralError("That change wasn't saved");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ backgroundColor: colors.bg, color: colors.text }}>
      <Navbar language={language} setLanguage={setLanguage} container={{ maxWidth: 1180, margin: "0 auto" }} />

      {loadStatus === "loading" || user === undefined ? (
        <main style={wrapStyle}>
          <p style={{ color: colors.text2, fontSize: 15 }}>Loading the entry…</p>
        </main>
      ) : loadStatus === "notfound" ? (
        <main style={wrapStyle}>
          <p style={{ color: colors.text2, fontSize: 15 }}>This entry could not be found.</p>
        </main>
      ) : !user ? (
        <main style={wrapStyle}>
          <p className="auth-kicker" style={{ color: colors.gold, margin: 0 }}>KHMER LIVING ARCHIVE</p>
          <h1 className="auth-title" style={{ color: colors.text, margin: "10px 0 8px" }}>Edit entry</h1>
          <p className="auth-sub" style={{ color: colors.text2 }}>
            Please{" "}
            <a href="/login" className="auth-link">
              sign in
            </a>{" "}
            before editing an entry.
          </p>
        </main>
      ) : !isOwner ? (
        <main style={wrapStyle}>
          <p className="auth-kicker" style={{ color: colors.gold, margin: 0 }}>KHMER LIVING ARCHIVE</p>
          <h1 className="auth-title" style={{ color: colors.text, margin: "10px 0 8px" }}>Edit entry</h1>
          <p className="auth-sub" style={{ color: colors.text2 }}>
            You can only edit an entry you created.
          </p>
          <p className="auth-switch">
            <a href={`/food/${id}`} className="auth-link">Back to the entry</a>
          </p>
        </main>
      ) : (
        <main style={wrapStyle}>
          <p className="auth-kicker" style={{ color: colors.gold, margin: 0 }}>KHMER LIVING ARCHIVE</p>
          <h1 className="auth-title" style={{ color: colors.text, margin: "10px 0 8px" }}>Edit entry</h1>
          <p className="auth-sub" style={{ color: colors.text2 }}>
            Adjust the details, then save. Leave the photo empty to keep the current one.
          </p>

          {generalError && (
            <p className="auth-error" role="alert" style={{ color: colors.danger }}>
              {generalError}
            </p>
          )}

          <form onSubmit={handleSubmit} aria-busy={submitting ? "true" : "false"} noValidate>
            <fieldset disabled={submitting} style={{ border: "none", margin: 0, padding: 0 }}>
              <EntryFields
                values={values}
                errors={errors}
                setField={setField}
                handlePhoto={handlePhoto}
                photoNote="Photo (optional — leave empty to keep current)"
              />
            </fieldset>

            <button type="submit" className="auth-button" disabled={submitting}>
              {submitting ? "Saving…" : "Save changes"}
            </button>
          </form>

          <p className="auth-switch" style={{ color: colors.text2 }}>
            <a href={`/food/${id}`} className="auth-link">Cancel and go back</a>
          </p>
        </main>
      )}

      <Footer language={language} copyright="© 2026 Khmer Living Archive" />
    </main>
  );
}
