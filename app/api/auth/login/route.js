import { createSupabaseClient } from "../../../supabase";
import { NextResponse } from "next/server";

export async function POST(request) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  const { supabase, response } = createSupabaseClient(request);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Plain error handling: never leak the underlying auth message
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  // Authentication successful, redirect home with the auth cookies attached
  const url = new URL("/", request.url);
  return NextResponse.redirect(url, { headers: response.headers });
}