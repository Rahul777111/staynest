import { NextResponse } from "next/server";
import { listNotifications, markNotificationsRead } from "@/lib/social-store";

export const dynamic = "force-dynamic";

// GET /api/social/notifications?user=<id> -> { notifications, unread }
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const user = searchParams.get("user") || "";
  const notifications = await listNotifications(user);
  const unread = notifications.filter((n) => !n.read).length;
  return NextResponse.json({ notifications, unread });
}

// POST { user_id } -> mark all read
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const user_id = (body.user_id || "").toString().trim();
  if (!user_id) return NextResponse.json({ error: "Missing user" }, { status: 400 });
  await markNotificationsRead(user_id);
  return NextResponse.json({ ok: true });
}
