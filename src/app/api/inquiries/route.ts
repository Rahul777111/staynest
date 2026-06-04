import { NextResponse } from "next/server";
import { supabase, hasSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { listingId, guestName, message } = body;
  if (!listingId || !guestName || !message)
    return NextResponse.json({ error: "Please add your name and a message" }, { status: 400 });

  if (hasSupabase) {
    await supabase.from("staynest_inquiries").insert({
      listing_id: listingId,
      guest_name: guestName,
      message,
    });
  }
  return NextResponse.json({ ok: true });
}
