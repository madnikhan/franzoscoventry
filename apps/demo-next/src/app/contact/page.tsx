import { PageHeader } from "@/components/PageHeader";
import { PageShell } from "@/components/marketing/PageShell";
import { businessConfig } from "@/lib/data";

export default function ContactPage() {
  return (
    <PageShell>
      <div className="max-w-xl">
        <PageHeader title="Contact" subtitle="Questions about your order or visiting us?" />
        <div className="fz-card space-y-4 p-6 text-lg">
          <p>
            <span className="font-bold">Phone: </span>
            <a href={`tel:${businessConfig.phoneE164}`} className="text-[color:var(--fz-tomato)]">
              {businessConfig.phone}
            </a>
          </p>
          {businessConfig.emails.map((email) => (
            <p key={email}>
              <span className="font-bold">Email: </span>
              <a href={`mailto:${email}`} className="text-[color:var(--fz-tomato)]">
                {email}
              </a>
            </p>
          ))}
          <p>
            <span className="font-bold">Address: </span>
            {businessConfig.address.line1}, {businessConfig.address.city}{" "}
            {businessConfig.address.postcode}
          </p>
          {businessConfig.social.facebook && (
            <p>
              <a
                href={businessConfig.social.facebook}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[color:var(--fz-tomato)] underline"
              >
                Facebook
              </a>
            </p>
          )}
        </div>
      </div>
    </PageShell>
  );
}
