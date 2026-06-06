import { NextResponse } from "next/server";
import { getListing } from "@/lib/listings";
import { supabase, hasSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: {
    listingId?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
    // Optional listing data for host-created (client-side) listings that
    // do not exist in the seed data set.
    listingData?: {
      title?: string;
      location?: string;
      image?: string;
      price?: number;
      guests?: number;
    };
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { listingId, checkIn, checkOut, guests, listingData } = body;
  const seed = listingId ? getListing(listingId) : undefined;
  // Fall back to client-provided data for host-created listings.
  const listing =
    seed ||
    (listingId && listingData && listingData.price
      ? {
          id: listingId,
          title: listingData.title || "Your stay",
          location: listingData.location || "",
          images: [listingData.image || ""],
          price: Math.max(1, Math.round(Number(listingData.price))),
          guests: Math.max(1, Math.round(Number(listingData.guests) || 1)),
        }
      : undefined);
  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }
  if (!checkIn || !checkOut) {
    return NextResponse.json({ error: "Select check-in and check-out dates" }, { status: 400 });
  }

  const start = new Date(checkIn + "T00:00:00");
  const end = new Date(checkOut + "T00:00:00");

  // realtime guard: reject past check-in dates using the live server date
  const now = new Date();
  const todayMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return NextResponse.json({ error: "Invalid dates" }, { status: 400 });
  }
  if (start < todayMidnight) {
    return NextResponse.json(
      { error: "Check-in cannot be in the past" },
      { status: 400 }
    );
  }
  const nights = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  if (Number.isNaN(nights) || nights <= 0) {
    return NextResponse.json({ error: "Check-out must be after check-in" }, { status: 400 });
  }
  if ((guests || 1) > listing.guests) {
    return NextResponse.json(
      { error: `This place allows up to ${listing.guests} guests` },
      { status: 400 }
    );
  }

  const nightly = listing.price * nights;
  const cleaning = 60;
  const serviceFee = Math.round(nightly * 0.12);
  const total = nightly + cleaning + serviceFee;

  const code = "SN-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  const bookedAt = new Date().toISOString();

  // Persist to Supabase when configured (cross-device record of the booking)
  if (hasSupabase) {
    await supabase.from("staynest_bookings").insert({
      code,
      listing_id: listing.id,
      listing_title: listing.title,
      location: listing.location,
      image: listing.images[0],
      check_in: checkIn,
      check_out: checkOut,
      nights,
      guests: guests || 1,
      total,
      per_night: listing.price,
      cleaning,
      service_fee: serviceFee,
      booked_at: bookedAt,
    });
  }

  return NextResponse.json({
    confirmation: {
      code,
      listingId: listing.id,
      listingTitle: listing.title,
      location: listing.location,
      image: listing.images[0],
      checkIn,
      checkOut,
      nights,
      guests: guests || 1,
      breakdown: { nightly, cleaning, serviceFee, total, perNight: listing.price },
      bookedAt,
    },
  });
}
