import { NextResponse } from "next/server";
import { getFeed } from "@/lib/social-store";

export const dynamic = "force-dynamic";

// GET /api/social/feed?viewer=<id> -> { feed }
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const viewer = searchParams.get("viewer") || "";
  const feed = await getFeed(viewer);
  return NextResponse.json({ feed });
}
