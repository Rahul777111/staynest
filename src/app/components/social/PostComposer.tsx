"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ImageSquare, X } from "@phosphor-icons/react";
import type { Post } from "@/lib/social-types";
import { useSocialUser } from "./useSocialUser";
import Avatar from "./Avatar";

export default function PostComposer({ onPosted }: { onPosted?: (post: Post) => void }) {
  const { id, name } = useSocialUser();
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showImage, setShowImage] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !imageUrl.trim()) return;
    setBusy(true);
    try {
      const res = await fetch("/api/social/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author_id: id,
          author_name: name,
          text: text.trim(),
          image_url: imageUrl.trim() || null,
        }),
      });
      const data = await res.json();
      if (res.ok && data.post) {
        onPosted?.(data.post);
        setText("");
        setImageUrl("");
        setShowImage(false);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
    >
      <div className="flex gap-3">
        <Avatar name={name} />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share a moment from your stays…"
          rows={2}
          className="min-h-[44px] flex-1 resize-none bg-transparent text-[15px] outline-none placeholder:text-[var(--text-muted,#888)]"
        />
      </div>

      {showImage && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 flex items-center gap-2"
        >
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Paste an image URL…"
            className="flex-1 rounded-full border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm outline-none focus:border-[var(--brand)]"
          />
          <button type="button" onClick={() => { setShowImage(false); setImageUrl(""); }} className="text-[var(--text-muted,#888)]">
            <X size={18} />
          </button>
        </motion.div>
      )}

      {imageUrl && (
        <div className="mt-2 overflow-hidden rounded-xl bg-[var(--muted)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="" className="max-h-64 w-full object-cover" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
        </div>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-3">
        <button
          type="button"
          onClick={() => setShowImage((s) => !s)}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium hover:bg-[var(--muted)]"
        >
          <ImageSquare size={18} style={{ color: "var(--brand)" }} />
          Photo
        </button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          type="submit"
          disabled={busy || (!text.trim() && !imageUrl.trim())}
          className="rounded-full bg-[var(--brand)] px-5 py-2 text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-50"
        >
          {busy ? "Posting…" : "Post"}
        </motion.button>
      </div>
    </form>
  );
}
