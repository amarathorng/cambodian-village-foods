// app/contribute-form.js
// Client-side "Add a food story" page. It first checks the Supabase session: a
// signed-in user sees the contribution form; a signed-out visitor is invited to
// sign in. On submit the photo is uploaded through the existing server route
// (which uploads to Storage, sets owner from the session, and inserts the row),
// then the user is taken to the new entry's detail page. Field rules are shown
// next to each field; no submission is faked.
"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar.js";
import Footer from "../components/Footer.js";
import EntryFields from "../components/EntryFields.js";
import { validate } from "../components/entryValidation.js";
import { apiErrorMessage } from "../components/api-errors.js";
import { useLanguage } from "../components/useLanguage.js";

const t = {
  en: {
    kicker: "CONTRIBUTE",
    title: "Add a food story",
    lead: "Share a dish from your village — its Khmer and English names, the place it comes from, the person who taught it, and a photograph.",
    reviewNote: "New entries are reviewed before they appear in the public archive.",
    checking: "Checking your session…",
    gateTitle: "Sign in to contribute",
    gateBody:
      "Contributions are open to signed-in contributors so every entry can be credited to its author and reviewed before publication.",
    signIn: "Sign in",
    signUp: "Create an account",
    submit: "Submit for review",
    submitting: "Uploading and saving…",
    uploadNote: "Uploading the photograph, then saving the story.",
    back: "Back to the archive",
    photoNote: "Photograph of the food",
    fallbackError: "Could not save the entry. Please try again.",
    networkError: "Could not reach the server. Please try again.",
  },
  kh: {
    kicker: "ចូលរួមចំណែក",
    title: "បន្ថែមរឿងរ៉ាវអាហារ",
    lead: "ចែករំលែកម្ហូបមួយមុខពីភូមិរបស់អ្នក — ឈ្មោះជាភាសាខ្មែរ និងអង់គ្លេស ទីកន្លែងដែលវាមកពី អ្នកដែលបានបង្រៀនអ្នក និងរូបថតមួយសន្លឹក។",
    reviewNote: "ធាតុថ្មីៗត្រូវបានត្រួតពិនិត្យ មុនពេលបង្ហាញនៅក្នុងបណ្ណសារសាធារណៈ។",
    checking: "កំពុងផ្ទុក…",
    gateTitle: "ចូលដើម្បីចូលរួមចំណែក",
    gateBody:
      "ការចូលរួមចំណែកបើកសម្រាប់អ្នកដែលបានចូលគណនី ដើម្បីឱ្យធាតុនីមួយៗមានឈ្មោះអ្នកនិពន្ធ និងត្រូវបានត្រួតពិនិត្យមុនពេលចេញផ្សាយ។",
    signIn: "ចូល",
    signUp: "ចុះឈ្មោះ",
    submit: "ដាក់ស្នើសម្រាប់ការត្រួតពិនិត្យ",
    submitting: "កំពុងផ្ទុក និងរក្សាទុក…",
    uploadNote: "កំពុងផ្ទុករូបថត រួចរក្សាទុករឿងរ៉ាវ។",
    back: "ត្រឡប់ទៅបណ្ណសារ",
    photoNote: "រូបថតរបស់ម្ហូប",
    fallbackError: "មិនអាចរក្សាទុកធាតុបានទេ។ សូមព្យាយាមម្ដងទៀត។",
    networkError: "មិនអាចភ្ជាប់ទៅម៉ាស៊ីនមេបានទេ។ សូមព្យាយាមម្ដងទៀត។",
  },
};

