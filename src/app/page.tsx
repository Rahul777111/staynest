"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { MagnifyingGlass, Users, CurrencyDollar } from "@phosphor-icons/react";
import Navbar from "./components/Navbar";
import ListingCard from "./components/ListingCard";
import CategoryRail from "./components/CategoryRail";
import { useWishlist } from "@/lib/wishlist";
import type { Listing } from "@/lib/listings";

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [guests, setGuests] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [category, setCategory] = useState("all");
  const { ids, toggle } = useWishlist();

  const search = useCallback(
    async (cat = category) => {
      setLoading(true);
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (guests) params.set("guests", String(guests));
      if (maxPrice) params.set("maxPrice", String(maxPrice));
      if (cat && cat !== "all") params.set("category", cat);
      const res = await fetch(`/api/listings?${params}`);
      const json = await res.json();
      setListings(json.listings || []);
      setLoading(false);
    },
    [q, guests, maxPrice, category]
  );

  useEffect(() => {
    search("all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCategory = (id: string) => {
    setCategory(id);
    search(id);
  };

  return (
    <div className="min-h-[100dvh]">
      <Navbar />

      {/* hero */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#fff1f4] via-white to-[#fff7f0]" />
        <div className="mx-auto max-w-[1200px] px-5 py-12 sm:py-16">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl"
          >
            Find a place you will{" "}
            <span className="text-[var(--brand)]">never want to leave.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-3 max-w-xl text-[var(--text-dim)]"
          >
            Villas, cabins, lofts and treehouses across the world. Search, pick
            your dates, and book in seconds.
          </motion.p>

          {/* search bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mt-7 flex flex-col gap-2 rounded-2xl border border-[var(--border)] bg-white p-2 shadow-lg sm:flex-row sm:items-center sm:rounded-full"
          >
            <div className="flex flex-1 items-center gap-2 px-3 py-2">
              <MagnifyingGlass size={18} className="text-[var(--text-dim)]" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search()}
                placeholder="Where to? Try Tokyo, Bali, Italy"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--text-dim)]"
              />
            </div>
            <div className="flex items-center gap-2 border-t border-[var(--border)] px-3 py-2 sm:border-l sm:border-t-0">
              <Users size={18} className="text-[var(--text-dim)]" />
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="bg-transparent text-sm outline-none"
              >
                <option value={0}>Any guests</option>
                {[1, 2, 3, 4, 5, 6, 8, 10].map((g) => (
                  <option key={g} value={g}>
                    {g}+ guests
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 border-t border-[var(--border)] px-3 py-2 sm:border-l sm:border-t-0">
              <CurrencyDollar size={18} className="text-[var(--text-dim)]" />
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="bg-transparent text-sm outline-none"
              >
                <option value={0}>Any price</option>
                {[100, 150, 250, 350, 500, 900].map((p) => (
                  <option key={p} value={p}>
                    Up to ${p}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => search()}
              className="rounded-full bg-[var(--brand)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--brand-dark)] active:scale-[0.98]"
            >
              Search
            </button>
          </motion.div>
        </div>
      </section>

      {/* category rail */}
      <div className="mx-auto max-w-[1200px] px-5">
        <CategoryRail active={category} onChange={onCategory} />
      </div>

      {/* results */}
      <main className="mx-auto max-w-[1200px] px-5 py-8">
        <p className="mb-5 text-sm text-[var(--text-dim)]">
          {loading ? "Searching..." : `${listings.length} stays available`}
        </p>
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] rounded-2xl bg-[var(--muted)]" />
                <div className="mt-3 h-4 w-2/3 rounded bg-[var(--muted)]" />
                <div className="mt-2 h-3 w-1/2 rounded bg-[var(--muted)]" />
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] py-20 text-center text-[var(--text-dim)]">
            No stays match your search. Try a different place or relax the
            filters.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((l, i) => (
              <ListingCard
                key={l.id}
                listing={l}
                index={i}
                liked={ids.includes(l.id)}
                onToggle={toggle}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-[var(--border)] bg-[var(--muted)]">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-5 py-6 text-sm text-[var(--text-dim)]">
          <span>Built by D L Narayana</span>
          <span>Next.js · Supabase · Motion</span>
        </div>
      </footer>
    </div>
  );
}
