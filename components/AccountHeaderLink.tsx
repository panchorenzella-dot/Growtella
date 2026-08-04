"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

export function AccountHeaderLink({ mobile = false }: { mobile?: boolean }) {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    void supabase.auth.getSession().then(({ data }) => {
      setAuthenticated(Boolean(data.session));
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(Boolean(session));
    });

    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <Link
      href="/cuenta"
      className={
        mobile
          ? "rounded-xl px-4 py-3 text-center text-sm font-bold text-[#153f2e]"
          : "rounded-full px-4 py-2.5 text-sm font-bold text-[#153f2e] transition hover:bg-[#eff6f1] focus-ring"
      }
    >
      {authenticated ? "Mi cuenta" : "Ingresar"}
    </Link>
  );
}
