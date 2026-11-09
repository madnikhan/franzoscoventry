import { NextResponse } from "next/server";

/** Cart is client-side (CartContext + localStorage). This endpoint acknowledges sync. */
export async function GET() {
  return NextResponse.json({ mode: "client", message: "Use CartProvider on the client." });
}

export async function POST() {
  return NextResponse.json({ ok: true });
}
