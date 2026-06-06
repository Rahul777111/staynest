import Link from "next/link";
import {
  Star,
  Users,
  Bed,
  Bathtub,
  House,
  ArrowLeft,
  Sparkle,
  Key,
  Medal,
} from "@phosphor-icons/react/dist/ssr";
import { getListing, LISTINGS } from "@/lib/listings";
import Navbar from "@/app/components/Navbar";
import BookingWidget from "@/app/components/BookingWidget";
import ReviewsSection, { InquiryForm } from "./ReviewsSection";
import LocationMap from "./LocationMap";
import UserListingDetail from "./UserListingDetail";
import RecordView from "@/app/components/RecordView";
import ShareButton from "@/app/components/ShareButton";
import SimilarStays from "@/app/components/SimilarStays";

export function generateStaticParams() {
  return LISTINGS.map((l) => ({ id: l.id }));
}

const HL_ICONS = [Sparkle, Key, Medal];

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = getListing(id);
  // Host-created listings live in the browser; render a client fallback that
  // hydrates them from localStorage.
  if (!listing) return <UserListingDetail id={id} />;

  const facts = [
    { icon: Users, label: `${listing.guests} guests` },
    { icon: House, label: `${listing.bedrooms} bedrooms` },
    { icon: Bed, label: `${listing.beds} beds` },
    { icon: Bathtub, label: `${listing.baths} baths` },
  ];

  return (
    <div className="min-h-[100dvh]">
      <Navbar />
      <main className="mx-auto max-w-[1120px] px-5 py-6">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--text-dim)] transition hover:text-[var(--text)]"
        >
          <ArrowLeft size={16} /> All stays
        </Link>

        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {listing.title}
          </h1>
          <ShareButton title={listing.title} />
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--text-dim)]">
          <span className="flex items-center gap-1 text-[var(--text)]">
            <Star size={14} weight="fill" color="var(--star)" /> {listing.rating}
          </span>
          <span>· {listing.reviews} reviews</span>
          {listing.superhost && <span>· Superhost</span>}
          <span>
            · {listing.location}, {listing.country}
          </span>
        </div>

        {/* gallery */}
        <div className="mt-5 grid gap-2 overflow-hidden rounded-2xl sm:grid-cols-2">
          {/* eslint-disable @next/next/no-img-element */}
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="h-64 w-full object-cover sm:h-[440px]"
          />
          <div className="grid grid-cols-2 gap-2">
            {listing.images.slice(1, 5).map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${listing.title} photo ${i + 2}`}
                className="hidden h-[214px] w-full object-cover sm:block"
              />
            ))}
            {listing.images.length < 3 &&
              Array.from({ length: 3 - listing.images.length + 1 }).map((_, i) => (
                <img
                  key={`fill-${i}`}
                  src={listing.images[0]}
                  alt=""
                  className="hidden h-[214px] w-full object-cover opacity-80 sm:block"
                />
              ))}
          </div>
          {/* eslint-enable @next/next/no-img-element */}
        </div>

        {/* body */}
        <div className="mt-8 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-6">
              <div>
                <h2 className="text-xl font-semibold">
                  {listing.type} hosted by {listing.host.name}
                </h2>
                <p className="mt-1 text-sm text-[var(--text-dim)]">
                  {listing.host.trips} trips hosted · Host since{" "}
                  {listing.host.since}
                </p>
              </div>
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--brand)] text-lg font-bold text-white">
                {listing.host.name[0]}
              </div>
            </div>

            <div className="flex flex-wrap gap-5 border-b border-[var(--border)] py-6">
              {facts.map((f) => {
                const Icon = f.icon;
                return (
                  <span key={f.label} className="flex items-center gap-2 text-sm">
                    <Icon size={20} className="text-[var(--text-dim)]" />{" "}
                    {f.label}
                  </span>
                );
              })}
            </div>

            <div className="flex flex-col gap-5 border-b border-[var(--border)] py-6">
              {listing.highlights.map((h, i) => {
                const Icon = HL_ICONS[i % HL_ICONS.length];
                return (
                  <div key={h.title} className="flex items-start gap-4">
                    <Icon
                      size={24}
                      className="mt-0.5 shrink-0 text-[var(--text)]"
                    />
                    <div>
                      <p className="font-medium">{h.title}</p>
                      <p className="text-sm text-[var(--text-dim)]">{h.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="border-b border-[var(--border)] py-6 leading-relaxed text-[var(--text)]">
              {listing.description}
            </p>

            <div className="border-b border-[var(--border)] py-6">
              <h3 className="mb-4 text-lg font-semibold">
                What this place offers
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {listing.amenities.map((a) => (
                  <span
                    key={a}
                    className="rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <ReviewsSection
              listingId={listing.id}
              rating={listing.rating}
              reviews={listing.reviews}
            />

            <LocationMap
              lat={listing.lat}
              lng={listing.lng}
              location={listing.location}
              country={listing.country}
            />

            <InquiryForm listingId={listing.id} hostName={listing.host.name} />
          </div>

          <div>
            <BookingWidget listing={listing} />
          </div>
        </div>

        <SimilarStays category={listing.category} currentId={listing.id} />
        <RecordView listing={listing} />
      </main>

      <footer className="border-t border-[var(--border)] bg-[var(--muted)]">
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-3 px-5 py-6 text-sm text-[var(--text-dim)]">
          <span>Built by D L Narayana</span>
          <span>Next.js · Supabase · Motion</span>
        </div>
      </footer>
    </div>
  );
}
