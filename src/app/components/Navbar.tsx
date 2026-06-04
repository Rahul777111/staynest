"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HouseLine,
  SuitcaseRolling,
  Heart,
  ChartLineUp,
  GithubLogo,
} from "@phosphor-icons/react";

const LINKS = [
  { href: "/", label: "Stays", icon: HouseLine },
  { href: "/experiences", label: "Experiences", icon: SuitcaseRolling },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/host", label: "Host", icon: ChartLineUp },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5">
        <Link
          href="/"
          className="flex items-center gap-2 text-[var(--brand)]"
        >
          <HouseLine size={26} weight="fill" />
          <span className="text-xl font-bold tracking-tight">StayNest</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const Icon = l.icon;
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition hover:bg-[var(--muted)] ${
                  active ? "text-[var(--brand)]" : "text-[var(--text)]"
                }`}
              >
                <Icon size={17} weight={active ? "fill" : "regular"} /> {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/trips"
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--muted)] md:hidden"
          >
            <SuitcaseRolling size={18} /> Trips
          </Link>
          <a
            href="https://github.com/Rahul777111"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3.5 py-2 text-sm font-medium transition hover:shadow-md"
          >
            <GithubLogo size={18} weight="fill" />
            <span className="hidden sm:inline">Rahul777111</span>
          </a>
        </div>
      </div>
    </header>
  );
}
