import { PageHeader } from "@/components/PageHeader";
import { PageShell } from "@/components/marketing/PageShell";
import { businessConfig, copyConfig } from "@/lib/data";

export default function AboutPage() {
  return (
    <PageShell>
      <article className="max-w-3xl">
        <PageHeader title="About Franzos" subtitle={copyConfig.tagline} />
        <div className="fz-card space-y-4 p-6 text-[color:var(--fz-outline)]">
          <p className="text-lg">{copyConfig.about}</p>
          <p className="font-bold text-[color:var(--fz-leaf)]">{copyConfig.halalNote}</p>
          <p className="text-sm font-semibold text-[color:var(--fz-muted)]">
            {businessConfig.address.line1}, {businessConfig.address.city}{" "}
            {businessConfig.address.postcode}
          </p>
        </div>
      </article>
    </PageShell>
  );
}
