"use client";

import { useEffect } from "react";
import { recordView } from "@/lib/recentlyViewed";
import type { Listing } from "@/lib/listings";

// Invisible helper: records a listing into "recently viewed" when its detail
// page mounts. Lets a server-rendered detail page log the view client-side.
export default function RecordView({ listing }: { listing: Listing }) {
  useEffect(() => {
    recordView(listing);
  }, [listing]);
  return null;
}
