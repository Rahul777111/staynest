"use client";

import { ShareNetwork } from "@phosphor-icons/react";
import { toast } from "@/lib/toast";

export default function ShareButton({ title }: { title: string }) {
  const onShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    // Use the native share sheet where available (mobile), otherwise copy.
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // user cancelled or unsupported — fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast("Link copied to clipboard", "success");
    } catch {
      toast("Could not copy link", "error");
    }
  };

  return (
    <button
      onClick={onShare}
      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium underline-offset-4 transition hover:bg-[var(--muted)] hover:underline"
    >
      <ShareNetwork size={17} weight="bold" />
      Share
    </button>
  );
}
