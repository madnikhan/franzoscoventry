"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { formatOrderStatus } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";

const KITCHEN_STATUSES = new Set(["PENDING", "CONFIRMED", "PREPARING"]);

const NEXT: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING: "CONFIRMED",
  CONFIRMED: "PREPARING",
  PREPARING: "READY_FOR_PICKUP",
};

export function KitchenClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [sound, setSound] = useState(false);
  const prevCount = useRef(0);

  const load = useCallback(async () => {
    const res = await fetch("/api/orders?status=PENDING,CONFIRMED,PREPARING", {
      cache: "no-store",
    });
    const data = await res.json();
    const list = (data.orders as Order[]).filter((o) => KITCHEN_STATUSES.has(o.status));
    setOrders(list);
    if (sound && list.length > prevCount.current) {
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        osc.frequency.value = 880;
        osc.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } catch {
        /* ignore */
      }
    }
    prevCount.current = list.length;
  }, [sound]);

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, [load]);

  async function advance(order: Order) {
    const next = NEXT[order.status];
    if (!next) return;
    await fetch(`/api/orders/${order.id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    load();
  }

  return (
    <div>
      <label className="mb-4 flex items-center gap-2 text-sm">
        <input type="checkbox" checked={sound} onChange={(e) => setSound(e.target.checked)} />
        Play sound on new tickets
      </label>
      <ul className="grid gap-4 md:grid-cols-2">
        {orders.map((order) => (
          <li key={order.id} className="fz-card border-l-4 border-[color:var(--fz-flame)] p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-display text-2xl">{order.orderNumber}</p>
                <p className="text-sm text-[color:var(--fz-muted)]">{order.customerName}</p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
            <ul className="mt-3 space-y-1 text-sm">
              {order.items.map((i) => (
                <li key={i.id}>
                  {i.quantity}× {i.name}
                  {i.customizations?.spice && ` · ${i.customizations.spice}`}
                </li>
              ))}
            </ul>
            {NEXT[order.status] && (
              <button
                type="button"
                onClick={() => advance(order)}
                className="fz-btn fz-btn-primary mt-4 w-full"
              >
                Mark {formatOrderStatus(NEXT[order.status]!)}
              </button>
            )}
          </li>
        ))}
      </ul>
      {!orders.length && (
        <p className="text-[color:var(--fz-muted)]">No active kitchen tickets.</p>
      )}
    </div>
  );
}
