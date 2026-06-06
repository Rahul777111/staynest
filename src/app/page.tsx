"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import {
  MagnifyingGlass,
  Users,
  CurrencyDollar,
  ArrowsDownUp,
  Faders,
  MapTrifold,
  SquaresFour,
} from "@phosphor-icons/react";
import Navbar from "./components/Navbar";
import ListingCard from "./components/ListingCard";
import CategoryRail from "./components/CategoryRail";
import FiltersModal, {
  EMPTY_FILTERS,
  countActive,
  type Filters,
} from "./components/FiltersModal";
import { useWishlist } from "@/lib/wishlist";
import { useUserListings } from "@/lib/userListings";
import { DestinationStrip, InspirationGallery } from "./components/DiscoverSections";
import LandingHero from "./components/LandingHero";
import type { Listing } from "@/lib/listings";

const MapView = dynamic(() => import("./components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-[640px] animate-pulse rounded-2xl bg-[var(--muted)]" />
  ),
});

function userMatches(
  l: Listing,
  o: {
    q: string;
    category: string;
    guests: number;
    sort: string;
    filters: Filters;
  }
) {
  const q = o.q.toLowerCase().trim();
  if (
    q &&
    !(
      l.location.toLowerCase().includes(q) ||
      l.country.toLowerCase().includes(q) ||
      l.title.toLowerCase().includes(q) ||
      l.type.toLowerCase().includes(q)
    )
  )
    return false;
  if (o.category && o.category !== "all" && l.category !== o.category) return false;
  if (o.guests > 0 && l.guests < o.guests) return false;
  const f = o.filters;
  if (f.minPrice > 0 && l.price < f.minPrice) return false;
  if (f.maxPrice > 0 && l.price > f.maxPrice) return false;
  if (f.bedrooms > 0 && l.bedrooms < f.bedrooms) return false;
  if (f.superhost && !l.superhost) return false;
  if (f.amenities.length) {
    const have = l.amenities.map((a) => a.toLowerCase());
    if (!f.amenities.every((a) => have.some((h) => h.includes(a.toLowerCase()))))
      return false;
  }
  return true;
}

export default function Home() {
  const [seedResults, setSeedResults] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [guests, setGuests] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [sort, setSort] = useState("recommended");
  const [category, setCategory] = useState("all");
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<"grid" | "map">("grid");

  const { ids, toggle } = useWishlist();
  const { listings: userListings } = useUserListings();

  const search = useCallback(
    async (cat = category, f: Filters = filters) => {
      setLoading(true);
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (guests) params.set("guests", String(guests));
      if (maxPrice) params.set("maxPrice", String(maxPrice));
      if (f.minPrice) params.set("minPrice", String(f.minPrice));
      if (f.maxPrice) params.set("maxPrice", String(f.maxPrice));
      if (f.bedrooms) params.set("bedrooms", String(f.bedrooms));
      if (f.superhost) params.set("superhost", "1");
      if (f.amenities.length) params.set("amenities", f.amenities.join(","));
      if (sort && sort !== "recommended") params.set("sort", sort);
      if (cat && cat !== "all") params.set("category", cat);
      const res = await fetch(`/api/listings?${params}`);
      const json = await res.json();
      setSeedResults(json.listings || []);
      setLoading(false);
    },
    [q, guests, maxPrice, sort, category, filters]
  );

  useEffect(() => {
    search("all", EMPTY_FILTERS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Merge host-created (local) listings, filtered by the same criteria.
  const listings = useMemo(() => {
    const matchedUser = userListings.filter((l) =>
      userMatches(l, { q, category, guests, sort, filters })
    );
    let merged = [...matchedUser, ...seedResults];
    if (sort === "price_low") merged = merged.slice().sort((a, b) => a.price - b.price);
    else if (sort === "price_high")
      merged = merged.slice().sort((a, b) => b.price - a.price);
    else if (sort === "rating")
      merged = merged.slice().sort((a, b) => b.rating - a.rating);
    return merged;
  }, [userListings, seedResults, q, category, guests, sort, filters]);

  const onCategory = (id: string) => {
    setCategory(id);
    search(id);
  };

  const activeFilterCount = countActive(filters);

  return (
    <div className="min-h-[100dvh]">
      <Navbar />

      <LandingHero
        onSearch={() => {
          document
            .getElementById("search")
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
        }}
      />

      {/* search hero */}
      <section id="search" className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 -z-10 bg-[var(--bg)]" />
        <div className="absolute inset-0 -z-10 opacity-60" style={{ background: "radial-gradient(70% 60% at 15% 0%, color-mix(in srgb, var(--brand) 14%, transparent), transparent 70%)" }} />
        <div className="mx-auto max-w-[1200px] px-5 py-12 sm:py-16">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl"
          >
            Find a place you will{" "}
            <span className="text-[var(--brand)]">never want to leave.</span>
          </motion.h2>
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
            className="mt-7 flex flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-lg sm:flex-row sm:items-center sm:rounded-full"
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
            <div className="flex items-center gap-2 border-t border-[var(--border)] px-3 py-2 sm:border-l sm:border-t-0">
              <ArrowsDownUp size={18} className="text-[var(--text-dim)]" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent text-sm outline-none"
              >
                <option value="recommended">Recommended</option>
                <option value="recent">Recently added</option>
                <option value="price_low">Price: low to high</option>
                <option value="price_high">Price: high to low</option>
                <option value="rating">Top rated</option>
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
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[var(--text-dim)]">
            {loading ? "Searching..." : `${listings.length} stays available`}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(true)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition hover:border-[var(--text)] ${
                activeFilterCount
                  ? "border-[var(--text)]"
                  : "border-[var(--border)]"
              }`}
            >
              <Faders size={16} weight="bold" />
              Filters
              {activeFilterCount > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[var(--brand)] px-1 text-xs font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="flex items-center rounded-full border border-[var(--border)] p-0.5">
              <button
                onClick={() => setView("grid")}
                aria-label="Grid view"
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  view === "grid"
                    ? "bg-[var(--text)] text-[var(--surface)]"
                    : "text-[var(--text)] hover:bg-[var(--muted)]"
                }`}
              >
                <SquaresFour size={16} weight="fill" /> Grid
              </button>
              <button
                onClick={() => setView("map")}
                aria-label="Map view"
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  view === "map"
                    ? "bg-[var(--text)] text-[var(--surface)]"
                    : "text-[var(--text)] hover:bg-[var(--muted)]"
                }`}
              >
                <MapTrifold size={16} weight="fill" /> Map
              </button>
            </div>
          </div>
        </div>

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
        ) : view === "map" ? (
          <MapView listings={listings} likedIds={ids} />
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

      <FiltersModal
        open={showFilters}
        initial={filters}
        onClose={() => setShowFilters(false)}
        onApply={(f) => {
          setFilters(f);
          search(category, f);
        }}
      />

      <DestinationStrip
        onPick={(city) => {
          setQ(city);
          search();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
      <InspirationGallery />

      <footer className="border-t border-[var(--border)] bg-[var(--muted)]">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-5 py-6 text-sm text-[var(--text-dim)]">
          <span>Built by D L Narayana</span>
          <span>Next.js · Supabase · Motion</span>
        </div>
      </footer>
    </div>
  );
}
