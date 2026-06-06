"use client";

import { useState, useEffect } from "react";
import type { Listing } from "@/lib/listings";

// Track recently viewed listings client-side so the home page can show a
// personalised "Recently viewed" strip. We store a snapshot of each listing
// so it works for both seed and host-created listings without extra fetches.
const KEY = "staynest.recentlyViewed.v1";
const MAX = 10;

export function recordView(listing: Listing) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    const list: Listing[] = raw ? JSON.parse(raw) : [];
    const next = [listing, ...list.filter((x) => x.id !== listing.id)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function useRecentlyViewed(excludeId?: string) {
  const [items, setItems] = useState<Listing[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const list: Listing[] = raw ? JSON.parse(raw) : [];
      setItems(excludeId ? list.filter((x) => x.id !== excludeId) : list);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, [excludeId]);

  return { items, ready };
}
