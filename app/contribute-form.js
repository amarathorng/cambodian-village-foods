// app/contribute-form.js
// Client-side "Add an entry" page. It first checks the Supabase session: a signed-in
// user sees the contribution form; a signed-out visitor sees a link to sign in.
// On submit the photo is uploaded via the server route (which uploads it to Storage,
// sets owner from the session, and inserts the row), then the user is taken to the
// new entry's detail page. Field rules are shown next to each field.
"use client";

import { useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { colors } from "../components/theme.js";
import EntryFields from "../components/EntryFields.js";
import { validate } from "../components/entryValidation.js";

const wrapStyle = {
  maxWidth: 640,
  margin: "0 auto",
  padding: "56px 24px 80px",
  display: "flex",
  flexDirection: "column",
};

export default function ContributeForm() {
  // Session state: "loading" -> checking, "out" -> signed out, "in" -> signed in.
  const [auth, setAuth] = useState("loading");
  const [values, setValues] = useState({
    title_english: "",
    title_khmer: "",
    description_english: "",
    contributor: "",
    place: "",
  });
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

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setAuth(data.session ? "in" : "out");
    });
    return () => {
      active = false;
    };
  }, [supabase]);

  const setField = (name) => (e) => {
    setValues((v) => ({ ...v, [name]: e.target.value }));
    // Clear the field's error as soon as the user starts fixing it.
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const handlePhoto = (e) => {
    setPhoto(e.target.files && e.target.files[0] ? e.target.files[0] : null);
    setErrors((prev) => (prev.photo ? { ...prev, photo: undefined } : prev));
  };

  async function handleSubmit(ev) {
    ev.preventDefault();
    setGeneralError("");

    const nextErrors = validate(values, photo);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(values).forEach((name) => formData.append(name, values[name].trim()));
      formData.append("photo", photo);

      const res = await fetch("/api/entries", { method: "POST", body: formData });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("Contribute failed:", json.error || `HTTP ${res.status}`);
        setGeneralError(json.error || "Could not save the entry. Please try again.");
        return;
      }
      router.push(`/food/${json.entry.id}`);
    } catch (err) {
      // Never surface the raw error to the user; log it for us to debug.
      console.error("Contribute request errored:", err);
      setGeneralError("Could not reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (auth === "loading") {
    return (
      <main style={wrapStyle}>
        <p style={{ color: colors.text2, fontSize: 15 }}>Checking your session…</p>
      </main>
    );
  }

  if (auth === "out") {
    return (
      <main style={wrapStyle}>
        <p className="auth-kicker" style={{ color: colors.gold, margin: 0 }}>
          KHMER LIVING ARCHIVE
        </p>
        <h1 className="auth-title" style={{ color: colors.text, margin: "10px 0 8px" }}>
          Add an entry
        </h1>
        <p className="auth-sub" style={{ color: colors.text2 }}>
          Please{" "}
          <a href="/login" className="auth-link">
            sign in
          </a>{" "}
          to share a village food story and its photo.
        </p>
      </main>
    );
  }

  return (
    <main style={wrapStyle}>
      <p className="auth-kicker" style={{ color: colors.gold, margin: 0 }}>
        KHMER LIVING ARCHIVE
      </p>
      <h1 className="auth-title" style={{ color: colors.text, margin: "10px 0 8px" }}>
        Add an entry
      </h1>
      <p className="auth-sub" style={{ color: colors.text2 }}>
        Share a food, the village it belongs to, and a photo.
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
            photoNote="Photo (required)"
          />
        </fieldset>

        <button type="submit" className="auth-button" disabled={submitting}>
          {submitting ? "Uploading and saving…" : "Add entry"}
        </button>
      </form>

      <p className="auth-switch" style={{ color: colors.text2 }}>
        <a href="/" className="auth-link">Back to the archive</a>
      </p>
    </main>
  );
}