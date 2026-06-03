"use client";

import Link from "next/link";
import { HouseLine, SuitcaseRolling, GithubLogo } from "@phosphor-icons/react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2 text-[var(--brand)]">
          <HouseLine size={26} weight="fill" />
          <span className="text-xl font-bold tracking-tight">StayNest</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/trips"
            className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--muted)]"
          >
            <SuitcaseRolling size={18} /> My Trips
          </Link>
          <a
            href="https://github.com/Rahul777111"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium transition hover:shadow-md"
          >
            <GithubLogo size={18} weight="fill" /> Rahul777111
          </a>
        </nav>
      </div>
    </header>
  );
}
