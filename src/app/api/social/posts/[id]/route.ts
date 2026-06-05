import { NextResponse } from "next/server";
import { getPost, deletePost, listComments } from "@/lib/social-store";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const comments = await listComments(id);
  return NextResponse.json({ post, comments });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const requesterId = searchParams.get("userId") || undefined;
  const ok = await deletePost(id, requesterId);
  if (!ok)
    return NextResponse.json(
      { error: "Cannot delete this post" },
      { status: 403 }
    );
  return NextResponse.json({ ok: true });
}
