import { OrderClient } from "./OrderClient";
import { PageHeader } from "@/components/PageHeader";
import { PageShell } from "@/components/marketing/PageShell";

export default function OrderPage() {
  return (
    <PageShell>
      <PageHeader
        title="Checkout"
        subtitle="Delivery, collection, or pay at till — guest checkout."
      />
      <OrderClient />
    </PageShell>
  );
}
