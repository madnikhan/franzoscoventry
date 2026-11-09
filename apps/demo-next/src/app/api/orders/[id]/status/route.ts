import { NextResponse } from "next/server";
import { getOrderStore } from "@/lib/store";
import type { OrderStatus } from "@/lib/types";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await request.json()) as { status: OrderStatus; driverId?: string };
  if (!body.status) {
    return NextResponse.json({ error: "status required" }, { status: 400 });
  }
  try {
    const order = getOrderStore().updateStatus(id, body.status, body.driverId);
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ order });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
