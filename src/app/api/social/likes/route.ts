import { NextResponse } from "next/server";
import { setLike, isLiked } from "@/lib/social-store";

export const dynamic = "force-dynamic";

// GET /api/social/likes?post=<id>&user=<id> -> { liked }
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const post = searchParams.get("post") || "";
  const user = searchParams.get("user") || "";
  const liked = await isLiked(post, user);
  return NextResponse.json({ liked });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const post_id = (body.post_id || "").toString().trim();
  const user_id = (body.user_id || "").toString().trim();
  const liked = body.liked !== false; // default to like
  if (!post_id || !user_id)
    return NextResponse.json({ error: "Missing post or user" }, { status: 400 });

  const result = await setLike(post_id, user_id, liked, body.actor_name);
  return NextResponse.json(result);
}
