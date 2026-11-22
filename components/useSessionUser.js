// components/useSessionUser.js
// Reads the Supabase session for the header: user is undefined while the
// session resolves, null when signed out, and the Supabase user when signed in.
// isReviewer comes from the existing is_reviewer() database function, which is
// only used to decide whether to show the review link — the review API still
// enforces authorization on its own.
"use client";

import { useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export function useSessionUser() {
  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
      ),
    []
  );
  const [user, setUser] = useState(undefined);
  const [isReviewer, setIsReviewer] = useState(false);

  useEffect(() => {
    let active = true;

    const syncUser = async (nextUser) => {
      if (!active) return;
      setUser(nextUser);
      if (!nextUser) {
        setIsReviewer(false);
        return;
      }
      const { data } = await supabase.rpc("is_reviewer");
      if (active) setIsReviewer(data === true);
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      syncUser(session ? session.user : null);
    });
    supabase.auth.getUser().then(({ data }) => syncUser(data.user || null));

    return () => {
      active = false;
      listener?.subscription.unsubscribe();
    };
  }, [supabase]);

  return { user, isReviewer, supabase };
}
