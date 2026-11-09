"use client";

import Link from "next/link";
import { copyConfig } from "@/lib/data";

export function OrderNowButton({
  href = "/order",
  className = "",
  hideCursor,
}: {
  href?: string;
  className?: string;
  hideCursor?: boolean;
}) {
  return (
    <Link
      href={href}
      data-cursor-hide={hideCursor ? "true" : undefined}
      className={`group relative inline-flex items-center justify-center rounded-[2rem] border-[3px] border-[color:var(--fz-outline)] bg-[color:var(--fz-tomato)] px-7 py-3 text-lg font-bold tracking-wide text-white shadow-[4px_4px_0_var(--fz-outline)] transition duration-300 hover:rotate-[-2deg] hover:scale-105 hover:rounded-[1.25rem] ${className}`}
    >
      {copyConfig.ctaOrder}
    </Link>
  );
}
