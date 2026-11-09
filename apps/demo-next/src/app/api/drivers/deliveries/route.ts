import { NextResponse } from "next/server";
import { getOrderStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const driverId = searchParams.get("driverId");
  const store = getOrderStore();
  const orders = store.list().filter((o) => {
    if (o.type !== "DELIVERY") return false;
    if (o.status === "READY_FOR_PICKUP" || o.status === "OUT_FOR_DELIVERY") return true;
    if (driverId && o.driverId === driverId) return o.status !== "DELIVERED";
    return false;
  });
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    orderId: string;
    action: "accept" | "delivered";
    driverId: string;
  };
  const store = getOrderStore();
  if (body.action === "accept") {
    const order = store.assignDriver(body.orderId, body.driverId);
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    store.updateStatus(body.orderId, "OUT_FOR_DELIVERY", body.driverId);
    return NextResponse.json({ order: store.getById(body.orderId) });
  }
  if (body.action === "delivered") {
    const order = store.updateStatus(body.orderId, "DELIVERED", body.driverId);
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ order });
  }
  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
