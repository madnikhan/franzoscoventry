"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { cartLineKey, useCart } from "@/context/CartContext";
import { businessConfig } from "@/lib/data";
import { formatMoney } from "@/lib/format";
import type { OrderType } from "@/lib/types";

function customizationLines(c: Record<string, string> | undefined): string[] {
  if (!c) return [];
  return Object.entries(c)
    .filter(([k]) => k !== "builder")
    .map(([k, v]) => `${k}: ${v}`);
}

export function OrderClient() {
  const { lines, subtotal, clear, updateQuantity, removeLine, tableNumber, setTableNumber } =
    useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [type, setType] = useState<OrderType>(tableNumber ? "DINE_IN" : "COLLECTION");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [tableInput, setTableInput] = useState(tableNumber ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = searchParams.get("table")?.trim();
    if (t) setTableNumber(t);
  }, [searchParams, setTableNumber]);

  useEffect(() => {
    if (tableNumber) {
      setType("DINE_IN");
      setTableInput(tableNumber);
    }
  }, [tableNumber]);

  const deliveryFee = type === "DELIVERY" ? businessConfig.delivery.fee : 0;
  const vat = (subtotal + deliveryFee) * (businessConfig.vatRate ?? 0);
  const total = subtotal + deliveryFee + vat;

  const paymentOptions = useMemo(() => {
    if (type === "DINE_IN") return ["cash", "card"];
    return type === "DELIVERY"
      ? businessConfig.payments.deliveryMethods
      : businessConfig.payments.collectionMethods;
  }, [type]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!lines.length) {
      setError("Your cart is empty — add items from the menu.");
      return;
    }
    if (type === "DELIVERY" && subtotal < businessConfig.delivery.minOrder) {
      setError(`Minimum order for delivery is ${formatMoney(businessConfig.delivery.minOrder)}.`);
      return;
    }
    const dineTable = tableNumber || tableInput.trim();
    if (type === "DINE_IN" && !dineTable) {
      setError("Scan a table QR or enter a table number for dine-in.");
      return;
    }
    if (type === "DINE_IN" && dineTable) setTableNumber(dineTable);
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          paymentMethod,
          customerName: name,
          customerPhone: phone,
          customerEmail: email || undefined,
          address: type === "DELIVERY" ? address : undefined,
          tableNumber: type === "DINE_IN" ? dineTable : undefined,
          notes: notes || undefined,
          items: lines,
          payWithCard: paymentMethod === "card",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Order failed");
      clear();
      router.push(`/track/${data.order.orderNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order failed");
    } finally {
      setLoading(false);
    }
  }

  if (!lines.length) {
    return (
      <div className="fz-card p-8 text-center">
        <p>Your cart is empty.</p>
        {tableNumber ? (
          <p className="mt-2 text-sm text-[color:var(--fz-mustard)]">Ordering for table {tableNumber}</p>
        ) : null}
        <Link href="/menu" className="fz-btn fz-btn-primary mt-4 inline-block">
          Browse menu
        </Link>
      </div>
    );
  }

  const fulfillmentTypes: OrderType[] = ["DINE_IN", "COLLECTION", "DELIVERY"];

  return (
    <form onSubmit={onSubmit} className="grid min-w-0 gap-8 lg:grid-cols-2">
      <div className="min-w-0 space-y-4">
        {tableNumber ? (
          <div className="fz-card flex flex-wrap items-center justify-between gap-3 border-[color:var(--fz-mustard)]/50 p-4">
            <p className="font-display text-xl text-[color:var(--fz-mustard)]">
              Table {tableNumber}
            </p>
            <button
              type="button"
              className="text-sm font-semibold text-[color:var(--fz-muted)] underline"
              onClick={() => setTableNumber(null)}
            >
              Clear table
            </button>
          </div>
        ) : null}

        <section className="fz-card p-5">
          <h2 className="font-display text-2xl">Your order</h2>
          <ul className="mt-4 space-y-3">
            {lines.map((line) => {
              const key = cartLineKey(line);
              const extras = customizationLines(line.customizations);
              return (
                <li
                  key={key}
                  className="flex min-w-0 flex-wrap items-center gap-2 text-sm sm:flex-nowrap sm:gap-3"
                >
                  <div className="min-w-0 flex-1 basis-full sm:basis-auto">
                    <p className="truncate font-semibold">{line.name}</p>
                    {extras.map((x) => (
                      <p key={x} className="text-[color:var(--fz-muted)] capitalize">
                        {x}
                      </p>
                    ))}
                  </div>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={line.quantity}
                    onChange={(e) =>
                      updateQuantity(line.itemId, key, parseInt(e.target.value, 10) || 1)
                    }
                    className="w-14 shrink-0 rounded border px-1 py-0.5"
                  />
                  <p className="w-20 shrink-0 text-right font-medium">
                    {formatMoney(line.unitPrice * line.quantity)}
                  </p>
                  <button
                    type="button"
                    className="shrink-0 text-[color:var(--fz-flame)]"
                    onClick={() => removeLine(line.itemId, key)}
                  >
                    ×
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="fz-card space-y-3 p-5">
          <h2 className="font-display text-2xl">Fulfillment</h2>
          <div className="flex flex-wrap gap-2">
            {fulfillmentTypes.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold ${
                  type === t
                    ? "border-[color:var(--fz-tomato)] bg-[color:var(--fz-tomato)] text-[#fff6ee]"
                    : "border-[color:var(--fz-sand)] bg-[color:var(--fz-elevated)] text-[color:var(--fz-ink)]"
                }`}
              >
                {t === "DELIVERY" ? "Delivery" : t === "DINE_IN" ? "Dine-in" : "Collection"}
              </button>
            ))}
          </div>
          {type === "DINE_IN" && !tableNumber ? (
            <label className="block text-sm">
              Table number
              <input
                required
                value={tableInput}
                onChange={(e) => setTableInput(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2"
                placeholder="e.g. 7"
              />
            </label>
          ) : null}
          <label className="block text-sm">
            Name
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            Phone
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            Email (optional)
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </label>
          {type === "DELIVERY" && (
            <label className="block text-sm">
              Delivery address
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2"
              />
            </label>
          )}
          <label className="block text-sm">
            Notes
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </label>
        </section>
      </div>

      <section className="fz-card h-fit space-y-4 p-5">
        <h2 className="font-display text-2xl">Payment</h2>
        <div className="flex flex-wrap gap-2">
          {paymentOptions.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setPaymentMethod(m)}
              className={`rounded-xl border px-4 py-2 text-sm font-semibold capitalize ${
                paymentMethod === m
                  ? "border-[color:var(--fz-mustard)] bg-[color:var(--fz-mustard)] text-[#120d14]"
                  : "border-[color:var(--fz-sand)] bg-[color:var(--fz-elevated)] text-[color:var(--fz-ink)]"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        {type === "DINE_IN" ? (
          <p className="text-xs text-[color:var(--fz-muted)]">
            Dine-in: pay at the counter when ready (Carte-style). Card here is optional simulation.
          </p>
        ) : null}
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatMoney(subtotal)}</dd>
          </div>
          {deliveryFee > 0 && (
            <div className="flex justify-between">
              <dt>Delivery</dt>
              <dd>{formatMoney(deliveryFee)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt>VAT</dt>
            <dd>{formatMoney(vat)}</dd>
          </div>
          <div className="flex justify-between border-t pt-2 text-base font-bold">
            <dt>Total</dt>
            <dd>{formatMoney(total)}</dd>
          </div>
        </dl>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="fz-btn fz-btn-primary w-full py-3 disabled:opacity-60"
        >
          {loading ? "Placing order…" : "Place order"}
        </button>
      </section>
    </form>
  );
}
