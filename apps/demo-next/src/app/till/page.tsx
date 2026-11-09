import { TillClient } from "./TillClient";
import { PageHeader } from "@/components/PageHeader";

export default function TillPage() {
  return (
    <div>
      <PageHeader title="Till / POS" subtitle="Quick walk-in orders — cash or card." />
      <TillClient />
    </div>
  );
}
