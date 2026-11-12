"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { allMenuItems, getMenuCategories } from "@/lib/data";
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

interface TableQr {
  number: string;
  path: string;
  url: string;
}

export function AdminClient() {
  const [data, setData] = useState<AdminPayload | null>(null);
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [tables, setTables] = useState<TableQr[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);
  const categories = getMenuCategories();
  const items = allMenuItems();

  const refreshAvailability = useCallback(async () => {
    const res = await fetch("/api/availability", { cache: "no-store" });
    if (!res.ok) return;
    const json = await res.json();
    setAvailability(json.availability ?? {});
  }, []);

  useEffect(() => {
    fetch("/api/admin/stats", { cache: "no-store" })
      .then((r) => r.json())
      .then(setData);
    refreshAvailability();
    fetch("/api/tables", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => setTables(j.tables ?? []));
  }, [refreshAvailability]);

  async function toggleSoldOut(itemId: string, currentlyAvailable: boolean) {
    setSavingId(itemId);
    try {
      const res = await fetch("/api/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, available: !currentlyAvailable }),
      });
      if (res.ok) {
        const json = await res.json();
        setAvailability(json.availability ?? {});
      }
    } finally {
      setSavingId(null);
    }
  }

  function printQrCards() {
    window.print();
  }

  if (!data) return <p>Loading…</p>;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 print:hidden">
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

      <section className="fz-card p-5 print:hidden">
        <h2 className="font-display text-2xl">Sold-out controls</h2>
        <p className="mt-1 text-sm text-[color:var(--fz-muted)]">
          Toggle items off the guest menu without a deploy.
        </p>
        <ul className="mt-4 max-h-[28rem] space-y-2 overflow-y-auto">
          {items.map((item) => {
            const available = availability[item.id] !== false;
            return (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-[color:var(--fz-elevated)] px-3 py-2 text-sm"
              >
                <span className="min-w-0 flex-1 font-semibold">{item.name}</span>
                <button
                  type="button"
                  disabled={savingId === item.id}
                  onClick={() => toggleSoldOut(item.id, available)}
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                    available
                      ? "bg-[color:var(--fz-mustard)] text-[#120d14]"
                      : "bg-[color:var(--fz-tomato)] text-[#fff6ee]"
                  }`}
                >
                  {savingId === item.id ? "…" : available ? "Available" : "Sold out"}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="fz-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div>
            <h2 className="font-display text-2xl">Table QR cards</h2>
            <p className="mt-1 text-sm text-[color:var(--fz-muted)]">
              Print and place on tables — scan opens the menu with table set.
            </p>
          </div>
          <button type="button" onClick={printQrCards} className="fz-btn fz-btn-primary px-4 py-2">
            Print QR cards
          </button>
        </div>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-2">
          {tables.map((t) => {
            const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(t.url)}`;
            return (
              <li
                key={t.number}
                className="flex flex-col items-center gap-3 rounded-2xl border border-[color:var(--fz-outline)] bg-[#fffaf4] p-5 text-center text-[#120d14] print:break-inside-avoid"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrSrc} alt={`QR for table ${t.number}`} width={180} height={180} />
                <p className="font-display text-3xl">Table {t.number}</p>
                <p className="text-xs text-[#5a4a40]">Scan to order · Franzos Coventry</p>
                <p className="break-all text-[0.65rem] text-[#8a7468]">{t.url}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="fz-card p-5 print:hidden">
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

      <section className="fz-card p-5 print:hidden">
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
