"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { getMenuCategories } from "@/lib/data";
import { formatMoney } from "@/lib/format";
import type { Order } from "@/lib/types";

interface AdminPayload {
  stats: {
    totalOrders: number;
    todayOrders: number;
    revenue: number;
    active: number;
  };
  recentOrders: Order[];
  menu: { categories: number; items: number };
}

export function AdminClient() {
  const [data, setData] = useState<AdminPayload | null>(null);
  const categories = getMenuCategories();

  useEffect(() => {
    fetch("/api/admin/stats", { cache: "no-store" })
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return <p>Loading…</p>;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Total orders", data.stats.totalOrders],
          ["Today", data.stats.todayOrders],
          ["Revenue", formatMoney(data.stats.revenue)],
          ["Active", data.stats.active],
        ].map(([label, value]) => (
          <div key={String(label)} className="fz-card p-4">
            <p className="text-xs uppercase text-[color:var(--fz-muted)]">{label}</p>
            <p className="font-display text-3xl">{value}</p>
          </div>
        ))}
      </div>

      <section className="fz-card p-5">
        <h2 className="font-display text-2xl">Recent orders</h2>
        <ul className="mt-4 divide-y">
          {data.recentOrders.map((o) => (
            <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
              <Link href={`/track/${o.orderNumber}`} className="font-semibold text-[color:var(--fz-flame)]">
                {o.orderNumber}
              </Link>
              <OrderStatusBadge status={o.status} />
              <span>{formatMoney(o.total)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="fz-card p-5">
        <h2 className="font-display text-2xl">Menu overview</h2>
        <p className="mt-2 text-sm text-[color:var(--fz-muted)]">
          {data.menu.categories} categories · {data.menu.items} items (synced seed)
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {categories.map((c) => (
            <li key={c.id} className="rounded-lg bg-[color:var(--fz-cream)] px-3 py-2 text-sm">
              <span className="font-semibold">{c.name}</span>
              <span className="text-[color:var(--fz-muted)]"> — {c.items.length} items</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
