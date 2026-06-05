"use client";

import { UsersThree } from "@phosphor-icons/react";
import Navbar from "../components/Navbar";
import FeedList from "../components/social/FeedList";

export default function FeedPage() {
  return (
    <div className="min-h-[100dvh]">
      <Navbar />
      <main className="mx-auto max-w-[680px] px-5 py-8">
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <UsersThree size={26} weight="fill" className="text-[var(--brand)]" /> Community Feed
        </h1>
        <p className="mt-1 text-sm text-[var(--text-dim)]">
          Stories, photos, and recommendations from hosts and travelers.
        </p>
        <div className="mt-6">
          <FeedList />
        </div>
      </main>
    </div>
  );
}
