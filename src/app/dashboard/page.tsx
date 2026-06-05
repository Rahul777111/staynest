"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ChartLineUp, Eye, CalendarCheck, CurrencyDollar, Star, LockSimple } from "@phosphor-icons/react";
import Navbar from "../components/Navbar";
import type { HostAnalytics } from "@/lib/premium-membership";
import { useSocialUser } from "../components/social/useSocialUser";

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

// Dependency-free line chart drawn with inline SVG.
function LineChart({ data, color = "var(--brand)" }: { data: { month: string; revenue?: number; bookings?: number }[]; color?: string }) {
  const values = data.map((d) => d.revenue ?? d.bookings ?? 0);
  const max = Math.max(...values, 1);
  const w = 520;
  const h = 160;
  const pad = 28;
  const stepX = (w - pad * 2) / Math.max(values.length - 1, 1);
  const points = values.map((v, i) => {
    const x = pad + i * stepX;
    const y = h - pad - (v / max) * (h - pad * 2);
    return [x, y];
  });
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
  const area = `${path} L ${points[points.length - 1][0]} ${h - pad} L ${pad} ${h - pad} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Trend chart">
      <defs>
        <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path d={area} fill="url(#fill)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} />
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r={3.5} fill={color} />
          <text x={p[0]} y={h - 8} textAnchor="middle" fontSize="11" fill="var(--text-dim)">
            {data[i].month}
          </text>
        </g>
      ))}
    </svg>
  );
}

function KpiCard({ icon, label, value, i }: { icon: React.ReactNode; label: string; value: string; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05 }}
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
    >
      <div className="flex items-center gap-2 text-[var(--text-dim)]">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold tabular-nums">{value}</p>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { id } = useSocialUser();
  const [analytics, setAnalytics] = useState<HostAnalytics | null>(null);
  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/premium/analytics?user=${id}`);
      if (res.status === 402) {
        setLocked(true);
        return;
      }
      const data = await res.json();
      setAnalytics(data.analytics);
      setLocked(false);
    } catch {
      setLocked(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="min-h-[100dvh]">
      <Navbar />
      <main className="mx-auto max-w-[920px] px-5 py-8">
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <ChartLineUp size={26} weight="fill" className="text-[var(--brand)]" /> Host Dashboard
        </h1>
        <p className="mt-1 text-sm text-[var(--text-dim)]">Performance insights for your listings.</p>

        {loading && (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface)]" />
            ))}
          </div>
        )}

        {!loading && locked && (
          <div className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
            <LockSimple size={36} weight="fill" className="mx-auto text-[var(--brand)]" />
            <h2 className="mt-3 text-xl font-bold">Analytics is a Host Pro feature</h2>
            <p className="mx-auto mt-1 max-w-md text-[var(--text-dim)]">
              Upgrade to Host Pro to unlock revenue trends, occupancy, and per-listing performance.
            </p>
            <Link href="/premium" className="mt-5 inline-block rounded-full bg-[var(--brand)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--brand-dark)]">
              See Host Pro
            </Link>
          </div>
        )}

        {!loading && !locked && analytics && (
          <>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <KpiCard i={0} icon={<Eye size={18} />} label="Views" value={fmt(analytics.kpis.views)} />
              <KpiCard i={1} icon={<CalendarCheck size={18} />} label="Bookings" value={fmt(analytics.kpis.bookings)} />
              <KpiCard i={2} icon={<CurrencyDollar size={18} />} label="Revenue" value={`$${fmt(analytics.kpis.revenue)}`} />
              <KpiCard i={3} icon={<Star size={18} weight="fill" />} label="Avg rating" value={analytics.kpis.rating.toFixed(2)} />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <h3 className="font-semibold">Revenue (6 mo)</h3>
                <div className="mt-2"><LineChart data={analytics.revenueByMonth} /></div>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <h3 className="font-semibold">Bookings (6 mo)</h3>
                <div className="mt-2"><LineChart data={analytics.bookingsByMonth} color="#0d6efd" /></div>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
              <div className="border-b border-[var(--border)] p-5">
                <h3 className="font-semibold">Listing performance</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-[var(--text-dim)]">
                    <tr className="border-b border-[var(--border)]">
                      <th className="px-5 py-3 text-left font-medium">Listing</th>
                      <th className="px-5 py-3 text-right font-medium">Views</th>
                      <th className="px-5 py-3 text-right font-medium">Bookings</th>
                      <th className="px-5 py-3 text-right font-medium">Revenue</th>
                      <th className="px-5 py-3 text-right font-medium">Occupancy</th>
                      <th className="px-5 py-3 text-right font-medium">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.listings.map((l) => (
                      <tr key={l.id} className="border-b border-[var(--border)] last:border-0">
                        <td className="px-5 py-3 font-medium">
                          <Link href={`/listing/${l.id}`} className="hover:underline">{l.title}</Link>
                        </td>
                        <td className="px-5 py-3 text-right tabular-nums">{fmt(l.views)}</td>
                        <td className="px-5 py-3 text-right tabular-nums">{l.bookings}</td>
                        <td className="px-5 py-3 text-right tabular-nums">${fmt(l.revenue)}</td>
                        <td className="px-5 py-3 text-right tabular-nums">{Math.round(l.occupancy * 100)}%</td>
                        <td className="px-5 py-3 text-right tabular-nums">{l.rating.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
