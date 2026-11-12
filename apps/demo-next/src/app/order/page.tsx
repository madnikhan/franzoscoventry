import { Suspense } from "react";
import { OrderClient } from "./OrderClient";
import { PageHeader } from "@/components/PageHeader";
import { PageShell } from "@/components/marketing/PageShell";

export default function OrderPage() {
  return (
    <PageShell>
      <PageHeader
        title="Checkout"
        subtitle="Delivery, collection, dine-in, or pay at till — guest checkout."
      />
      <Suspense fallback={<p className="text-[color:var(--fz-muted)]">Loading checkout…</p>}>
        <OrderClient />
      </Suspense>
    </PageShell>
  );
}
