"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";
import { Check, Sparkle } from "@phosphor-icons/react";
import Navbar from "../components/Navbar";
import { TIERS, type MembershipTier } from "@/lib/premium-membership";
import { useSocialUser } from "../components/social/useSocialUser";
import SavedCollectionsPanel from "../components/premium/SavedCollectionsPanel";

export default function PremiumPage() {
  const { id } = useSocialUser();
  const [current, setCurrent] = useState<MembershipTier>("free");
  const [busy, setBusy] = useState<MembershipTier | null>(null);

  const loadMembership = useCallback(async () => {
    try {
      const res = await fetch(`/api/premium?user=${id}`);
      const data = await res.json();
      setCurrent(data.membership?.tier || "free");
    } catch {
      /* keep free */
    }
  }, [id]);

  useEffect(() => {
    loadMembership();
  }, [loadMembership]);

  const subscribe = async (tier: MembershipTier) => {
    setBusy(tier);
    try {
      const res = await fetch("/api/premium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: id, tier }),
      });
      const data = await res.json();
      if (res.ok) setCurrent(data.membership.tier);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="min-h-[100dvh]">
      <Navbar />
      <main className="mx-auto max-w-[1040px] px-5 py-10">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold" style={{ background: "color-mix(in srgb, var(--brand) 14%, transparent)", color: "var(--brand)" }}>
            <Sparkle size={14} weight="fill" /> StayNest Membership
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Travel better with StayNest+</h1>
          <p className="mx-auto mt-2 max-w-xl text-[var(--text-dim)]">
            Unlock member pricing, priority support, and tools that help hosts grow. Cancel anytime.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {TIERS.map((tier, i) => {
            const isCurrent = current === tier.id;
            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className={
                  "relative flex flex-col rounded-2xl border p-6 " +
                  (tier.highlight
                    ? "border-[var(--brand)] bg-[var(--surface)] shadow-lg"
                    : "border-[var(--border)] bg-[var(--surface)]")
                }
              >
                {tier.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--brand)] px-3 py-1 text-xs font-semibold text-white">
                    Most popular
                  </span>
                )}
                <h2 className="text-lg font-bold">{tier.name}</h2>
                <p className="mt-1 min-h-[40px] text-sm text-[var(--text-dim)]">{tier.tagline}</p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold tabular-nums">${tier.price}</span>
                  <span className="text-sm text-[var(--text-dim)]">/mo</span>
                </div>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2 text-sm">
                      <Check size={18} weight="bold" style={{ color: "var(--brand)" }} className="mt-0.5 shrink-0" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => subscribe(tier.id)}
                  disabled={isCurrent || busy === tier.id}
                  className={
                    "mt-6 rounded-full px-5 py-2.5 text-sm font-semibold transition " +
                    (isCurrent
                      ? "cursor-default border border-[var(--border)] text-[var(--text-dim)]"
                      : tier.highlight || tier.id === "host_pro"
                      ? "bg-[var(--brand)] text-white hover:bg-[var(--brand-dark)]"
                      : "border border-[var(--border)] hover:bg-[var(--muted)]")
                  }
                >
                  {isCurrent ? "Current plan" : busy === tier.id ? "Processing…" : tier.price === 0 ? "Downgrade" : "Subscribe"}
                </button>
              </motion.div>
            );
          })}
        </div>

        <div className="mx-auto mt-10 max-w-[680px]">
          <SavedCollectionsPanel unlocked={current === "plus" || current === "host_pro"} />
        </div>
      </main>
    </div>
  );
}
