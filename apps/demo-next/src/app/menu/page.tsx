import { MenuClient } from "./MenuClient";
import { PageHeader } from "@/components/PageHeader";
import { PageShell } from "@/components/marketing/PageShell";
import { copyConfig } from "@/lib/data";

export default function MenuPage() {
  return (
    <PageShell>
      <PageHeader title="Our menu" subtitle={copyConfig.tagline} />
      <MenuClient />
    </PageShell>
  );
}
