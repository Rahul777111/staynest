"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { BookmarkSimple, LockSimple } from "@phosphor-icons/react";

// Saved Collections upgrade teaser. For non-members it shows a locked upsell;
// for members it shows their (mock) collections. Self-contained and importable.
const DEMO_COLLECTIONS = [
  { name: "Beachfront escapes", count: 8 },
  { name: "Cabins & cozy", count: 5 },
  { name: "City lofts", count: 11 },
];

export default function SavedCollectionsPanel({ unlocked = false }: { unlocked?: boolean }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold">
          <BookmarkSimple size={18} weight="fill" style={{ color: "var(--brand)" }} />
          Saved Collections
        </h3>
        {!unlocked && <LockSimple size={16} className="text-[var(--text-dim)]" />}
      </div>

      {unlocked ? (
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {DEMO_COLLECTIONS.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3"
            >
              <p className="text-sm font-medium">{c.name}</p>
              <p className="text-xs text-[var(--text-dim)]">{c.count} saved</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="mt-3">
          <p className="text-sm text-[var(--text-dim)]">
            Organize your wishlist into unlimited themed collections with StayNest+.
          </p>
          <Link
            href="/premium"
            className="mt-3 inline-block rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--brand-dark)]"
          >
            Upgrade to unlock
          </Link>
        </div>
      )}
    </div>
  );
}
