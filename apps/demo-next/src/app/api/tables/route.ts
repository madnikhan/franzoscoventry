import { NextResponse } from "next/server";
import { businessConfig } from "@/lib/data";

export const dynamic = "force-dynamic";

/** Demo table list for QR printing (Carte-style table cards). */
export async function GET() {
  const tables = Array.from({ length: 12 }, (_, i) => String(i + 1));
  const site =
    process.env.NEXT_PUBLIC_APP_URL ||
    (businessConfig as { siteUrl?: string }).siteUrl ||
    "https://franzoscoventry.vercel.app";
  const base = site.replace(/\/$/, "");
  return NextResponse.json({
    tables: tables.map((n) => ({
      number: n,
      path: `/t/${n}`,
      url: `${base}/t/${n}`,
    })),
  });
}
