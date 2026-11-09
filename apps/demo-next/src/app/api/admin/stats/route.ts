import { NextResponse } from "next/server";
import { allMenuItems, getMenuCategories } from "@/lib/data";
import { getOrderStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getOrderStore();
  return NextResponse.json({
    stats: store.stats(),
    recentOrders: store.list().slice(0, 10),
    menu: {
      categories: getMenuCategories().length,
      items: allMenuItems().length,
    },
  });
}
