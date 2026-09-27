import { createClient } from "@supabase/ssr";

// Server-side: create Supabase client with request object
// Used in Server Components and route handlers
export const createSupabaseClient = (request) => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      global: {
        request,
      },
      auth: {
        persistSession: true,
      },
    }
  );
};