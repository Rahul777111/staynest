import { NextResponse } from "next/server";
import { getListing } from "@/lib/listings";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: {
    listingId?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { listingId, checkIn, checkOut, guests } = body;
  const listing = listingId ? getListing(listingId) : undefined;
  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }
  if (!checkIn || !checkOut) {
    return NextResponse.json({ error: "Select check-in and check-out dates" }, { status: 400 });
  }

  const start = new Date(checkIn);
  const end = new Date(checkOut);
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

  return NextResponse.json({
    confirmation: {
      code: "SN-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
      listingId: listing.id,
      listingTitle: listing.title,
      location: listing.location,
      image: listing.images[0],
      checkIn,
      checkOut,
      nights,
      guests: guests || 1,
      breakdown: { nightly, cleaning, serviceFee, total, perNight: listing.price },
      bookedAt: new Date().toISOString(),
    },
  });
}
