// app/api/review/[id]/route.js
// Reviewer decision endpoint. The status change is performed by the authorized
// database function review_entry; this route only verifies access and validates
// the requested action.
import { createSupabaseClient } from "../../../supabase";
import { NextResponse } from "next/server";

// The UI offers publish/reject. review_entry accepts the decision names
// "published" and "rejected" (see supabase/review_entry.sql). The
// entries_status_check constraint only allows pending, published, and
// returned, so a rejection is stored as "returned" and goes back to its owner.
// Each entry keeps both values: what the function receives, and the status
// that should end up in the row.
const DECISIONS = {
  publish: { decision: "published", status: "published" },
  reject: { decision: "rejected", status: "returned" },
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

  const choice = DECISIONS[body?.decision];
  if (!choice) {
    return NextResponse.json(
      { error: "Decision must be publish or reject." },
      { status: 422 }
    );
  }

  const { data: accepted, error: reviewError } = await supabase.rpc(
    "review_entry",
    {
      entry_id: id,
      decision: choice.decision,
    }
  );

  if (reviewError) {
    console.error("review_entry failed:", reviewError);
    // 22023 and 23514 are the two errors the old function versions raise: the
    // wrong decision names, and a status the entries_status_check rejects.
    // Both mean supabase/review_entry.sql has not been applied to this project.
    const staleFunction =
      reviewError.code === "22023" || reviewError.code === "23514";
    return NextResponse.json(
      {
        error: staleFunction
          ? "The review_entry database function is out of date. Run " +
            "supabase/review_entry.sql in the Supabase SQL editor, then try again."
          : "Could not review this entry.",
      },
      { status: 400 }
    );
  }

  // review_entry returns true only when it actually changed the row. False
  // means the database refused: the caller is not a reviewer according to the
  // database function, or the entry is no longer pending. Report that plainly
  // instead of leaving the reviewer with a silent no-op.
  if (accepted === false) {
    console.error("review_entry refused the decision:", { id, choice });
    return NextResponse.json(
      {
        error:
          "The database refused this decision and the entry was not changed. " +
          "Check that supabase/review_entry.sql has been run and that the " +
          "entry is still pending.",
      },
      { status: 409 }
    );
  }

  // Confirm the stored status when the row is readable. A reviewer can read
  // pending rows, but a returned row belongs to its owner and may be hidden by
  // row-level security, so a missing row is not treated as a failure: the
  // function's true/false answer above is the authority.
  const { data: updated, error: readError } = await supabase
    .from("entries")
    .select("status")
    .eq("id", id)
    .maybeSingle();

  if (readError) {
    console.error("Reviewed entry read failed:", readError);
  } else if (updated && updated.status !== choice.status) {
    console.error("Review did not change status:", updated.status, choice);
    return NextResponse.json(
      { error: "The review did not change the entry status." },
      { status: 409 }
    );
  }

  return NextResponse.json({ id, status: choice.status });
}
