import { NextResponse } from "next/server";
import { getOrderStore } from "@/lib/store";
import { createSumUpCheckout } from "@/lib/sumup";

export async function POST(request: Request) {
  const body = (await request.json()) as { orderId: string; amount?: number };
  if (!body.orderId) {
    return NextResponse.json({ error: "orderId required" }, { status: 400 });
  }
  const order = getOrderStore().getById(body.orderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const checkout = await createSumUpCheckout({
    amount: body.amount ?? order.total,
    orderId: order.id,
    description: `Franzos ${order.orderNumber}`,
  });

  order.paymentStatus = checkout.status;
  getOrderStore().persist();

  return NextResponse.json({ checkout, order });
}
