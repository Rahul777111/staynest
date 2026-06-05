"use client";

import { BellRinging } from "@phosphor-icons/react";
import Navbar from "../components/Navbar";
import NotificationsPanel from "../components/social/NotificationsPanel";

export default function NotificationsPage() {
  return (
    <div className="min-h-[100dvh]">
      <Navbar />
      <main className="mx-auto max-w-[680px] px-5 py-8">
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <BellRinging size={26} weight="fill" className="text-[var(--brand)]" /> Notifications
        </h1>
        <p className="mt-1 text-sm text-[var(--text-dim)]">
          Likes, comments, and new followers across your activity.
        </p>
        <div className="mt-6">
          <NotificationsPanel />
        </div>
      </main>
    </div>
  );
}
