// app/api/review/[id]/route.js
// Reviewer decision endpoint. The status change is performed by the authorized
// database function review_entry; this route only verifies access and validates
// the requested action.
import { createSupabaseClient } from "../../../supabase";
import { NextResponse } from "next/server";
import { toEntry } from "../../../entry-mapper";

// The UI sends publish/reject. The database function receives the actual
// status values used by the entries table.
const DECISIONS = {
  publish: "published",
  reject: "rejected",
};

export async function PATCH(request, { params }) {
  const { id } = await params;
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

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const decision = DECISIONS[body?.decision];
  if (!decision) {
    return NextResponse.json(
      { error: "Decision must be publish or reject." },
      { status: 422 }
    );
  }

  const { error: reviewError } = await supabase.rpc("review_entry", {
    entry_id: id,
    decision,
  });

  if (reviewError) {
    console.error("review_entry failed:", reviewError);
    return NextResponse.json(
      { error: "Could not review this entry." },
      { status: 400 }
    );
  }

  const { data: updated, error: readError } = await supabase
    .from("entries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (readError || !updated) {
    console.error("Reviewed entry read failed:", readError || "no row");
    return NextResponse.json(
      { error: "Could not confirm the review result." },
      { status: 500 }
    );
  }

  if (updated.status !== decision) {
    console.error("Review did not change status:", updated.status, decision);
    return NextResponse.json(
      { error: "The review did not change the entry status." },
      { status: 409 }
    );
  }

  return NextResponse.json({ entry: toEntry(updated) });
}
