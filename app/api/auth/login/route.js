// app/api/auth/login/route.js
import { createSupabaseClient } from "../../../supabase";
import { redirect } from "next/navigation";

export async function POST(request) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  
  const supabase = createSupabaseClient({ request });
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    // Handle authentication error
    return Response.json({ error: error.message }, { status: 401 });
  }
  
  // Authentication successful, redirect to home
  redirect("/");
}