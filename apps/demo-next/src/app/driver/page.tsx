import { DriverClient } from "./DriverClient";
import { PageHeader } from "@/components/PageHeader";

export default function DriverPage() {
  return (
    <div>
      <PageHeader title="Driver" subtitle="Accept deliveries and mark completed." />
      <DriverClient />
    </div>
  );
}
