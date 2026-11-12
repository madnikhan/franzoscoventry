import { Suspense } from "react";
import { MenuClient } from "./MenuClient";
import { PageHeader } from "@/components/PageHeader";
import { PageShell } from "@/components/marketing/PageShell";
import { copyConfig } from "@/lib/data";

export default function MenuPage() {
  return (
    <PageShell>
      <PageHeader title="Our menu" subtitle={copyConfig.tagline} />
      <Suspense fallback={<p className="text-[color:var(--fz-muted)]">Loading menu…</p>}>
        <MenuClient />
      </Suspense>
    </PageShell>
  );
}
