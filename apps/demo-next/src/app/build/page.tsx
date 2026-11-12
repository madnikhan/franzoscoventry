import { PageHeader } from "@/components/PageHeader";
import { PageShell } from "@/components/marketing/PageShell";
import { BuildClient } from "./BuildClient";

export default function BuildPage() {
  return (
    <PageShell>
      <PageHeader
        title="Build your smash"
        subtitle="Pick bun, patty, cheese, sauce and extras — kitchen sees every choice."
      />
      <BuildClient />
    </PageShell>
  );
}
