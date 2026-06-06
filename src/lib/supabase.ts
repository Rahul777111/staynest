import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const hasSupabase = Boolean(url && key);

// When the env vars are not configured (e.g. Preview deployments or local
// builds without secrets), fall back to a harmless placeholder URL/key so
// createClient never throws "supabaseUrl is required" at build/module-eval
// time. All data access is gated behind `hasSupabase`, so the placeholder
// client is never actually called when Supabase is not configured.
// persistSession enabled so Supabase Auth keeps the user signed in across reloads.
export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  key || "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
