import { NextResponse } from "next/server";
import { LISTINGS } from "@/lib/listings";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase().trim();
  const guests = Number(searchParams.get("guests") || 0);
  const maxPrice = Number(searchParams.get("maxPrice") || 0);
  const category = (searchParams.get("category") || "all").toLowerCase();

  let results = LISTINGS;
  if (q) {
    results = results.filter(
      (l) =>
        l.location.toLowerCase().includes(q) ||
        l.country.toLowerCase().includes(q) ||
        l.title.toLowerCase().includes(q) ||
        l.type.toLowerCase().includes(q)
    );
  }
  if (category && category !== "all") {
    results = results.filter((l) => l.category === category);
  }
  if (guests > 0) results = results.filter((l) => l.guests >= guests);
  if (maxPrice > 0) results = results.filter((l) => l.price <= maxPrice);

  return NextResponse.json({ listings: results });
}
