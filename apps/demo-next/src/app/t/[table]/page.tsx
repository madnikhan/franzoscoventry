"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

/** Table QR deep link: /t/7 → sets dine-in table and opens menu. */
export default function TableEntryPage() {
  const params = useParams();
  const router = useRouter();
  const { setTableNumber } = useCart();
  const table = String(params.table ?? "").trim();

  useEffect(() => {
    if (!table) {
      router.replace("/menu");
      return;
    }
    setTableNumber(table);
    router.replace(`/menu?table=${encodeURIComponent(table)}`);
  }, [table, setTableNumber, router]);

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <p className="font-display text-3xl text-[color:var(--fz-mustard)]">Table {table}</p>
      <p className="mt-3 text-[color:var(--fz-muted)]">Opening the menu…</p>
    </div>
  );
}
