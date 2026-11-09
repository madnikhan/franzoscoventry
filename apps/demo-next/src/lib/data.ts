import business from "@/data/business.json";
import copy from "@/data/copy.json";
import domain from "@/data/domain.json";
import menuSeed from "@/data/menu.seed.json";
import type { MenuCategory, MenuItem } from "./types";

export type BusinessConfig = typeof business;
export type CopyConfig = typeof copy;
export type DomainConfig = typeof domain;

export interface MenuSeed {
  spiceLevels: { id: string; name: string; priceDelta: number }[];
  categories: MenuCategory[];
}

export const businessConfig = business as BusinessConfig;
export const copyConfig = copy as CopyConfig;
export const domainConfig = domain as DomainConfig;
export const menuData = menuSeed as MenuSeed;

export function getMenuCategories(): MenuCategory[] {
  return [...menuData.categories].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function findMenuItem(itemId: string): MenuItem | undefined {
  for (const cat of menuData.categories) {
    const item = cat.items.find((i) => i.id === itemId);
    if (item) return item;
  }
  return undefined;
}

export function allMenuItems(): MenuItem[] {
  return menuData.categories.flatMap((c) => c.items);
}
