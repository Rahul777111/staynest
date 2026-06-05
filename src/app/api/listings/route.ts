import { NextResponse } from "next/server";
import { LISTINGS } from "@/lib/listings";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase().trim();
  const guests = Number(searchParams.get("guests") || 0);
  const maxPrice = Number(searchParams.get("maxPrice") || 0);
  const category = (searchParams.get("category") || "all").toLowerCase();
  const sort = (searchParams.get("sort") || "recommended").toLowerCase();

  let results = [...LISTINGS];
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

  switch (sort) {
    case "recent":
      // newest listings first (last in the source array are the most recently added)
      results = results.slice().reverse();
      break;
    case "price_low":
      results = results.slice().sort((a, b) => a.price - b.price);
      break;
    case "price_high":
      results = results.slice().sort((a, b) => b.price - a.price);
      break;
    case "rating":
      results = results.slice().sort((a, b) => b.rating - a.rating);
      break;
    default:
      break;
  }

  return NextResponse.json({ listings: results });
}