export default function ContributeForm() {
  // Session state: "loading" -> checking, "out" -> signed out, "in" -> signed in.
  const [auth, setAuth] = useState("loading");
  const [language, setLanguage] = useLanguage();
  const [values, setValues] = useState({
    title_english: "",
    title_khmer: "",
    description_english: "",
    // Optional Khmer story. The FormData loop below appends every key, so this
    // field reaches the API without any extra wiring.
    description_kh: "",
    contributor: "",
    place: "",
  });
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
  const router = useRouter();
  const tUI = t[language] || t.en;

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

  const setField = (name) => (event) => {
    setValues((current) => ({ ...current, [name]: event.target.value }));
    // Clear the field's error as soon as the user starts fixing it.
    setErrors((previous) =>
      previous[name] ? { ...previous, [name]: undefined } : previous
    );
  };

  const handlePhoto = (event) => {
    setPhoto(event.target.files && event.target.files[0] ? event.target.files[0] : null);
    setErrors((previous) => (previous.photo ? { ...previous, photo: undefined } : previous));
  };

  const removePhoto = () => {
    setPhoto(null);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setGeneralError("");

    const nextErrors = validate(values, photo, true, language);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(values).forEach((name) => formData.append(name, values[name].trim()));
      formData.append("photo", photo);

      const response = await fetch("/api/entries", { method: "POST", body: formData });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error("Contribute failed:", json.error || `HTTP ${response.status}`);
        // The API sends a stable code; the message is shown in the reader's
        // language, so Khmer mode never displays a raw English error.
        setGeneralError(apiErrorMessage(json, language, tUI.fallbackError));
        return;
      }
      router.push(`/food/${json.entry.id}`);
    } catch (error) {
      // Never surface the raw error to the user; log it for us to debug.
      console.error("Contribute request errored:", error);
      setGeneralError(tUI.networkError);
    } finally {
      setSubmitting(false);
    }
  }

  if (auth === "loading") {
    return (
      <div>
        <Navbar language={language} setLanguage={setLanguage} />
        <main id="main-content" className="form-page">
          <div className="container container--reading">
            <p className="status-note" role="status">{tUI.checking}</p>
          </div>
        </main>
        <Footer language={language} />
      </div>
    );
  }

  if (auth === "out") {
    return (
      <div>
        <Navbar language={language} setLanguage={setLanguage} />
        <main id="main-content" className="form-page">
          <div className="container container--reading">
            <div className="gate-card">
              <p className="auth-kicker">{tUI.kicker}</p>
              <h1 className="form-heading">{tUI.gateTitle}</h1>
              <p className="auth-sub">{tUI.gateBody}</p>
              <div className="empty-state-actions">
                <a href="/login" className="btn btn--primary">{tUI.signIn}</a>
                <a href="/signup" className="btn btn--secondary">{tUI.signUp}</a>
              </div>
            </div>
          </div>
        </main>
        <Footer language={language} />
      </div>
    );
  }

  return (
    <div>
      <Navbar language={language} setLanguage={setLanguage} />

      <main id="main-content" className="form-page">
        <div className="container">
          <div className="form-head">
            <p className="auth-kicker">{tUI.kicker}</p>
            <h1 className="form-heading">{tUI.title}</h1>
            <p className="form-lead">{tUI.lead}</p>
            <p className="auth-hint">{tUI.reviewNote}</p>
          </div>

          {generalError && (
            <div className="toast toast--error form-error-summary" role="alert">
              <span>{generalError}</span>
            </div>
          )}

          <div className="form-card">
            <form
              onSubmit={handleSubmit}
              aria-busy={submitting ? "true" : "false"}
              noValidate
            >
              <fieldset disabled={submitting} style={{ border: "none", margin: 0, padding: 0 }}>
                <EntryFields
                  values={values}
                  errors={errors}
                  setField={setField}
                  handlePhoto={handlePhoto}
                  onRemovePhoto={removePhoto}
                  photo={photo}
                  photoNote={tUI.photoNote}
                  language={language}
                />
              </fieldset>

              {submitting && (
                <div className="upload-bar" role="progressbar" aria-label={tUI.uploadNote}>
                  <span />
                </div>
              )}

              <div className="form-actions">
                <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className="spinner" aria-hidden="true" />
                      {tUI.submitting}
                    </>
                  ) : (
                    tUI.submit
                  )}
                </button>
                <p className="form-note">
                  {submitting ? tUI.uploadNote : tUI.reviewNote}
                </p>
              </div>
            </form>
          </div>

          <p className="auth-switch">
            <a href="/" className="auth-link">{tUI.back}</a>
          </p>
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}

