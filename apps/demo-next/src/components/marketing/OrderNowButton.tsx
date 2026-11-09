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
      className={`group relative inline-flex items-center justify-center rounded-[2rem] border-2 border-[color:var(--fz-rose)] bg-gradient-to-br from-[color:var(--fz-tomato)] to-[#8a3550] px-7 py-3 text-lg font-bold tracking-wide text-[#fff6ee] shadow-[0_12px_32px_rgba(161,67,91,0.45)] transition duration-300 hover:rotate-[-2deg] hover:scale-105 hover:rounded-[1.25rem] hover:from-[color:var(--fz-mustard)] hover:to-[color:var(--fz-mustard-deep)] hover:text-[#120d14] ${className}`}
    >
      {copyConfig.ctaOrder}
    </Link>
  );
}
