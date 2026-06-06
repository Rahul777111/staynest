"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Star, Warning, CheckCircle } from "@phosphor-icons/react";
import type { Listing } from "@/lib/listings";
import { useTrips } from "@/lib/trips";

function todayPlus(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function BookingWidget({ listing }: { listing: Listing }) {
  const router = useRouter();
  const { addTrip } = useTrips();
  const [checkIn, setCheckIn] = useState(todayPlus(7));
  const [checkOut, setCheckOut] = useState(todayPlus(12));
  const [guests, setGuests] = useState(2);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const today = todayPlus(0);

  const nights = useMemo(() => {
    const n = Math.round(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000
    );
    return Number.isNaN(n) ? 0 : n;
  }, [checkIn, checkOut]);

  // realtime guard against past or invalid dates, evaluated against the live current date
  const dateIssue = useMemo(() => {
    if (!checkIn || !checkOut) return "Select your dates.";
    if (checkIn < today) return "Check-in cannot be in the past.";
    if (checkOut <= checkIn) return "Check-out must be after check-in.";
    return "";
  }, [checkIn, checkOut, today]);

  const nightly = listing.price * Math.max(nights, 0);
  const cleaning = 60;
  const serviceFee = Math.round(nightly * 0.12);
  const total = nightly + cleaning + serviceFee;

  const book = async () => {
    if (dateIssue) {
      setError(dateIssue);
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing.id,
          checkIn,
          checkOut,
          guests,
          // Sent so host-created listings (not in seed data) can still be booked.
          listingData: {
            title: listing.title,
            location: listing.location,
            image: listing.images[0],
            price: listing.price,
            guests: listing.guests,
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Could not complete booking");
      } else {
        addTrip(json.confirmation);
        setDone(true);
        setTimeout(() => router.push("/trips"), 1400);
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setBusy(false);
  };

  return (
    <div className="sticky top-24 rounded-2xl border border-[var(--border)] p-6 shadow-xl">
      <div className="flex items-baseline justify-between">
        <p>
          <span className="text-2xl font-bold">${listing.price}</span>
          <span className="text-[var(--text-dim)]"> night</span>
        </p>
        <span className="flex items-center gap-1 text-sm">
          <Star size={14} weight="fill" color="var(--star)" /> {listing.rating}
          <span className="text-[var(--text-dim)]">· {listing.reviews} reviews</span>
        </span>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-[var(--border)]">
        <div className="grid grid-cols-2 divide-x divide-[var(--border)]">
          <label className="flex flex-col px-3 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-wide">Check-in</span>
            <input
              type="date"
              value={checkIn}
              min={today}
              onChange={(e) => setCheckIn(e.target.value)}
              className="bg-transparent text-sm outline-none"
            />
          </label>
          <label className="flex flex-col px-3 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-wide">Check-out</span>
            <input
              type="date"
              value={checkOut}
              min={checkIn > today ? checkIn : today}
              onChange={(e) => setCheckOut(e.target.value)}
              className="bg-transparent text-sm outline-none"
            />
          </label>
        </div>
        <label className="flex flex-col border-t border-[var(--border)] px-3 py-2">
          <span className="text-[10px] font-semibold uppercase tracking-wide">Guests</span>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="bg-transparent text-sm outline-none"
          >
            {Array.from({ length: listing.guests }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i === 0 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </label>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 flex items-center gap-1.5 text-sm text-[var(--brand)]"
          >
            <Warning size={15} weight="fill" /> {error}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        onClick={book}
        disabled={busy || done || nights <= 0 || Boolean(dateIssue)}
        className="mt-4 w-full rounded-xl bg-[var(--brand)] py-3 font-semibold text-white transition hover:bg-[var(--brand-dark)] active:scale-[0.99] disabled:opacity-60"
      >
        {done ? (
          <span className="flex items-center justify-center gap-2">
            <CheckCircle size={18} weight="fill" /> Booked! Redirecting...
          </span>
        ) : busy ? (
          "Confirming..."
        ) : (
          "Reserve"
        )}
      </button>

      {nights > 0 && (
        <div className="mt-4 flex flex-col gap-2 text-sm">
          <Row label={`$${listing.price} x ${nights} nights`} value={`$${nightly}`} />
          <Row label="Cleaning fee" value={`$${cleaning}`} />
          <Row label="Service fee" value={`$${serviceFee}`} />
          <div className="mt-1 flex justify-between border-t border-[var(--border)] pt-3 font-semibold">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[var(--text-dim)]">
      <span className="underline">{label}</span>
      <span>{value}</span>
    </div>
  );
}
