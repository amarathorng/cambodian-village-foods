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