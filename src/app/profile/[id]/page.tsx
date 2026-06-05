"use client";

import { use, useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";
import type { ProfileSummary, Post, FeedItem } from "@/lib/social-types";
import Navbar from "../../components/Navbar";
import Avatar from "../../components/social/Avatar";
import FollowButton from "../../components/social/FollowButton";
import PostCard from "../../components/social/PostCard";
import { useSocialUser } from "../../components/social/useSocialUser";

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { id: viewerId } = useSocialUser();
  const [profile, setProfile] = useState<ProfileSummary | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [followerCount, setFollowerCount] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, postsRes] = await Promise.all([
        fetch(`/api/social/follows?profile=${id}&viewer=${viewerId}`),
        fetch(`/api/social/posts?authorId=${id}`),
      ]);
      const pData = await pRes.json();
      const postsData = await postsRes.json();
      setProfile(pData.profile);
      setFollowerCount(pData.profile?.follower_count ?? 0);
      setPosts(postsData.posts || []);
    } catch {
      /* empty */
    } finally {
      setLoading(false);
    }
  }, [id, viewerId]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="min-h-[100dvh]">
      <Navbar />
      <main className="mx-auto max-w-[680px] px-5 py-8">
        {loading && (
          <div className="animate-pulse">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-[var(--muted)]" />
              <div className="space-y-2">
                <div className="h-4 w-40 rounded bg-[var(--muted)]" />
                <div className="h-3 w-56 rounded bg-[var(--muted)]" />
              </div>
            </div>
          </div>
        )}

        {!loading && profile && (
          <>
            <motion.header
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <Avatar name={profile.user.name} src={profile.user.avatar} size={80} />
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">{profile.user.name}</h1>
                  {profile.user.bio && (
                    <p className="mt-1 max-w-sm text-sm text-[var(--text-dim)]">{profile.user.bio}</p>
                  )}
                </div>
              </div>
              <FollowButton
                targetId={id}
                initialFollowing={profile.is_following}
                onChange={(_, count) => setFollowerCount(count)}
              />
            </motion.header>

            <div className="mt-6 flex gap-6 border-y border-[var(--border)] py-4 text-sm">
              <span><strong className="tabular-nums">{profile.post_count}</strong> <span className="text-[var(--text-dim)]">posts</span></span>
              <span><strong className="tabular-nums">{followerCount}</strong> <span className="text-[var(--text-dim)]">followers</span></span>
              <span><strong className="tabular-nums">{profile.following_count}</strong> <span className="text-[var(--text-dim)]">following</span></span>
            </div>

            <div className="mt-6 space-y-4">
              {posts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[var(--border)] py-16 text-center text-[var(--text-dim)]">
                  No posts yet.
                </div>
              ) : (
                posts.map((p, i) => (
                  <PostCard
                    key={p.id}
                    index={i}
                    post={{ ...(p as Post), liked_by_me: false, reason: "following" } as FeedItem}
                  />
                ))
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
