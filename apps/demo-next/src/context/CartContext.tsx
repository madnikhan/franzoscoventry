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
const TABLE_KEY = "franzos-demo-table";

interface CartContextValue {
  lines: CartLine[];
  tableNumber: string | null;
  setTableNumber: (table: string | null) => void;
  addItem: (line: Omit<CartLine, "quantity"> & { quantity?: number }) => void;
  updateQuantity: (itemId: string, lineKey: string, quantity: number) => void;
  removeLine: (itemId: string, lineKey: string) => void;
  clear: () => void;
  subtotal: number;
  count: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function cartLineKey(line: CartLine): string {
  const c = line.customizations ?? {};
  const keys = Object.keys(c).sort();
  const custom = keys.map((k) => `${k}=${c[k]}`).join("&");
  return `${line.itemId}:${custom}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [tableNumber, setTableNumberState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
      const table = localStorage.getItem(TABLE_KEY);
      if (table) setTableNumberState(table);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (tableNumber) localStorage.setItem(TABLE_KEY, tableNumber);
    else localStorage.removeItem(TABLE_KEY);
  }, [tableNumber, hydrated]);

  const setTableNumber = useCallback((table: string | null) => {
    const cleaned = table?.trim().replace(/[^\w-]/g, "") || null;
    setTableNumberState(cleaned);
  }, []);

  const addItem = useCallback(
    (line: Omit<CartLine, "quantity"> & { quantity?: number }) => {
      const qty = line.quantity ?? 1;
      const nextLine: CartLine = {
        ...line,
        quantity: qty,
        customizations: line.customizations ?? {},
      };
      setLines((prev) => {
        const key = cartLineKey(nextLine);
        const idx = prev.findIndex((l) => cartLineKey(l) === key);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
          return next;
        }
        return [...prev, nextLine];
      });
    },
    []
  );

  const updateQuantity = useCallback((itemId: string, key: string, quantity: number) => {
    setLines((prev) =>
      prev
        .map((l) => (cartLineKey(l) === key || (l.itemId === itemId && cartLineKey(l) === key) ? { ...l, quantity } : l))
        .filter((l) => l.quantity > 0)
    );
  }, []);

  const removeLine = useCallback((_itemId: string, key: string) => {
    setLines((prev) => prev.filter((l) => cartLineKey(l) !== key));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const subtotal = useMemo(
    () => lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0),
    [lines]
  );
  const count = useMemo(() => lines.reduce((s, l) => s + l.quantity, 0), [lines]);

  const value = useMemo(
    () => ({
      lines,
      tableNumber,
      setTableNumber,
      addItem,
      updateQuantity,
      removeLine,
      clear,
      subtotal,
      count,
    }),
    [lines, tableNumber, setTableNumber, addItem, updateQuantity, removeLine, clear, subtotal, count]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
