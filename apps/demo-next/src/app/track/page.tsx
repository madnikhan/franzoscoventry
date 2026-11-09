"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { PageShell } from "@/components/marketing/PageShell";

export default function TrackPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (orderNumber.trim()) router.push(`/track/${orderNumber.trim().toUpperCase()}`);
  }

  return (
    <PageShell>
      <div className="max-w-lg">
        <PageHeader title="Track your order" subtitle="Enter your Franzos order number (e.g. FZ1001)." />
        <form onSubmit={onSubmit} className="fz-card space-y-4 p-6">
          <label className="block text-sm font-medium">
            Order number
            <input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="FZ1001"
              className="mt-1 w-full rounded-lg border-[3px] border-[color:var(--fz-outline)] px-3 py-2 uppercase"
            />
          </label>
          <button type="submit" className="fz-btn fz-btn-primary w-full py-2.5">
            Track
          </button>
        </form>
      </div>
    </PageShell>
  );
}
