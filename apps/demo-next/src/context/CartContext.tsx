"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartLine } from "@/lib/types";

const STORAGE_KEY = "franzos-demo-cart";

interface CartContextValue {
  lines: CartLine[];
  addItem: (line: Omit<CartLine, "quantity"> & { quantity?: number }) => void;
  updateQuantity: (itemId: string, spiceKey: string, quantity: number) => void;
  removeLine: (itemId: string, spiceKey: string) => void;
  clear: () => void;
  subtotal: number;
  count: number;
}

const CartContext = createContext<CartContextValue | null>(null);

function lineKey(line: CartLine): string {
  const spice = line.customizations?.spice ?? "";
  return `${line.itemId}:${spice}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const addItem = useCallback(
    (line: Omit<CartLine, "quantity"> & { quantity?: number }) => {
      const qty = line.quantity ?? 1;
      setLines((prev) => {
        const key = `${line.itemId}:${line.customizations?.spice ?? ""}`;
        const idx = prev.findIndex((l) => lineKey(l) === key);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
          return next;
        }
        return [...prev, { ...line, quantity: qty }];
      });
    },
    []
  );

  const updateQuantity = useCallback((itemId: string, spiceKey: string, quantity: number) => {
    setLines((prev) =>
      prev
        .map((l) =>
          lineKey(l) === `${itemId}:${spiceKey}` ? { ...l, quantity } : l
        )
        .filter((l) => l.quantity > 0)
    );
  }, []);

  const removeLine = useCallback((itemId: string, spiceKey: string) => {
    setLines((prev) => prev.filter((l) => lineKey(l) !== `${itemId}:${spiceKey}`));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const subtotal = useMemo(
    () => lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0),
    [lines]
  );
  const count = useMemo(() => lines.reduce((s, l) => s + l.quantity, 0), [lines]);

  const value = useMemo(
    () => ({ lines, addItem, updateQuantity, removeLine, clear, subtotal, count }),
    [lines, addItem, updateQuantity, removeLine, clear, subtotal, count]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
