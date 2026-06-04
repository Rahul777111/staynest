"use client";

import { MapPin } from "@phosphor-icons/react";

export default function LocationMap({
  lat,
  lng,
  location,
  country,
}: {
  lat: number;
  lng: number;
  location: string;
  country: string;
}) {
  const bbox = `${lng - 0.05}%2C${lat - 0.04}%2C${lng + 0.05}%2C${lat + 0.04}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <section className="border-b border-[var(--border)] py-8">
      <h3 className="mb-4 text-lg font-semibold">Where you&apos;ll be</h3>
      <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
        <iframe
          src={src}
          className="h-[320px] w-full"
          loading="lazy"
          title={`Map of ${location}`}
        />
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-sm text-[var(--text)]">
        <MapPin size={16} weight="fill" className="text-[var(--brand)]" />
        {location}, {country}
      </p>
    </section>
  );
}
