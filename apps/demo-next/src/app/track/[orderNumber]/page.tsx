import { TrackOrderClient } from "./TrackOrderClient";
import { PageHeader } from "@/components/PageHeader";
import { PageShell } from "@/components/marketing/PageShell";

export default async function TrackOrderPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  return (
    <PageShell>
      <PageHeader title={`Order ${orderNumber.toUpperCase()}`} />
      <TrackOrderClient orderNumber={orderNumber} />
    </PageShell>
  );
}
