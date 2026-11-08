// app/api/my-entries/route.js
// The signed-in contributor's own submissions, at every status.
// The public archive list (/api/entries) is published-only on purpose, so
// pending and returned rows need their own owner-scoped endpoint. The owner is
// read from the session, never from a query parameter, so this list can only
// ever contain the caller's own entries.
import { createSupabaseClient } from "../../supabase";
import { NextResponse } from "next/server";
import { toEntry } from "../../entry-mapper";

export async function GET(request) {
  const { supabase } = createSupabaseClient(request);

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return NextResponse.json(
      { error: "You must be signed in to see your entries." },
      { status: 401 }
    );
  }

  // No status filter: the owner sees their whole submission history. Row-level
  // security remains the backstop that limits these rows to their owner.
  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("owner", userData.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("My entries read failed:", error);
    return NextResponse.json(
      { error: "Could not load your entries." },
      { status: 500 }
    );
  }

  return NextResponse.json({ entries: (data ?? []).map(toEntry) });
}
