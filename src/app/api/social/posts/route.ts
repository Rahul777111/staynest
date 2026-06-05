import { NextResponse } from "next/server";
import { listPosts, createPost } from "@/lib/social-store";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const authorId = searchParams.get("authorId") || undefined;
  const posts = await listPosts({ authorId });
  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const text = (body.text || "").toString().trim();
  const author_id = (body.author_id || "").toString().trim();
  const author_name = (body.author_name || "Guest").toString().trim();

  if (!author_id)
    return NextResponse.json({ error: "Missing author" }, { status: 400 });
  if (!text && !body.image_url)
    return NextResponse.json(
      { error: "Add some text or an image" },
      { status: 400 }
    );

  const post = await createPost({
    author_id,
    author_name,
    author_avatar: body.author_avatar,
    text,
    image_url: body.image_url || null,
    listing_id: body.listing_id || null,
  });
  return NextResponse.json({ post }, { status: 201 });
}
