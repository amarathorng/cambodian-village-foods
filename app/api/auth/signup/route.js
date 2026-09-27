// app/api/auth/signup/route.js
import { createSupabaseClient } from "../../../supabase";
import { redirect } from "next/navigation";

export async function POST(request) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  const supabase = createSupabaseClient({ request });

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  // Redirect to home on successful sign up
  redirect("/");
}