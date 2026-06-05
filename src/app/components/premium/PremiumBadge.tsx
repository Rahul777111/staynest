"use client";

import { SealCheck } from "@phosphor-icons/react";

// Small verified-member / premium badge. Use next to host names or on listings.
export default function PremiumBadge({
  label = "StayNest+",
  size = 14,
}: {
  label?: string;
  size?: number;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold"
      style={{
        background: "color-mix(in srgb, var(--brand) 14%, transparent)",
        color: "var(--brand)",
      }}
    >
      <SealCheck size={size} weight="fill" />
      {label}
    </span>
  );
}
