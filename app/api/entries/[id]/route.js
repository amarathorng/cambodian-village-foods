// app/api/entries/[id]/route.js
// Single-record read used by the detail and edit pages. The public archive list
// is published-only; this endpoint lets an owner open their own pending/rejected
// row and lets a reviewer inspect it, while everyone else gets a 404.
import { createSupabaseClient } from "../../../supabase";
import { NextResponse } from "next/server";
import { toEntry } from "../../../entry-mapper";

export async function GET(request, { params }) {
  const { id } = await params;
  const { supabase } = createSupabaseClient(request);

  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Single entry read failed:", error);
    return NextResponse.json(
      { error: "Could not load the entry." },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json({ error: "Entry not found." }, { status: 404 });
  }

  // RLS already restricts this query. This explicit check is defense in depth:
  // non-published rows are visible only to their owner or a reviewer.
  if (data.status !== "published") {
    const { data: userData } = await supabase.auth.getUser();
    const isOwner =
      !!userData?.user && String(data.owner) === String(userData.user.id);

    if (!isOwner) {
      const { data: isReviewer, error: reviewerError } =
        await supabase.rpc("is_reviewer");

      if (reviewerError) {
        console.error("Reviewer check failed:", reviewerError);
        return NextResponse.json(
          { error: "Could not load the entry." },
          { status: 500 }
        );
      }

      if (isReviewer !== true) {
        return NextResponse.json(
          { error: "Entry not found." },
          { status: 404 }
        );
      }
    }
  }

  return NextResponse.json({ entry: toEntry(data) });
}
