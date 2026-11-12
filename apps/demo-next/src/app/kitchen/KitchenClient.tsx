"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import type { Order, OrderStatus } from "@/lib/types";

const KITCHEN_STATUSES = new Set(["PENDING", "CONFIRMED", "PREPARING"]);

const NEXT: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING: "CONFIRMED",
  CONFIRMED: "PREPARING",
  PREPARING: "READY_FOR_PICKUP",
};

const ACTION_LABEL: Partial<Record<OrderStatus, string>> = {
  PENDING: "Accept",
  CONFIRMED: "Start preparing",
  PREPARING: "Ready",
};

function customizationDiffs(c: Record<string, string> | undefined): { kind: "+" | "−" | "·"; text: string }[] {
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

function playChime() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 880;
    gain.gain.value = 0.08;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  } catch {
    /* ignore */
  }
}

export function KitchenClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [sound, setSound] = useState(true);
  const knownIds = useRef<Set<string>>(new Set());
  const primed = useRef(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/orders?status=PENDING,CONFIRMED,PREPARING", {
      cache: "no-store",
    });
    const data = await res.json();
    const list = (data.orders as Order[]).filter((o) => KITCHEN_STATUSES.has(o.status));

    if (primed.current && sound) {
      for (const o of list) {
        if (!knownIds.current.has(o.id) && o.status === "PENDING") {
          playChime();
          break;
        }
      }
    }
    knownIds.current = new Set(list.map((o) => o.id));
    primed.current = true;
    setOrders(list);
  }, [sound]);

  useEffect(() => {
    load();
    const id = setInterval(load, 4000);
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
        Chime on new tickets
      </label>
      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {orders.map((order) => {
          const waitedMin = Math.floor(
            (Date.now() - new Date(order.createdAt).getTime()) / 60000
          );
          const timerClass =
            waitedMin >= 15
              ? "text-[color:var(--fz-tomato)]"
              : waitedMin >= 8
                ? "text-[color:var(--fz-mustard)]"
                : "text-[color:var(--fz-muted)]";
          return (
            <li
              key={order.id}
              className="fz-card border-l-4 border-[color:var(--fz-mustard)] p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-display text-2xl">{order.orderNumber}</p>
                  <p className="text-sm text-[color:var(--fz-muted)]">{order.customerName}</p>
                  {order.tableNumber ? (
                    <p className="mt-1 font-display text-lg text-[color:var(--fz-mustard)]">
                      Table {order.tableNumber}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs uppercase tracking-wide text-[color:var(--fz-muted)]">
                      {order.type.replace(/_/g, " ")}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <OrderStatusBadge status={order.status} />
                  <p className={`mt-2 text-xs font-semibold ${timerClass}`}>{waitedMin}m</p>
                </div>
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                {order.items.map((i) => {
                  const diffs = customizationDiffs(i.customizations);
                  return (
                    <li key={i.id}>
                      <p className="font-semibold">
                        {i.quantity}× {i.name}
                      </p>
                      {diffs.map((d) => (
                        <p
                          key={d.text}
                          className={
                            d.kind === "+"
                              ? "text-[color:var(--fz-mustard)]"
                              : d.kind === "−"
                                ? "text-[color:var(--fz-rose)]"
                                : "text-[color:var(--fz-muted)]"
                          }
                        >
                          {d.kind} {d.text}
                        </p>
                      ))}
                    </li>
                  );
                })}
              </ul>
              {order.notes ? (
                <p className="mt-2 rounded-lg bg-[color:var(--fz-elevated)] px-2 py-1 text-xs text-[color:var(--fz-ink)]">
                  Note: {order.notes}
                </p>
              ) : null}
              {NEXT[order.status] && (
                <button
                  type="button"
                  onClick={() => advance(order)}
                  className="fz-btn fz-btn-primary mt-4 w-full"
                >
                  {ACTION_LABEL[order.status] ?? "Advance"}
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {!orders.length && (
        <p className="text-[color:var(--fz-muted)]">No active kitchen tickets.</p>
      )}
    </div>
  );
}
