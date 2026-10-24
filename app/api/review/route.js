// app/api/review/route.js
// Reviewer-only queue. Authorization is checked explicitly before reading the
// pending rows; the database's reviewer policies remain the final backstop.
import { createSupabaseClient } from "../../supabase";
import { NextResponse } from "next/server";
import { toEntry } from "../../entry-mapper";

export async function GET(request) {
  const { supabase } = createSupabaseClient(request);

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return NextResponse.json(
      { error: "You must be signed in to review entries." },
      { status: 401 }
    );
  }

  const { data: isReviewer, error: reviewerError } =
    await supabase.rpc("is_reviewer");

  if (reviewerError) {
    console.error("Reviewer check failed:", reviewerError);
    return NextResponse.json(
      { error: "Could not verify reviewer access." },
      { status: 500 }
    );
  }

  if (isReviewer !== true) {
    return NextResponse.json(
      { error: "You do not have reviewer access." },
      { status: 403 }
    );
  }

  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Review queue read failed:", error);
    return NextResponse.json(
      { error: "Could not load the review queue." },
      { status: 500 }
    );
  }

  return NextResponse.json({ entries: (data ?? []).map(toEntry) });
}
