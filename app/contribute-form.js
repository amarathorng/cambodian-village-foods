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

const TITLE_MAX = 120; // English and Khmer titles
const PLACE_MAX = 200; // village / place
const DESC_MIN = 30; // a story needs substance
const DESC_MAX = 3000;
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const wrapStyle = {
  maxWidth: 640,
  margin: "0 auto",
  padding: "56px 24px 80px",
  display: "flex",
  flexDirection: "column",
};

// Mirror the server rules so the user sees a message before ever hitting the API.
function validate(values, photo) {
  const e = {};
  const te = values.title_english.trim();
  const tk = values.title_khmer.trim();
  const desc = values.description_english.trim();
  const contributor = values.contributor.trim();
  const place = values.place.trim();

  if (!te) e.title_english = "Please enter a title.";
  else if (te.length > TITLE_MAX) e.title_english = `Keep the title under ${TITLE_MAX} characters.`;
  if (!tk) e.title_khmer = "Please enter the Khmer title.";
  else if (tk.length > TITLE_MAX) e.title_khmer = `Keep the Khmer title under ${TITLE_MAX} characters.`;
  if (!desc) e.description_english = "Please tell the story.";
  else if (desc.length < DESC_MIN) e.description_english = `Please write at least ${DESC_MIN} characters.`;
  else if (desc.length > DESC_MAX) e.description_english = `Please keep the story under ${DESC_MAX} characters.`;
  if (contributor.length > TITLE_MAX) e.contributor = `Keep the name under ${TITLE_MAX} characters.`;
  if (!place) e.place = "Please enter the village or place.";
  else if (place.length > PLACE_MAX) e.place = `Keep the place under ${PLACE_MAX} characters.`;

  if (!photo || !photo.size) e.photo = "Please choose a photo.";
  else if (photo.size > MAX_FILE_BYTES) e.photo = "The photo must be 5 MB or smaller.";
  else if (!ALLOWED_TYPES.includes(photo.type)) e.photo = "The photo must be a JPG, PNG, WEBP, or GIF image.";

  return e;
}

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
          <label className="auth-field" htmlFor="title_english">
            <span className="auth-label">Title (English)</span>
            <input id="title_english" className="auth-input" type="text" value={values.title_english} onChange={setField("title_english")} maxLength={TITLE_MAX} />
            {errors.title_english && <p className="field-error" role="alert">{errors.title_english}</p>}
          </label>

          <label className="auth-field" htmlFor="title_khmer">
            <span className="auth-label">Title (Khmer / ចំណងជើងជាភាសាខ្មែរ)</span>
            <input id="title_khmer" className="auth-input" type="text" value={values.title_khmer} onChange={setField("title_khmer")} maxLength={TITLE_MAX} />
            {errors.title_khmer && <p className="field-error" role="alert">{errors.title_khmer}</p>}
          </label>

          <label className="auth-field" htmlFor="description_english">
            <span className="auth-label">The story</span>
            <textarea id="description_english" className="auth-input" value={values.description_english} onChange={setField("description_english")} maxLength={DESC_MAX} placeholder="Who made it, when, and why is it special to your family?" />
            {errors.description_english && <p className="field-error" role="alert">{errors.description_english}</p>}
          </label>

          <label className="auth-field" htmlFor="contributor">
            <span className="auth-label">Contributor (who shared the story)</span>
            <input id="contributor" className="auth-input" type="text" value={values.contributor} onChange={setField("contributor")} maxLength={TITLE_MAX} />
            {errors.contributor && <p className="field-error" role="alert">{errors.contributor}</p>}
          </label>

          <label className="auth-field" htmlFor="place">
            <span className="auth-label">Village / Place</span>
            <input id="place" className="auth-input" type="text" value={values.place} onChange={setField("place")} maxLength={PLACE_MAX} />
            {errors.place && <p className="field-error" role="alert">{errors.place}</p>}
          </label>

          <label className="auth-field" htmlFor="photo">
            <span className="auth-label">Photo (required)</span>
            <input
              id="photo"
              className="auth-input"
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif"
              onChange={handlePhoto}
            />
            {errors.photo && <p className="field-error" role="alert">{errors.photo}</p>}
          </label>
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