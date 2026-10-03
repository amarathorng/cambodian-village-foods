// app/api/entries/route.js
import { createSupabaseClient } from "../../supabase";
import { NextResponse } from "next/server";

// Map a row from the "entries" table into the shape EntryCard expects.
// Column names come from the actual Supabase schema:
//   id, created_at, owner, title_english, title_khmer,
//   description_english, contributor, place, photo
function toEntry(row) {
  return {
    id: row.id,
    title: row.title_english,
    khmerTitle: row.title_khmer,
    description: row.description_english,
    contributor: row.contributor,
    place: row.place,
    image: row.photo,
    created_at: row.created_at,
  };
}

export async function GET(request) {
  const { supabase } = createSupabaseClient(request);

  // Read every entry, newest first.
  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Could not load entries." },
      { status: 500 }
    );
  }

  return NextResponse.json({ entries: (data ?? []).map(toEntry) });
}

// ---- Create entry (POST) -------------------------------------------------
// Public storage bucket for the required photo.
const BUCKET = "photos";
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB
// Allow-list of accepted image extensions and their matching content types.
// Following OWASP file-upload guidance: never trust the extension alone, and
// reject anything outside this explicit set.
const ALLOWED_UPLOADS = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

// Read a form text field and trim it. Everything inserted is stripped of
// surrounding whitespace before it touches the database.
function trimmedField(formData, name) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request) {
  const { supabase } = createSupabaseClient(request);

  // Only signed-in users may add an entry. getUser() re-validates the JWT
  // server-side, so a forged request cannot claim a different owner.
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return NextResponse.json(
      { error: "You must be signed in to add an entry." },
      { status: 401 }
    );
  }
  const userId = userData.user.id;

  const formData = await request.formData();

  // Fields a contributor fills in. owner is NOT read from the form below.
  const titleEnglish = trimmedField(formData, "title_english");
  const titleKhmer = trimmedField(formData, "title_khmer");
  const description = trimmedField(formData, "description_english");
  const contributor = trimmedField(formData, "contributor");
  const place = trimmedField(formData, "place");

  // Server-side validation (defense in depth; the client validates too).
  if (!titleEnglish || titleEnglish.length > 120) {
    return NextResponse.json(
      { error: "Title must be between 1 and 120 characters." },
      { status: 422 }
    );
  }
  if (!titleKhmer || titleKhmer.length > 120) {
    return NextResponse.json(
      { error: "Khmer title must be between 1 and 120 characters." },
      { status: 422 }
    );
  }
  if (!description || description.length < 30 || description.length > 3000) {
    return NextResponse.json(
      { error: "The story must be between 30 and 3000 characters." },
      { status: 422 }
    );
  }
  if (contributor.length > 120) {
    return NextResponse.json(
      { error: "Contributor name must be 120 characters or fewer." },
      { status: 422 }
    );
  }
  if (!place || place.length > 200) {
    return NextResponse.json(
      { error: "Place must be between 1 and 200 characters." },
      { status: 422 }
    );
  }

  // The photo is required. Validate size, original extension, and the declared
  // content type against one allow-list (OWASP: reject oversized and risky
  // uploads instead of trusting the client's filename).
  const photo = formData.get("photo");
  if (!photo || !photo.size) {
    return NextResponse.json({ error: "A photo is required." }, { status: 422 });
  }
  if (photo.size > MAX_FILE_BYTES) {
    return NextResponse.json(
      { error: "The photo must be 5 MB or smaller." },
      { status: 422 }
    );
  }
  const originalName = String(photo.name || "").toLowerCase();
  const dot = originalName.lastIndexOf(".");
  const extension = dot >= 0 ? originalName.slice(dot) : "";
  const declaredType = String(photo.type || "").toLowerCase();
  if (!ALLOWED_UPLOADS[extension] || ALLOWED_UPLOADS[extension] !== declaredType) {
    return NextResponse.json(
      { error: "The photo must be a JPG, PNG, WEBP, or GIF image." },
      { status: 422 }
    );
  }

  // Randomized object path namespaced by user: <userId>/<uuid>.<ext>. Never
  // mirrors a client filename, so no traversal or overwrite of another's file.
  const objectPath = `${userId}/${crypto.randomUUID()}${extension}`;
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(objectPath, photo, {
      contentType: declaredType,
      upsert: false,
      cacheControl: "3600",
    });
  if (uploadError) {
    console.error("Photo upload failed:", uploadError);
    return NextResponse.json(
      { error: "Could not upload the photo. Please try again." },
      { status: 500 }
    );
  }

  // Save the object's public URL into the photo column.
  const photoUrl = supabase.storage.from(BUCKET).getPublicUrl(objectPath).data.publicUrl;

  // Insert ONLY the columns a contributor fills in, plus owner from the session.
  const { data, error: insertError } = await supabase
    .from("entries")
    .insert({
      owner: userId,
      title_english: titleEnglish,
      title_khmer: titleKhmer,
      description_english: description,
      contributor: contributor || null,
      place,
      photo: photoUrl,
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("Entry insert failed:", insertError);
    return NextResponse.json(
      { error: "Could not save the entry. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ entry: data }, { status: 201 });
}