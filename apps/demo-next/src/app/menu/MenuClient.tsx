"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { businessConfig, getMenuCategories, menuData } from "@/lib/data";
import { BUILDER_ITEM_ID } from "@/lib/builder";
import { formatMoney } from "@/lib/format";
import type { MenuItem } from "@/lib/types";

export function MenuClient() {
  const categories = useMemo(() => getMenuCategories(), []);
  const [active, setActive] = useState(categories[0]?.id ?? "");
  const [spiceByItem, setSpiceByItem] = useState<Record<string, string>>({});
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const { addItem, tableNumber, setTableNumber } = useCart();
  const searchParams = useSearchParams();

  useEffect(() => {
    const t = searchParams.get("table")?.trim();
    if (t) setTableNumber(t);
  }, [searchParams, setTableNumber]);

  useEffect(() => {
    let cancelled = false;
    async function loadAvailability() {
      const res = await fetch("/api/availability", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (!cancelled) setAvailability(data.availability ?? {});
    }
    loadAvailability();
    const id = setInterval(loadAvailability, 15000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const activeCategory = categories.find((c) => c.id === active);
  const items = activeCategory?.items ?? [];

  function isAvailable(item: MenuItem) {
    if (item.id in availability) return availability[item.id] !== false;
    return item.isAvailable !== false;
  }

  function addToCart(item: MenuItem) {
    const spice = item.spiceSelectable
      ? spiceByItem[item.id] ?? menuData.spiceLevels[1]?.id ?? "medium"
      : undefined;
    addItem({
      itemId: item.id,
      name: item.name,
      unitPrice: item.price,
      quantity: 1,
      customizations: spice ? { spice } : {},
    });
  }

  return (
    <div className="relative grid min-w-0 w-full max-w-full gap-6 lg:grid-cols-[minmax(11.5rem,14rem)_minmax(0,1fr)] lg:items-start lg:gap-10">
      <aside className="sticky top-[var(--fz-nav-sticky)] z-20 -mx-4 min-w-0 w-full max-w-full overflow-hidden bg-[color:var(--fz-canvas)]/95 backdrop-blur-sm max-md:border-b max-md:border-[color:var(--fz-outline)]/30 lg:mx-0 lg:self-start lg:border-0 lg:bg-transparent lg:backdrop-blur-none">
        <p className="px-4 pb-2 pt-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--fz-muted)] lg:px-0">
          Categories
        </p>
        <nav
          aria-label="Menu categories"
          className="flex gap-2 overflow-x-auto overscroll-x-contain px-4 pb-3 [scrollbar-width:none] snap-x snap-mandatory [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-1 lg:gap-2 lg:overflow-visible lg:px-0 lg:pb-0"
        >
          {categories.map((cat) => {
            const selected = active === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActive(cat.id)}
                aria-pressed={selected}
                className={`snap-start shrink-0 rounded-full border-2 border-[color:var(--fz-outline)] px-3.5 py-2 text-sm font-bold shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition lg:w-full lg:px-4 lg:text-left lg:text-base ${
                  selected
                    ? "bg-[color:var(--fz-tomato)] text-[#fff6ee]"
                    : "bg-[color:var(--fz-surface)] text-[color:var(--fz-ink)] hover:bg-[color:var(--fz-mustard)] hover:text-[#120d14]"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="min-w-0">
        {tableNumber ? (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[color:var(--fz-mustard)]/40 bg-[color:var(--fz-elevated)] px-4 py-3">
            <p className="font-display text-xl text-[color:var(--fz-mustard)]">
              Table {tableNumber}
            </p>
            <Link href="/order" className="text-sm font-bold underline">
              Go to checkout
            </Link>
          </div>
        ) : null}

        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <h2 className="min-w-0 font-display text-3xl text-[color:var(--fz-char)] md:text-4xl">
            {activeCategory?.name ?? "Menu"}
          </h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/build" className="fz-btn fz-btn-primary px-4 py-2 text-sm">
              Build your smash
            </Link>
            <a
              href={`tel:${businessConfig.phoneE164}`}
              className="inline-flex items-center gap-2 rounded-full border-2 border-[color:var(--fz-outline)] bg-[color:var(--fz-mustard)] px-4 py-2 text-sm font-bold text-[#120d14] shadow-[0_8px_20px_rgba(0,0,0,0.35)] md:hidden"
            >
              Call to order
            </a>
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((item) => {
            const available = isAvailable(item);
            const isBuilderHero = item.id === BUILDER_ITEM_ID;
            return (
              <li key={item.id} className="fz-card flex min-w-0 flex-col overflow-hidden">
                {item.image ? (
                  <div className="relative aspect-[4/3] overflow-hidden bg-[color:var(--fz-elevated)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt=""
                      className={`h-full w-full ${
                        item.image.endsWith(".png")
                          ? "object-contain p-3"
                          : "object-cover"
                      }`}
                      loading="lazy"
                    />
                    {!available ? (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-sm font-bold uppercase tracking-wide text-[#fff6ee]">
                        Sold out
                      </span>
                    ) : null}
                  </div>
                ) : null}
                <div className="flex min-w-0 flex-1 flex-col p-4 md:p-5">
                  <h3 className="min-w-0 break-words font-display text-xl leading-tight text-[color:var(--fz-ink)] md:text-2xl">
                    {item.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-[color:var(--fz-muted)]">
                    {item.description}
                  </p>
                  <p className="mt-3 font-semibold text-[color:var(--fz-mustard)]">
                    {formatMoney(item.price)}
                  </p>
                  {item.spiceSelectable && available && (
                    <label className="mt-3 block text-sm text-[color:var(--fz-rose)]">
                      <span className="font-medium">Spice level</span>
                      <select
                        className="mt-1 w-full rounded-lg border border-[color:var(--fz-sand)] bg-[color:var(--fz-elevated)] px-3 py-2 text-[color:var(--fz-ink)]"
                        value={spiceByItem[item.id] ?? "medium"}
                        onChange={(e) =>
                          setSpiceByItem((s) => ({ ...s, [item.id]: e.target.value }))
                        }
                      >
                        {menuData.spiceLevels.map((lvl) => (
                          <option key={lvl.id} value={lvl.id}>
                            {lvl.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <a
                      href={`tel:${businessConfig.phoneE164}`}
                      className="fz-btn flex-1 bg-[color:var(--fz-elevated)] px-4 py-2 text-center text-sm text-[color:var(--fz-ink)] md:hidden"
                    >
                      Call
                    </a>
                    {isBuilderHero ? (
                      <Link
                        href="/build"
                        className="fz-btn fz-btn-primary flex-1 px-4 py-2 text-center disabled:opacity-50 md:w-full"
                        aria-disabled={!available}
                        onClick={(e) => {
                          if (!available) e.preventDefault();
                        }}
                      >
                        Build yours
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled={!available}
                        onClick={() => addToCart(item)}
                        className="fz-btn fz-btn-primary flex-1 px-4 py-2 disabled:opacity-50 md:w-full"
                      >
                        {available ? "Add to cart" : "Sold out"}
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
