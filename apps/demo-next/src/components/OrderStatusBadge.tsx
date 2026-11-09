import { formatOrderStatus } from "@/lib/format";

const tone: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-900",
  CONFIRMED: "bg-sky-100 text-sky-900",
  PREPARING: "bg-orange-100 text-orange-900",
  READY_FOR_PICKUP: "bg-lime-100 text-lime-900",
  OUT_FOR_DELIVERY: "bg-violet-100 text-violet-900",
  DELIVERED: "bg-emerald-100 text-emerald-900",
  CANCELLED: "bg-zinc-200 text-zinc-700",
};

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${tone[status] ?? "bg-zinc-100"}`}
    >
      {formatOrderStatus(status)}
    </span>
  );
}
