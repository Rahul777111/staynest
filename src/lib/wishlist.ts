"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "@/lib/toast";

// A stable per-browser device id so wishlists persist in Supabase across sessions
// without requiring auth. Mirrors how a logged-out Airbnb-style favourites list works.
const DEVICE_KEY = "staynest.device.v1";

export function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  let id = "";
  try {
    id = localStorage.getItem(DEVICE_KEY) || "";
    if (!id) {
      id = "dev-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(DEVICE_KEY, id);
    }
  } catch {
    id = "dev-anon";
  }
  return id;
}

export function useWishlist() {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  const load = useCallback(async () => {
    const device = getDeviceId();
    if (!device) return;
    try {
      const res = await fetch(`/api/wishlist?device=${encodeURIComponent(device)}`);
      const json = await res.json();
      setIds(json.ids || []);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = useCallback(
    async (listingId: string) => {
      const device = getDeviceId();
      const has = ids.includes(listingId);
      // optimistic update
      setIds((prev) =>
        has ? prev.filter((x) => x !== listingId) : [...prev, listingId]
      );
      toast(has ? "Removed from wishlist" : "Saved to wishlist", "success");
      try {
        await fetch("/api/wishlist", {
          method: has ? "DELETE" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ device, listingId }),
        });
      } catch {
        // revert on failure
        setIds((prev) =>
          has ? [...prev, listingId] : prev.filter((x) => x !== listingId)
        );
      }
    },
    [ids]
  );

  return { ids, ready, toggle, reload: load };
}
