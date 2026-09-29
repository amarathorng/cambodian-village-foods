// app/api/auth/signup/route.js
import { createSupabaseClient } from "../../../supabase";
import { NextResponse } from "next/server";

export async function POST(request) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  const { supabase, response } = createSupabaseClient(request);

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Redirect home on successful sign up, with the auth cookies attached
  const url = new URL("/", request.url);
  return NextResponse.redirect(url, { headers: response.headers });
}