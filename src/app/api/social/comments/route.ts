import { NextResponse } from "next/server";
import { listComments, addComment } from "@/lib/social-store";

export const dynamic = "force-dynamic";

// GET /api/social/comments?post=<id> -> { comments }
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const post = searchParams.get("post") || "";
  if (!post) return NextResponse.json({ comments: [] });
  const comments = await listComments(post);
  return NextResponse.json({ comments });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const post_id = (body.post_id || "").toString().trim();
  const author_id = (body.author_id || "").toString().trim();
  const author_name = (body.author_name || "Guest").toString().trim();
  const text = (body.text || "").toString().trim();
  if (!post_id || !author_id)
    return NextResponse.json({ error: "Missing post or author" }, { status: 400 });
  if (!text)
    return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 });

  const comment = await addComment({
    post_id,
    author_id,
    author_name,
    author_avatar: body.author_avatar,
    text,
  });
  return NextResponse.json({ comment }, { status: 201 });
}
