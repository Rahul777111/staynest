"use client";

import { useEffect, useState, useCallback } from "react";
import type { FeedItem, Post } from "@/lib/social-types";
import { useSocialUser } from "./useSocialUser";
import PostCard from "./PostCard";
import PostComposer from "./PostComposer";

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-[var(--muted)]" />
        <div className="space-y-2">
          <div className="h-3 w-32 rounded bg-[var(--muted)]" />
          <div className="h-2.5 w-20 rounded bg-[var(--muted)]" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded bg-[var(--muted)]" />
        <div className="h-3 w-4/5 rounded bg-[var(--muted)]" />
      </div>
      <div className="mt-4 h-44 w-full rounded-xl bg-[var(--muted)]" />
    </div>
  );
}

export default function FeedList() {
  const { id } = useSocialUser();
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/social/feed?viewer=${id}`);
      const data = await res.json();
      setFeed(data.feed || []);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const onPosted = (post: Post) => {
    setFeed((f) => [{ ...post, liked_by_me: false, reason: "following" }, ...f]);
  };

  return (
    <div className="space-y-4">
      <PostComposer onPosted={onPosted} />

      {loading && (
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-[var(--text-muted,#888)]">
          Could not load the feed. Please try again.
        </div>
      )}

      {!loading && !error && feed.length === 0 && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
          <p className="text-lg font-semibold">Your feed is quiet</p>
          <p className="mt-1 text-[var(--text-muted,#888)]">
            Follow hosts and travelers, or share the first post above.
          </p>
        </div>
      )}

      {!loading &&
        !error &&
        feed.map((post, i) => <PostCard key={post.id} post={post} index={i} />)}
    </div>
  );
}
