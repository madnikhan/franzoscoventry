"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { businessConfig } from "@/lib/data";
import { formatMoney } from "@/lib/format";
import type { OrderType } from "@/lib/types";

export function OrderClient() {
  const { lines, subtotal, clear, updateQuantity, removeLine } = useCart();
  const router = useRouter();
  const [type, setType] = useState<OrderType>("COLLECTION");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deliveryFee = type === "DELIVERY" ? businessConfig.delivery.fee : 0;
  const vat = (subtotal + deliveryFee) * (businessConfig.vatRate ?? 0);
  const total = subtotal + deliveryFee + vat;

  const paymentOptions = useMemo(() => {
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
        <Link href="/menu" className="fz-btn fz-btn-primary mt-4 inline-block">
          Browse menu
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid min-w-0 gap-8 lg:grid-cols-2">
      <div className="min-w-0 space-y-4">
        <section className="fz-card p-5">
          <h2 className="font-display text-2xl">Your order</h2>
          <ul className="mt-4 space-y-3">
            {lines.map((line) => {
              const spice = line.customizations?.spice ?? "";
              return (
                <li
                  key={`${line.itemId}:${spice}`}
                  className="flex min-w-0 flex-wrap items-center gap-2 text-sm sm:flex-nowrap sm:gap-3"
                >
                  <div className="min-w-0 flex-1 basis-full sm:basis-auto">
                    <p className="truncate font-semibold">{line.name}</p>
                    {spice && (
                      <p className="text-[color:var(--fz-muted)] capitalize">Spice: {spice}</p>
                    )}
                  </div>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={line.quantity}
                    onChange={(e) =>
                      updateQuantity(line.itemId, spice, parseInt(e.target.value, 10) || 1)
                    }
                    className="w-14 shrink-0 rounded border px-1 py-0.5"
                  />
                  <p className="w-20 shrink-0 text-right font-medium">
                    {formatMoney(line.unitPrice * line.quantity)}
                  </p>
                  <button
                    type="button"
                    className="shrink-0 text-[color:var(--fz-flame)]"
                    onClick={() => removeLine(line.itemId, spice)}
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
          <div className="flex gap-2">
            {(["COLLECTION", "DELIVERY"] as OrderType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold ${
                  type === t
                    ? "border-[color:var(--fz-flame)] bg-[color:var(--fz-flame)] text-white"
                    : "border-[color:var(--fz-sand)]"
                }`}
              >
                {t === "DELIVERY" ? "Delivery" : "Collection"}
              </button>
            ))}
          </div>
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
                  ? "border-[color:var(--fz-char)] bg-[color:var(--fz-char)] text-white"
                  : "border-[color:var(--fz-sand)]"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
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
        {paymentMethod === "card" && (
          <p className="text-xs text-[color:var(--fz-muted)]">
            SumUp simulation — payment marked complete without SUMUP_API_KEY.
          </p>
        )}
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
