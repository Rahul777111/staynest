import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const hasSupabase = Boolean(url && key);

// When env vars are absent (local/dev/build without Supabase), createClient still
// needs syntactically valid args or it throws at import/build time. Use harmless
// placeholders; `hasSupabase` stays false so all callers use the in-memory mock.
const clientUrl = url || "https://placeholder.supabase.co";
const clientKey = key || "placeholder-anon-key";

// persistSession enabled so Supabase Auth keeps the user signed in across reloads.
export const supabase = createClient(clientUrl, clientKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
