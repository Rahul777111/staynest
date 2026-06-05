"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Heart, ChatCircle, MapPin } from "@phosphor-icons/react";
import type { FeedItem, Comment } from "@/lib/social-types";
import { useSocialUser } from "./useSocialUser";
import Avatar from "./Avatar";

function timeAgo(iso: string) {
  const diff = Date.now() - +new Date(iso);
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.round(h / 24);
  return `${d}d`;
}

export default function PostCard({ post, index = 0 }: { post: FeedItem; index?: number }) {
  const { id: viewerId, name: viewerName } = useSocialUser();
  const [liked, setLiked] = useState(post.liked_by_me);
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [commentCount, setCommentCount] = useState(post.comment_count);
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [draft, setDraft] = useState("");

  const toggleLike = async () => {
    const next = !liked;
    setLiked(next);
    setLikeCount((c) => c + (next ? 1 : -1)); // optimistic
    try {
      const res = await fetch("/api/social/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: post.id, user_id: viewerId, liked: next, actor_name: viewerName }),
      });
      const data = await res.json();
      if (res.ok && typeof data.like_count === "number") setLikeCount(data.like_count);
      else if (!res.ok) { setLiked(!next); setLikeCount((c) => c + (next ? -1 : 1)); }
    } catch {
      setLiked(!next);
      setLikeCount((c) => c + (next ? -1 : 1));
    }
  };

  const openComments = async () => {
    const next = !open;
    setOpen(next);
    if (next && comments.length === 0) {
      setLoadingComments(true);
      try {
        const res = await fetch(`/api/social/comments?post=${post.id}`);
        const data = await res.json();
        setComments(data.comments || []);
      } catch {
        /* keep empty */
      } finally {
        setLoadingComments(false);
      }
    }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    const optimistic: Comment = {
      id: `tmp-${Date.now()}`,
      post_id: post.id,
      author_id: viewerId,
      author_name: viewerName,
      text,
      created_at: new Date().toISOString(),
    };
    setComments((c) => [...c, optimistic]);
    setCommentCount((c) => c + 1);
    try {
      const res = await fetch("/api/social/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: post.id, author_id: viewerId, author_name: viewerName, text }),
      });
      const data = await res.json();
      if (res.ok && data.comment)
        setComments((c) => c.map((x) => (x.id === optimistic.id ? data.comment : x)));
    } catch {
      /* leave optimistic */
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5"
    >
      <header className="flex items-center gap-3">
        <Link href={`/profile/${post.author_id}`} className="shrink-0">
          <Avatar name={post.author_name} src={post.author_avatar} />
        </Link>
        <div className="min-w-0">
          <Link href={`/profile/${post.author_id}`} className="block truncate font-semibold hover:underline">
            {post.author_name}
          </Link>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted,#888)]">
            <span>{timeAgo(post.created_at)} ago</span>
            {post.reason === "popular" && (
              <span className="rounded-full bg-[var(--muted)] px-2 py-0.5">Popular</span>
            )}
          </div>
        </div>
      </header>

      {post.text && <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed">{post.text}</p>}

      {post.image_url && (
        <div className="mt-3 overflow-hidden rounded-xl bg-[var(--muted)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.image_url} alt="" className="max-h-[440px] w-full object-cover" />
        </div>
      )}

      {post.listing_id && (
        <Link
          href={`/listing/${post.listing_id}`}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium hover:bg-[var(--muted)]"
        >
          <MapPin size={14} weight="fill" style={{ color: "var(--brand)" }} />
          View listing
        </Link>
      )}

      <div className="mt-4 flex items-center gap-5 text-sm">
        <button onClick={toggleLike} className="flex items-center gap-1.5 transition hover:opacity-80" aria-pressed={liked}>
          <motion.span animate={{ scale: liked ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.3 }}>
            <Heart size={20} weight={liked ? "fill" : "regular"} style={{ color: liked ? "var(--brand)" : "currentColor" }} />
          </motion.span>
          <span className="tabular-nums">{likeCount}</span>
        </button>
        <button onClick={openComments} className="flex items-center gap-1.5 transition hover:opacity-80">
          <ChatCircle size={20} />
          <span className="tabular-nums">{commentCount}</span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-3 border-t border-[var(--border)] pt-4">
              {loadingComments && <p className="text-sm text-[var(--text-muted,#888)]">Loading comments…</p>}
              {!loadingComments && comments.length === 0 && (
                <p className="text-sm text-[var(--text-muted,#888)]">No comments yet. Start the conversation.</p>
              )}
              {comments.map((c) => (
                <div key={c.id} className="flex gap-2.5">
                  <Avatar name={c.author_name} src={c.author_avatar} size={28} />
                  <div className="rounded-2xl bg-[var(--muted)] px-3 py-2">
                    <span className="text-sm font-semibold">{c.author_name}</span>
                    <p className="text-sm">{c.text}</p>
                  </div>
                </div>
              ))}
              <form onSubmit={submitComment} className="flex gap-2 pt-1">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Write a comment…"
                  className="flex-1 rounded-full border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm outline-none focus:border-[var(--brand)]"
                />
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Post
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
