import { createClient } from "@supabase/ssr";

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
        storage: typeof window !== "undefined" ? localStorage : false,
      },
    }
  );
};