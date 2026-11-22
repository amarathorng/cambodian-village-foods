// app/food/[id]/edit/EditForm.js
// Edit page for an entry the signed-in user owns. Loads the record from the
// existing /api/entries/:id endpoint, pre-fills the same form used by
// /contribute (shared fields + shared validation), and on save updates the row
// through supabase-js. The photo is optional: leaving the file input empty keeps
// the existing photograph. After the update it chains .select() and, if no row
// came back (e.g. ownership no longer matches), tells the user it wasn't saved.
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../../components/Navbar.js";
import Footer from "../../../../components/Footer.js";
import EntryFields from "../../../../components/EntryFields.js";
import StatusBadge from "../../../../components/StatusBadge.js";
import { validate } from "../../../../components/entryValidation.js";
import { useLanguage } from "../../../../components/useLanguage.js";
import { useSessionUser } from "../../../../components/useSessionUser.js";

const t = {
  en: {
    kicker: "EDIT ENTRY",
    title: "Edit this food story",
    lead: "Adjust the details, then save. Leave the photo empty to keep the current one.",
    loading: "Loading the entry…",
    notFound: "This entry could not be found.",
    signedOut: "Sign in before editing an entry.",
    signIn: "Sign in",
    notOwner: "You can only edit an entry you created.",
    backToEntry: "Back to the entry",
    cancel: "Cancel and go back",
    save: "Save changes",
    saving: "Saving…",
    saveNote: "Saving returns this entry to review before it is public again.",
    private: "This entry stays private until a reviewer publishes it.",
    photoNote: "New photograph (optional)",
    photoError: "Could not upload the new photo. Please try again.",
    notSaved: "That change wasn't saved",
    notResubmitted: "Saved, but the entry was not returned to review.",
  },
  kh: {
    kicker: "កែសម្រួលធាតុ",
    title: "កែសម្រួលរឿងរ៉ាវអាហារនេះ",
    lead: "កែសម្រួលព័ត៌មានលម្អិត រួចរក្សាទុក។ ទុករូបថតទំនេរ ដើម្បីរក្សារូបថតបច្ចុប្បន្ន។",
    loading: "កំពុងផ្ទុក…",
    notFound: "រកមិនឃើញធាតុនេះទេ។",
    signedOut: "សូមចូលគណនីជាមុន ទើបកែសម្រួលធាតុបាន។",
    signIn: "ចូល",
    notOwner: "អ្នកអាចកែសម្រួលបានតែធាតុដែលអ្នកបានបង្កើតប៉ុណ្ណោះ។",
    backToEntry: "ត្រឡប់ទៅធាតុវិញ",
    cancel: "បោះបង់ ហើយត្រឡប់ក្រោយ",
    save: "រក្សាទុកការផ្លាស់ប្ដូរ",
    saving: "កំពុងរក្សាទុក…",
    saveNote: "ការរក្សាទុកនឹងបញ្ជូនធាតុនេះទៅត្រួតពិនិត្យឡើងវិញ មុនពេលវាចេញជាសាធារណៈម្ដងទៀត។",
    private: "ធាតុនេះនៅឯកជន រហូតដល់អ្នកត្រួតពិនិត្យចេញផ្សាយវា។",
    photoNote: "រូបថតថ្មី (មិនចាំបាច់)",
    photoError: "មិនអាចផ្ទុករូបថតថ្មីឡើងបានទេ។ សូមព្យាយាមម្ដងទៀត។",
    notSaved: "ការផ្លាស់ប្ដូរនេះមិនត្រូវបានរក្សាទុកទេ",
    notResubmitted: "បានរក្សាទុក ប៉ុន្តែធាតុមិនត្រូវបានបញ្ជូនទៅត្រួតពិនិត្យវិញទេ។",
  },
};

