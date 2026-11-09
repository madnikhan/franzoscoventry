"use client";

import { useMemo, useState } from "react";
import { allMenuItems } from "@/lib/data";
import { formatMoney } from "@/lib/format";
import type { CartLine } from "@/lib/types";

export function TillClient() {
  const items = useMemo(() => allMenuItems().filter((i) => i.isAvailable).slice(0, 12), []);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
  const [message, setMessage] = useState("");

  function add(itemId: string) {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    setLines((prev) => {
      const existing = prev.find((l) => l.itemId === itemId);
      if (existing) {
        return prev.map((l) =>
          l.itemId === itemId ? { ...l, quantity: l.quantity + 1 } : l
        );
      }
      return [
        ...prev,
        {
          itemId: item.id,
          name: item.name,
          unitPrice: item.price,
          quantity: 1,
          customizations: {},
        },
      ];
    });
  }

  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0);

  async function completeSale() {
    if (!lines.length) return;
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "TAKEAWAY",
        paymentMethod,
        customerName: "Walk-in",
        customerPhone: "+440000000000",
        items: lines,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(`Sale recorded — ${data.order.orderNumber}`);
      setLines([]);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="fz-card p-4">
        <h2 className="font-display text-xl">Quick add</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => add(item.id)}
              className="rounded-xl border border-[color:var(--fz-sand)] p-3 text-left text-sm hover:border-[color:var(--fz-flame)]"
            >
              <p className="font-semibold">{item.name}</p>
              <p className="text-[color:var(--fz-muted)]">{formatMoney(item.price)}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="fz-card space-y-4 p-4">
        <h2 className="font-display text-xl">Current sale</h2>
        <ul className="space-y-2 text-sm">
          {lines.map((l) => (
            <li key={l.itemId} className="flex justify-between">
              <span>
                {l.quantity}× {l.name}
              </span>
              <span>{formatMoney(l.unitPrice * l.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="text-lg font-bold">Total: {formatMoney(subtotal)}</p>
        <div className="flex gap-2">
          {(["cash", "card"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setPaymentMethod(m)}
              className={`flex-1 rounded-xl border py-2 font-semibold capitalize ${
                paymentMethod === m
                  ? "border-[color:var(--fz-char)] bg-[color:var(--fz-char)] text-white"
                  : ""
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <button
          type="button"
          disabled={!lines.length}
          onClick={completeSale}
          className="fz-btn fz-btn-primary w-full py-3 disabled:opacity-50"
        >
          Complete sale
        </button>
        {message && <p className="text-sm text-[color:var(--fz-leaf)]">{message}</p>}
      </section>
    </div>
  );
}
