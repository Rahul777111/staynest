import { NextResponse } from "next/server";
import { getMembership, setMembership, type MembershipTier } from "@/lib/premium-membership";

export const dynamic = "force-dynamic";

// GET /api/premium?user=<id> -> { membership }
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const user = searchParams.get("user") || "";
  const membership = await getMembership(user);
  return NextResponse.json({ membership });
}

// POST { user_id, tier } -> { membership }
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const user_id = (body.user_id || "").toString().trim();
  const tier = (body.tier || "free").toString().trim() as MembershipTier;
  if (!user_id) return NextResponse.json({ error: "Missing user" }, { status: 400 });
  if (!["free", "plus", "host_pro"].includes(tier))
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });

  const membership = await setMembership(user_id, tier);
  return NextResponse.json({ membership });
}
