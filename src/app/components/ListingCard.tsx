"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { Star, Heart, CaretLeft, CaretRight } from "@phosphor-icons/react";
import type { Listing } from "@/lib/listings";

export default function ListingCard({ listing, index = 0 }: { listing: Listing; index?: number }) {
  const [img, setImg] = useState(0);
  const [liked, setLiked] = useState(false);

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    setImg((i) => (i - 1 + listing.images.length) % listing.images.length);
  };
  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    setImg((i) => (i + 1) % listing.images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/listing/${listing.id}`} className="group block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--muted)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={listing.images[img]}
            alt={listing.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              setLiked((l) => !l);
            }}
            className="absolute right-3 top-3 grid h-8 w-8 place-items-center"
            aria-label="Save"
          >
            <Heart
              size={26}
              weight={liked ? "fill" : "regular"}
              className="drop-shadow"
              color={liked ? "#ff385c" : "rgba(255,255,255,0.92)"}
            />
          </button>
          {listing.superhost && (
            <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[var(--text)] shadow">
              Superhost
            </span>
          )}
          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between opacity-0 transition group-hover:opacity-100">
            <button onClick={prev} className="grid h-7 w-7 place-items-center rounded-full bg-white/90 shadow">
              <CaretLeft size={14} weight="bold" />
            </button>
            <button onClick={next} className="grid h-7 w-7 place-items-center rounded-full bg-white/90 shadow">
              <CaretRight size={14} weight="bold" />
            </button>
          </div>
        </div>

        <div className="mt-2.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-[var(--text)]">{listing.location}</h3>
            <span className="flex items-center gap-1 text-sm">
              <Star size={13} weight="fill" color="var(--star)" /> {listing.rating}
            </span>
          </div>
          <p className="line-clamp-1 text-sm text-[var(--text-dim)]">{listing.title}</p>
          <p className="text-sm text-[var(--text-dim)]">{listing.country}</p>
          <p className="mt-1 text-sm">
            <span className="font-semibold text-[var(--text)]">${listing.price}</span>
            <span className="text-[var(--text-dim)]"> night</span>
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
