import { NextResponse } from "next/server";
import { getMenuCategories, menuData } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    categories: getMenuCategories(),
    spiceLevels: menuData.spiceLevels,
  });
}
