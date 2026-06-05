"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Heart, ChatCircle, UserPlus } from "@phosphor-icons/react";
import type { SocialNotification } from "@/lib/social-types";
import { useSocialUser } from "./useSocialUser";
import Avatar from "./Avatar";

function verb(t: SocialNotification["type"]) {
  if (t === "like") return "liked your post";
  if (t === "comment") return "commented on your post";
  return "started following you";
}

function Icon({ t }: { t: SocialNotification["type"] }) {
  const common = { size: 16, weight: "fill" as const };
  if (t === "like") return <Heart {...common} style={{ color: "var(--brand)" }} />;
  if (t === "comment") return <ChatCircle {...common} style={{ color: "#0d6efd" }} />;
  return <UserPlus {...common} style={{ color: "#1a9d63" }} />;
}

function timeAgo(iso: string) {
  const m = Math.round((Date.now() - +new Date(iso)) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

export default function NotificationsPanel() {
  const { id } = useSocialUser();
  const [items, setItems] = useState<SocialNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/social/notifications?user=${id}`);
      const data = await res.json();
      setItems(data.notifications || []);
    } catch {
      /* empty */
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const markAllRead = async () => {
    setItems((list) => list.map((n) => ({ ...n, read: true })));
    try {
      await fetch("/api/social/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: id }),
      });
    } catch {
      /* ignore */
    }
  };

  const unread = items.filter((n) => !n.read).length;

  if (loading) {
    return (
      <div className="space-y-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex animate-pulse items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="h-10 w-10 rounded-full bg-[var(--muted)]" />
            <div className="h-3 w-48 rounded bg-[var(--muted)]" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
        <p className="text-lg font-semibold">You&apos;re all caught up</p>
        <p className="mt-1 text-[var(--text-muted,#888)]">Likes, comments, and new followers will show up here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {unread > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--text-muted,#888)]">{unread} unread</span>
          <button onClick={markAllRead} className="text-sm font-semibold" style={{ color: "var(--brand)" }}>
            Mark all read
          </button>
        </div>
      )}
      {items.map((n, i) => (
        <motion.div
          key={n.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          className={
            "flex items-center gap-3 rounded-xl border p-4 " +
            (n.read
              ? "border-[var(--border)] bg-[var(--surface)]"
              : "border-[var(--brand)] bg-[var(--muted)]")
          }
        >
          <div className="relative">
            <Avatar name={n.actor_name} src={n.actor_avatar} />
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--surface)] ring-1 ring-[var(--border)]">
              <Icon t={n.type} />
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm">
              <Link href={`/profile/${n.actor_id}`} className="font-semibold hover:underline">
                {n.actor_name}
              </Link>{" "}
              {verb(n.type)}
            </p>
            {n.preview && <p className="truncate text-xs text-[var(--text-muted,#888)]">{n.preview}</p>}
          </div>
          <span className="shrink-0 text-xs text-[var(--text-muted,#888)]">{timeAgo(n.created_at)}</span>
        </motion.div>
      ))}
    </div>
  );
}
