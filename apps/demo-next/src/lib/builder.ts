/** Build-your-own Smash Burger configurator (Carte-style single hero item). */

export const BUILDER_ITEM_ID = "beef-smash";
export const BUILDER_ITEM_NAME = "Build Your Smash Burger";
export const BUILDER_BASE_PRICE = 8.95;

export type BuilderGroup = {
  id: string;
  label: string;
  required: boolean;
  options: { id: string; label: string; priceDelta: number }[];
};

export const BUILDER_GROUPS: BuilderGroup[] = [
  {
    id: "bun",
    label: "Bun",
    required: true,
    options: [
      { id: "brioche", label: "Brioche", priceDelta: 0 },
      { id: "sesame", label: "Sesame", priceDelta: 0 },
      { id: "gluten-free", label: "Gluten-free", priceDelta: 0.5 },
    ],
  },
  {
    id: "patty",
    label: "Patty",
    required: true,
    options: [
      { id: "single", label: "Single smash", priceDelta: 0 },
      { id: "double", label: "Double smash", priceDelta: 2.5 },
    ],
  },
  {
    id: "cheese",
    label: "Cheese",
    required: true,
    options: [
      { id: "none", label: "No cheese", priceDelta: 0 },
      { id: "american", label: "American", priceDelta: 0.4 },
      { id: "cheddar", label: "Mature cheddar", priceDelta: 0.6 },
    ],
  },
  {
    id: "sauce",
    label: "Sauce",
    required: true,
    options: [
      { id: "franzos", label: "Franzos secret", priceDelta: 0 },
      { id: "peri", label: "Peri mayo", priceDelta: 0 },
      { id: "garlic", label: "Garlic aioli", priceDelta: 0 },
    ],
  },
  {
    id: "extras",
    label: "Extras",
    required: false,
    options: [
      { id: "bacon", label: "Crispy bacon", priceDelta: 1.5 },
      { id: "jalapeno", label: "Jalapeños", priceDelta: 0.5 },
      { id: "pickles", label: "Pickles", priceDelta: 0 },
      { id: "onion", label: "Caramelised onion", priceDelta: 0.6 },
    ],
  },
];

export function builderUnitPrice(selections: Record<string, string | string[]>): number {
  let total = BUILDER_BASE_PRICE;
  for (const group of BUILDER_GROUPS) {
    const raw = selections[group.id];
    if (!raw) continue;
    const ids = Array.isArray(raw) ? raw : [raw];
    for (const id of ids) {
      const opt = group.options.find((o) => o.id === id);
      if (opt) total += opt.priceDelta;
    }
  }
  return Math.round(total * 100) / 100;
}

export function builderSummary(selections: Record<string, string | string[]>): string[] {
  const lines: string[] = [];
  for (const group of BUILDER_GROUPS) {
    const raw = selections[group.id];
    if (!raw) continue;
    const ids = Array.isArray(raw) ? raw : [raw];
    for (const id of ids) {
      const opt = group.options.find((o) => o.id === id);
      if (!opt) continue;
      if (opt.id === "none") {
        lines.push(`− ${group.label}: none`);
      } else if (opt.priceDelta > 0) {
        lines.push(`+ ${opt.label}`);
      } else {
        lines.push(opt.label);
      }
    }
  }
  return lines;
}
