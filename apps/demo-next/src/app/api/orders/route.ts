import { NextResponse } from "next/server";
import { getOrderStore } from "@/lib/store";
import { createSumUpCheckout } from "@/lib/sumup";
import type { CreateOrderPayload, PaymentStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const type = searchParams.get("type");
  let orders = getOrderStore().list();
  if (status) {
    const set = new Set(status.split(","));
    orders = orders.filter((o) => set.has(o.status));
  }
  if (type) orders = orders.filter((o) => o.type === type);
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const body = (await request.json()) as CreateOrderPayload & { payWithCard?: boolean };
  if (!body.items?.length || !body.customerName || !body.customerPhone) {
    return NextResponse.json({ error: "Invalid order payload" }, { status: 400 });
  }
  if (body.type === "DELIVERY" && !body.address) {
    return NextResponse.json({ error: "Delivery address required" }, { status: 400 });
  }

  const store = getOrderStore();
  const useCard = body.paymentMethod === "card" || body.paymentMethod === "sumup";
  let paymentStatus: PaymentStatus = "COMPLETED";

  const order = store.create(body, useCard ? "PENDING" : "COMPLETED");

  if (useCard || body.payWithCard) {
    const checkout = await createSumUpCheckout({
      amount: order.total,
      orderId: order.id,
      description: `Franzos ${order.orderNumber}`,
    });
    paymentStatus = checkout.status;
    order.paymentStatus = checkout.status;
    store.persist();
    return NextResponse.json({ order, checkout });
  }

  order.paymentStatus = paymentStatus;
  store.persist();
  return NextResponse.json({ order });
}
