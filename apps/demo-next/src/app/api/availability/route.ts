import { NextResponse } from "next/server";
import { getAvailabilityMap, setItemAvailable } from "@/lib/availability";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ availability: getAvailabilityMap() });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as { itemId?: string; available?: boolean };
  if (!body.itemId || typeof body.available !== "boolean") {
    return NextResponse.json({ error: "itemId and available required" }, { status: 400 });
  }
  const availability = setItemAvailable(body.itemId, body.available);
  return NextResponse.json({ availability });
}
