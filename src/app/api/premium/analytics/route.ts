import { NextResponse } from "next/server";
import { getHostAnalytics, getMembership, hasHostPro } from "@/lib/premium-membership";

export const dynamic = "force-dynamic";

// GET /api/premium/analytics?user=<id> -> { analytics } | 402 if not Host Pro
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const user = searchParams.get("user") || "";
  const membership = await getMembership(user);
  if (!hasHostPro(membership.tier)) {
    return NextResponse.json(
      { error: "Host Pro membership required", locked: true },
      { status: 402 }
    );
  }
  const analytics = await getHostAnalytics();
  return NextResponse.json({ analytics });
}
