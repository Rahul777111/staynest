import { NextResponse } from "next/server";
import { EXPERIENCES, SERVICES } from "@/lib/experiences";
import { supabase, hasSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const kind = searchParams.get("kind") || "experiences";

  // Prefer Supabase rows when available, fall back to local seed data.
  if (hasSupabase) {
    const table = kind === "services" ? "staynest_services" : "staynest_experiences";
    const { data } = await supabase.from(table).select("*").order("rating", { ascending: false });
    if (data && data.length) {
      return NextResponse.json({ items: data, source: "supabase" });
    }
  }
  return NextResponse.json({
    items: kind === "services" ? SERVICES : EXPERIENCES,
    source: "seed",
  });
}
