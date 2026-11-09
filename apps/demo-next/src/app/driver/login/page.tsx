import { DriverLoginClient } from "./DriverLoginClient";
import { PageHeader } from "@/components/PageHeader";

export default function DriverLoginPage() {
  return (
    <div className="max-w-md">
      <PageHeader title="Driver login" subtitle="Demo: +447700900001 / driver123" />
      <DriverLoginClient />
    </div>
  );
}
