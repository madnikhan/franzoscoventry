import { AdminClient } from "./AdminClient";
import { PageHeader } from "@/components/PageHeader";

export default function AdminPage() {
  return (
    <div>
      <PageHeader title="Admin" subtitle="Demo stats & recent orders." />
      <AdminClient />
    </div>
  );
}
