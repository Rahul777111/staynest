"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useSocialUser } from "./useSocialUser";

export default function FollowButton({
  targetId,
  initialFollowing,
  onChange,
}: {
  targetId: string;
  initialFollowing: boolean;
  onChange?: (following: boolean, followerCount: number) => void;
}) {
  const { id, name } = useSocialUser();
  const [following, setFollowing] = useState(initialFollowing);
  const [busy, setBusy] = useState(false);
  const self = id === targetId;

  if (self) return null;

  const toggle = async () => {
    if (busy) return;
    const next = !following;
    setFollowing(next); // optimistic
    setBusy(true);
    try {
      const res = await fetch("/api/social/follows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          follower_id: id,
          followee_id: targetId,
          follow: next,
          follower_name: name,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFollowing(!next); // revert
      } else {
        onChange?.(data.following, data.follower_count);
      }
    } catch {
      setFollowing(!next);
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={toggle}
      disabled={busy}
      className={
        "rounded-full px-5 py-2 text-sm font-semibold transition disabled:opacity-60 " +
        (following
          ? "border border-[var(--border)] bg-transparent text-[var(--text)] hover:bg-[var(--muted)]"
          : "bg-[var(--brand)] text-white hover:brightness-95")
      }
    >
      {following ? "Following" : "Follow"}
    </motion.button>
  );
}
