"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import { businessConfig, getMenuCategories, menuData } from "@/lib/data";
import { formatMoney } from "@/lib/format";
import type { MenuItem } from "@/lib/types";

export function MenuClient() {
  const categories = useMemo(() => getMenuCategories(), []);
  const [active, setActive] = useState(categories[0]?.id ?? "");
  const [spiceByItem, setSpiceByItem] = useState<Record<string, string>>({});
  const { addItem } = useCart();

  const activeCategory = categories.find((c) => c.id === active);
  const items = activeCategory?.items ?? [];

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
    <div className="relative grid gap-6 lg:grid-cols-[minmax(11.5rem,14rem)_minmax(0,1fr)] lg:items-start lg:gap-10">
      <aside className="sticky top-[calc(14vw+3.25rem)] z-20 -mx-4 bg-[color:var(--fz-cream)]/95 backdrop-blur-sm max-md:border-b max-md:border-[color:var(--fz-outline)]/15 md:top-24 lg:mx-0 lg:self-start lg:border-0 lg:bg-transparent lg:backdrop-blur-none">
        <p className="px-4 pb-2 pt-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--fz-muted)] lg:px-0">
          Categories
        </p>
        <nav
          aria-label="Menu categories"
          className="flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none] snap-x snap-mandatory [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-1 lg:gap-2 lg:overflow-visible lg:px-0 lg:pb-0"
        >
          {categories.map((cat) => {
            const selected = active === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActive(cat.id)}
                aria-pressed={selected}
                className={`snap-start shrink-0 rounded-full border-[3px] border-[color:var(--fz-outline)] px-3.5 py-2 text-sm font-bold shadow-[3px_3px_0_var(--fz-outline)] transition lg:w-full lg:px-4 lg:text-left lg:text-base ${
                  selected
                    ? "bg-[color:var(--fz-tomato)] text-white"
                    : "bg-white text-[color:var(--fz-outline)] hover:bg-[color:var(--fz-mustard)]"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="min-w-0">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-3xl text-[color:var(--fz-char)] md:text-4xl">
            {activeCategory?.name ?? "Menu"}
          </h2>
          <a
            href={`tel:${businessConfig.phoneE164}`}
            className="inline-flex items-center gap-2 rounded-full border-[3px] border-[color:var(--fz-outline)] bg-[color:var(--fz-mustard)] px-4 py-2 text-sm font-bold text-[color:var(--fz-outline)] shadow-[3px_3px_0_var(--fz-outline)] md:hidden"
          >
            Call to order
          </a>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.id} className="fz-card flex flex-col overflow-hidden">
              {item.image ? (
                <div className="relative aspect-[5/4] overflow-hidden bg-[color:var(--fz-cream)]">
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
                </div>
              ) : null}
              <div className="flex flex-1 flex-col p-4 md:p-5">
                <h3 className="font-display text-2xl leading-tight">{item.name}</h3>
                <p className="mt-2 flex-1 text-sm text-[color:var(--fz-muted)]">
                  {item.description}
                </p>
                <p className="mt-3 font-semibold text-[color:var(--fz-char)]">
                  {formatMoney(item.price)}
                </p>
                {item.spiceSelectable && (
                  <label className="mt-3 block text-sm">
                    <span className="font-medium">Spice level</span>
                    <select
                      className="mt-1 w-full rounded-lg border border-[color:var(--fz-sand)] bg-white px-3 py-2"
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
                <div className="mt-4 flex gap-2">
                  <a
                    href={`tel:${businessConfig.phoneE164}`}
                    className="fz-btn flex-1 bg-white text-center text-sm text-[color:var(--fz-outline)] md:hidden"
                  >
                    Call
                  </a>
                  <button
                    type="button"
                    disabled={!item.isAvailable}
                    onClick={() => addToCart(item)}
                    className="fz-btn fz-btn-primary flex-1 disabled:opacity-50 md:w-full"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
