"use client";

import { useEffect, useState } from "react";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { formatMoney } from "@/lib/format";
import type { Order } from "@/lib/types";

const STEPS = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY_FOR_PICKUP",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

function customizationLines(c: Record<string, string> | undefined): { kind: "+" | "−" | "·"; text: string }[] {
  if (!c) return [];
  const out: { kind: "+" | "−" | "·"; text: string }[] = [];
  for (const [k, v] of Object.entries(c)) {
    if (k === "builder") continue;
    const lower = v.toLowerCase();
    if (lower === "none" || lower.startsWith("no ")) {
      out.push({ kind: "−", text: `${k}: ${v}` });
    } else if (k === "extras" || lower.includes("bacon") || lower.includes("extra")) {
      out.push({ kind: "+", text: v.includes(":") ? v : `${k}: ${v}` });
    } else {
      out.push({ kind: "·", text: `${k}: ${v}` });
    }
  }
  return out;
}

export function TrackOrderClient({ orderNumber }: { orderNumber: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(orderNumber)}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) {
        if (!cancelled) setError(data.error ?? "Not found");
        return;
      }
      if (!cancelled) setOrder(data.order);
    }
    load();
    const id = setInterval(load, 4000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [orderNumber]);

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }
  if (!order) {
    return <p className="text-[color:var(--fz-muted)]">Loading order…</p>;
  }

  const stepIndex = STEPS.indexOf(order.status);
  const statusHeadline =
    order.status === "PENDING"
      ? "Waiting for kitchen"
      : order.status === "CONFIRMED"
        ? "Accepted — starting soon"
        : order.status === "PREPARING"
          ? "Kitchen is preparing"
          : order.status === "READY_FOR_PICKUP"
            ? order.tableNumber
              ? "Ready — we’ll bring it to your table"
              : "Ready for pickup"
            : null;

  return (
    <div className="space-y-6">
      <div className="fz-card flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <p className="text-sm text-[color:var(--fz-muted)]">Status</p>
          <OrderStatusBadge status={order.status} />
          {statusHeadline ? (
            <p className="mt-2 text-sm font-semibold text-[color:var(--fz-mustard)]">{statusHeadline}</p>
          ) : null}
          {order.tableNumber ? (
            <p className="mt-1 text-sm text-[color:var(--fz-muted)]">Table {order.tableNumber}</p>
          ) : null}
        </div>
        <div className="text-right">
          <p className="text-sm text-[color:var(--fz-muted)]">Total</p>
          <p className="text-xl font-bold">{formatMoney(order.total)}</p>
        </div>
      </div>

      <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
        {STEPS.map((step, i) => (
          <li
            key={step}
            className={`min-w-0 rounded-xl border px-3 py-2 text-xs font-semibold ${
              i <= stepIndex
                ? "border-[color:var(--fz-mustard)] bg-[color:var(--fz-elevated)] text-[color:var(--fz-mustard)]"
                : "border-[color:var(--fz-sand)] opacity-50"
            }`}
          >
            {step.replace(/_/g, " ")}
          </li>
        ))}
      </ol>

      <section className="fz-card p-5">
        <h2 className="font-display text-xl">Items</h2>
        <ul className="mt-3 space-y-3 text-sm">
          {order.items.map((item) => {
            const diffs = customizationLines(item.customizations);
            return (
              <li key={item.id}>
                <div className="flex justify-between gap-3">
                  <span className="font-semibold">
                    {item.quantity}× {item.name}
                  </span>
                  <span>{formatMoney(item.unitPrice * item.quantity)}</span>
                </div>
                {diffs.map((d) => (
                  <p
                    key={d.text}
                    className={
                      d.kind === "+"
                        ? "text-[color:var(--fz-mustard)]"
                        : d.kind === "−"
                          ? "text-[color:var(--fz-rose)]"
                          : "text-[color:var(--fz-muted)] capitalize"
                    }
                  >
                    {d.kind} {d.text}
                  </p>
                ))}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