export default function EditForm({ id }) {
  const [language, setLanguage] = useLanguage();
  const { user, supabase } = useSessionUser();
  const [loadStatus, setLoadStatus] = useState("loading"); // loading | ready | notfound
  const [entry, setEntry] = useState(null);
  const [values, setValues] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const tUI = t[language] || t.en;

  // Load the record so the form can be pre-filled.
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const response = await fetch(`/api/entries/${id}`);
        const json = await response.json();
        if (!response.ok) throw new Error(json.error || "Could not load.");
        const found = json.entry;
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
          description_kh: found.descriptionKh || "",
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
  }, [id]);

  // The record must belong to the current session user.
  const isOwner = !!entry && !!user && String(entry.owner) === String(user.id);

  const setField = (name) => (event) => {
    setValues((current) => ({ ...current, [name]: event.target.value }));
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
    // Same validation rules as /contribute, but the photo is optional here.
    const nextErrors = validate(values, photo, false, language);
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
          setGeneralError(tUI.photoError);
          return;
        }
        photoUrl = supabase.storage.from("photos").getPublicUrl(objectPath).data.publicUrl;
      }

      const updates = {
        title_english: values.title_english.trim(),
        title_khmer: values.title_khmer.trim(),
        description_english: values.description_english.trim(),
        // Optional: an empty Khmer story clears the column back to null.
        description_kh: values.description_kh.trim() || null,
        contributor: values.contributor.trim() || null,
        place: values.place.trim(),
        photo: photoUrl,
        // Any owner edit must be reviewed again, including edits to a published row.
        status: "pending",
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
        setGeneralError(tUI.notSaved);
        return;
      }

      if (data[0]?.status !== "pending") {
        console.error("Edit did not return entry to pending:", data[0]?.status);
        setGeneralError(tUI.notResubmitted);
        return;
      }

      router.push(`/food/${id}`);
    } catch (error) {
      console.error("Edit failed:", error);
      setGeneralError(tUI.notSaved);
    } finally {
      setSubmitting(false);
    }
  }


  return (
    <div>
      <Navbar language={language} setLanguage={setLanguage} />

      <main id="main-content" className="form-page">
        <div className="container container--reading">
          {loadStatus === "loading" || user === undefined ? (
            <p className="status-note" role="status">{tUI.loading}</p>
          ) : loadStatus === "notfound" ? (
            <div className="empty-state">
              <p className="empty-state-title">{tUI.notFound}</p>
              <a href={`/food/${id}`} className="btn btn--secondary btn--sm">{tUI.backToEntry}</a>
            </div>
          ) : !user ? (
            <div className="gate-card">
              <p className="auth-kicker">{tUI.kicker}</p>
              <h1 className="form-heading">{tUI.title}</h1>
              <p className="auth-sub">
                {tUI.signedOut}{" "}
                <a href="/login" className="auth-link">{tUI.signIn}</a>
              </p>
            </div>
          ) : !isOwner ? (
            <div className="gate-card">
              <p className="auth-kicker">{tUI.kicker}</p>
              <h1 className="form-heading">{tUI.title}</h1>
              <p className="auth-sub">{tUI.notOwner}</p>
              <a href={`/food/${id}`} className="btn btn--secondary btn--sm">{tUI.backToEntry}</a>
            </div>
          ) : (
            <>
              <div className="form-head">
                <p className="auth-kicker">{tUI.kicker}</p>
                <h1 className="form-heading">{tUI.title}</h1>
                <p className="form-lead">{tUI.lead}</p>
                <div className="status-note status-note--inline">
                  <StatusBadge status={entry.status} language={language} />
                  <span>{entry.status === "published" ? tUI.saveNote : tUI.private}</span>
                </div>
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
                      photoRequired={false}
                      language={language}
                    />
                  </fieldset>

                  <div className="form-actions">
                    <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
                      {submitting ? (
                        <>
                          <span className="spinner" aria-hidden="true" />
                          {tUI.saving}
                        </>
                      ) : (
                        tUI.save
                      )}
                    </button>
                    <p className="form-note">{tUI.saveNote}</p>
                  </div>
                </form>
              </div>

              <p className="auth-switch">
                <a href={`/food/${id}`} className="auth-link">{tUI.cancel}</a>
              </p>
            </>
          )}
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}

