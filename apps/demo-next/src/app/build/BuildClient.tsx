"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import {
  BUILDER_BASE_PRICE,
  BUILDER_GROUPS,
  BUILDER_ITEM_ID,
  BUILDER_ITEM_NAME,
  builderSummary,
  builderUnitPrice,
} from "@/lib/builder";
import { formatMoney } from "@/lib/format";

const DEFAULTS: Record<string, string | string[]> = {
  bun: "brioche",
  patty: "single",
  cheese: "american",
  sauce: "franzos",
  extras: [],
};

export function BuildClient() {
  const { addItem } = useCart();
  const router = useRouter();
  const [sel, setSel] = useState<Record<string, string | string[]>>(DEFAULTS);

  const price = useMemo(() => builderUnitPrice(sel), [sel]);
  const summary = useMemo(() => builderSummary(sel), [sel]);

  function setSingle(groupId: string, optionId: string) {
    setSel((s) => ({ ...s, [groupId]: optionId }));
  }

  function toggleExtra(optionId: string) {
    setSel((s) => {
      const cur = Array.isArray(s.extras) ? [...s.extras] : [];
      const i = cur.indexOf(optionId);
      if (i >= 0) cur.splice(i, 1);
      else cur.push(optionId);
      return { ...s, extras: cur };
    });
  }

  function addToCart() {
    const customizations: Record<string, string> = { builder: "1" };
    for (const g of BUILDER_GROUPS) {
      const raw = sel[g.id];
      if (!raw) continue;
      if (Array.isArray(raw)) {
        const labels = raw
          .map((id) => g.options.find((o) => o.id === id)?.label)
          .filter(Boolean) as string[];
        if (labels.length) customizations[g.id] = labels.join(", ");
      } else {
        const opt = g.options.find((o) => o.id === raw);
        customizations[g.id] = opt?.label ?? raw;
      }
    }
    addItem({
      itemId: BUILDER_ITEM_ID,
      name: BUILDER_ITEM_NAME,
      unitPrice: price,
      quantity: 1,
      customizations,
    });
    router.push("/order");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        {BUILDER_GROUPS.map((group) => (
          <section key={group.id} className="fz-card p-5">
            <h2 className="font-display text-2xl text-[color:var(--fz-mustard)]">{group.label}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {group.options.map((opt) => {
                const selected = Array.isArray(sel[group.id])
                  ? (sel[group.id] as string[]).includes(opt.id)
                  : sel[group.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      group.id === "extras" ? toggleExtra(opt.id) : setSingle(group.id, opt.id)
                    }
                    className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition ${
                      selected
                        ? "border-[color:var(--fz-tomato)] bg-[color:var(--fz-tomato)] text-[#fff6ee]"
                        : "border-[color:var(--fz-outline)] bg-[color:var(--fz-elevated)] text-[color:var(--fz-ink)]"
                    }`}
                  >
                    {opt.label}
                    {opt.priceDelta > 0 ? ` (+${formatMoney(opt.priceDelta)})` : ""}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <aside className="fz-card h-fit space-y-4 p-5 lg:sticky lg:top-[var(--fz-nav-sticky)]">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--fz-muted)]">
          Your build
        </p>
        <h2 className="font-display text-3xl">{BUILDER_ITEM_NAME}</h2>
        <p className="text-sm text-[color:var(--fz-muted)]">
          From {formatMoney(BUILDER_BASE_PRICE)} · layer it your way
        </p>
        <ul className="space-y-1 text-sm">
          {summary.map((line) => (
            <li
              key={line}
              className={
                line.startsWith("+")
                  ? "text-[color:var(--fz-mustard)]"
                  : line.startsWith("−")
                    ? "text-[color:var(--fz-rose)]"
                    : "text-[color:var(--fz-ink)]"
              }
            >
              {line}
            </li>
          ))}
        </ul>
        <p className="font-display text-3xl text-[color:var(--fz-mustard)]">{formatMoney(price)}</p>
        <button type="button" onClick={addToCart} className="fz-btn fz-btn-primary w-full py-3">
          Add to cart
        </button>
        <Link href="/menu" className="block text-center text-sm font-semibold underline">
          Back to menu
        </Link>
      </aside>
    </div>
  );
}
