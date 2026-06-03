"use client";

import { useState, useEffect, useCallback } from "react";

export type Trip = {
  code: string;
  listingId: string;
  listingTitle: string;
  location: string;
  image: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  breakdown: {
    nightly: number;
    cleaning: number;
    serviceFee: number;
    total: number;
    perNight: number;
  };
  bookedAt: string;
};

const KEY = "staynest.trips.v1";

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setTrips(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const persist = (next: Trip[]) => {
    setTrips(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const addTrip = useCallback((t: Trip) => {
    setTrips((prev) => {
      const next = [t, ...prev];
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const removeTrip = useCallback((code: string) => {
    setTrips((prev) => {
      const next = prev.filter((t) => t.code !== code);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return { trips, addTrip, removeTrip, persist };
}
