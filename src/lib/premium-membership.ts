// StayNest+ premium membership data layer.
//
// Mirrors the social-store pattern: Supabase when configured, otherwise a
// process-wide in-memory mock. Never throws on missing config.

import { supabase, hasSupabase } from "./supabase";

export type MembershipTier = "free" | "plus" | "host_pro";

export type Membership = {
  user_id: string;
  tier: MembershipTier;
  since: string | null; // ISO date when upgraded
};

export type TierInfo = {
  id: MembershipTier;
  name: string;
  price: number; // monthly USD
  tagline: string;
  perks: string[];
  highlight?: boolean;
};

export const TIERS: TierInfo[] = [
  {
    id: "free",
    name: "Explorer",
    price: 0,
    tagline: "Everything you need to book your next stay.",
    perks: [
      "Unlimited search & booking",
      "Save listings to your wishlist",
      "Standard guest support",
    ],
  },
  {
    id: "plus",
    name: "StayNest+",
    price: 12,
    tagline: "Perks, priority, and the social side of travel.",
    highlight: true,
    perks: [
      "Member-only nightly discounts",
      "Priority 24/7 concierge support",
      "Unlimited Saved Collections",
      "Verified member badge on your profile",
      "Early access to new listings",
    ],
  },
  {
    id: "host_pro",
    name: "Host Pro",
    price: 29,
    tagline: "Grow your hosting business with data.",
    perks: [
      "Everything in StayNest+",
      "Host analytics dashboard",
      "Premium listing badge & boosted placement",
      "Performance insights & revenue trends",
      "Dedicated host success manager",
    ],
  },
];

export function tierInfo(tier: MembershipTier): TierInfo {
  return TIERS.find((t) => t.id === tier) || TIERS[0];
}

// In-memory mock store -------------------------------------------------------

type MemDB = { memberships: Record<string, Membership> };
const g = globalThis as unknown as { __staynest_premium?: MemDB };
function db(): MemDB {
  if (!g.__staynest_premium) g.__staynest_premium = { memberships: {} };
  return g.__staynest_premium;
}

export async function getMembership(userId: string): Promise<Membership> {
  if (!userId) return { user_id: "", tier: "free", since: null };
  if (hasSupabase) {
    const { data } = await supabase
      .from("premium_memberships")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (data) return data as Membership;
    return { user_id: userId, tier: "free", since: null };
  }
  return db().memberships[userId] || { user_id: userId, tier: "free", since: null };
}

export async function setMembership(
  userId: string,
  tier: MembershipTier
): Promise<Membership> {
  const membership: Membership = {
    user_id: userId,
    tier,
    since: tier === "free" ? null : new Date().toISOString(),
  };
  if (hasSupabase) {
    await supabase
      .from("premium_memberships")
      .upsert(membership, { onConflict: "user_id" });
    return membership;
  }
  db().memberships[userId] = membership;
  return membership;
}

export function isPremium(tier: MembershipTier): boolean {
  return tier === "plus" || tier === "host_pro";
}

export function hasHostPro(tier: MembershipTier): boolean {
  return tier === "host_pro";
}

// Host analytics (mock, deterministic so charts are stable) ------------------

export type AnalyticsListing = {
  id: string;
  title: string;
  views: number;
  bookings: number;
  revenue: number;
  rating: number;
  occupancy: number; // 0..1
};

export type HostAnalytics = {
  kpis: { views: number; bookings: number; revenue: number; rating: number };
  revenueByMonth: { month: string; revenue: number }[];
  bookingsByMonth: { month: string; bookings: number }[];
  listings: AnalyticsListing[];
};

export async function getHostAnalytics(): Promise<HostAnalytics> {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const revenueByMonth = [4200, 5100, 4800, 6300, 7400, 8600].map((revenue, i) => ({
    month: months[i],
    revenue,
  }));
  const bookingsByMonth = [9, 12, 11, 15, 18, 21].map((bookings, i) => ({
    month: months[i],
    bookings,
  }));
  const listings: AnalyticsListing[] = [
    { id: "villa-amalfi", title: "Cliffside Villa, Amalfi Coast", views: 4820, bookings: 38, revenue: 21400, rating: 4.95, occupancy: 0.86 },
    { id: "cave-santorini", title: "Cave House, Oia · Santorini", views: 3910, bookings: 31, revenue: 17850, rating: 4.91, occupancy: 0.79 },
    { id: "cabin-aspen", title: "Pine Cabin, Aspen", views: 2640, bookings: 22, revenue: 12300, rating: 4.88, occupancy: 0.68 },
    { id: "desert-joshuatree", title: "Desert House, Joshua Tree", views: 2180, bookings: 17, revenue: 8900, rating: 4.82, occupancy: 0.61 },
    { id: "loft-tokyo", title: "Minimal Loft, Tokyo", views: 1750, bookings: 14, revenue: 6400, rating: 4.79, occupancy: 0.57 },
  ];
  const kpis = {
    views: listings.reduce((s, l) => s + l.views, 0),
    bookings: listings.reduce((s, l) => s + l.bookings, 0),
    revenue: listings.reduce((s, l) => s + l.revenue, 0),
    rating:
      Math.round(
        (listings.reduce((s, l) => s + l.rating, 0) / listings.length) * 100
      ) / 100,
  };
  return { kpis, revenueByMonth, bookingsByMonth, listings };
}
