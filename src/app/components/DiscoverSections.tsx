"use client";

import { motion } from "motion/react";
import { MapPin } from "@phosphor-icons/react";
import { DESTINATIONS, INSPIRATION, galleryUrl } from "@/lib/gallery";

export function DestinationStrip({ onPick }: { onPick?: (city: string) => void }) {
  return (
    <section className="mx-auto max-w-[1200px] px-5 py-10">
      <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
        Explore by destination
      </h2>
      <p className="mt-1 text-sm text-[var(--text-dim)]">
        Twenty-four cities travellers are loving right now.
      </p>
      <div className="no-scrollbar mt-5 flex gap-4 overflow-x-auto pb-2">
        {DESTINATIONS.map((d, i) => (
          <motion.button
            key={d.city}
            onClick={() => onPick?.(d.city)}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4, delay: (i % 8) * 0.04 }}
            className="group w-40 shrink-0 text-left"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[var(--muted)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={galleryUrl(d.photo, 500)}
                alt={`${d.city}, ${d.country}`}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="flex items-center gap-1 text-sm font-semibold">
                  <MapPin size={13} weight="fill" /> {d.city}
                </p>
                <p className="text-[11px] text-white/85">
                  {d.country} · {d.stays} stays
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

export function InspirationGallery() {
  return (
    <section className="mx-auto max-w-[1200px] px-5 py-10">
      <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
        Get inspired
      </h2>
      <p className="mt-1 text-sm text-[var(--text-dim)]">
        A wall of real places, interiors and views to spark your next trip.
      </p>
      <div className="mt-5 columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3">
        {INSPIRATION.map((p, i) => (
          <motion.div
            key={p}
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: (i % 12) * 0.02 }}
            className="overflow-hidden rounded-2xl bg-[var(--muted)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={galleryUrl(p, 600)}
              alt="Inspiration"
              loading="lazy"
              className="w-full object-cover transition duration-500 hover:scale-[1.03]"
              style={{ aspectRatio: i % 3 === 0 ? "3 / 4" : i % 3 === 1 ? "1 / 1" : "4 / 5" }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
