import { NextResponse } from "next/server";
import { authenticateDriver } from "@/lib/drivers";

export async function POST(request: Request) {
  const body = (await request.json()) as { phone: string; password: string };
  const session = authenticateDriver(body.phone ?? "", body.password ?? "");
  if (!session) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  return NextResponse.json({ driver: session });
}
