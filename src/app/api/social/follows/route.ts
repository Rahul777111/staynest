import { NextResponse } from "next/server";
import { setFollow, isFollowing, getProfile } from "@/lib/social-store";

export const dynamic = "force-dynamic";

// GET /api/social/follows?follower=<id>&followee=<id> -> { following }
// GET /api/social/follows?profile=<id>&viewer=<id>     -> { profile }
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const profile = searchParams.get("profile");
  const viewer = searchParams.get("viewer") || undefined;
  if (profile) {
    const summary = await getProfile(profile, viewer);
    return NextResponse.json({ profile: summary });
  }
  const follower = searchParams.get("follower") || "";
  const followee = searchParams.get("followee") || "";
  const following = await isFollowing(follower, followee);
  return NextResponse.json({ following });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const follower_id = (body.follower_id || "").toString().trim();
  const followee_id = (body.followee_id || "").toString().trim();
  const follow = body.follow !== false; // default to follow
  if (!follower_id || !followee_id)
    return NextResponse.json({ error: "Missing user" }, { status: 400 });
  if (follower_id === followee_id)
    return NextResponse.json({ error: "You cannot follow yourself" }, { status: 400 });

  const result = await setFollow(follower_id, followee_id, follow, body.follower_name);
  return NextResponse.json(result);
}
