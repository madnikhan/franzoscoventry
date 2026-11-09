import { PageHeader } from "@/components/PageHeader";
import { PageShell } from "@/components/marketing/PageShell";
import { businessConfig } from "@/lib/data";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export default function OpeningHoursPage() {
  return (
    <PageShell>
      <div className="max-w-md">
        <PageHeader title="Opening hours" />
        <table className="fz-card w-full text-left text-base">
          <tbody>
            {DAYS.map((day) => {
              const h = businessConfig.hours[day];
              return (
                <tr key={day} className="border-b-[3px] border-[color:var(--fz-sand)] last:border-0">
                  <th className="px-4 py-3 font-bold capitalize">{day}</th>
                  <td className="px-4 py-3 font-semibold">
                    {h.open} – {h.close}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
