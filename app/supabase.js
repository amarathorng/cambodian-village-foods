import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// Server-side: create a Supabase client for Route Handlers.
// Returns { supabase, response }. The caller must return `response` from the
// route so that any auth cookies set during the request (e.g. the session
// cookie written on login/signup) are sent back to the browser.
export const createSupabaseClient = (request) => {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
      auth: {
        persistSession: true,
      },
    }
  );

  return { supabase, response: supabaseResponse };
};