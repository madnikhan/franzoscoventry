import { KitchenClient } from "./KitchenClient";
import { PageHeader } from "@/components/PageHeader";

export default function KitchenPage() {
  return (
    <div>
      <PageHeader
        title="Kitchen display"
        subtitle="Pending & preparing tickets — auto-refresh every 5s."
      />
      <KitchenClient />
    </div>
  );
}
