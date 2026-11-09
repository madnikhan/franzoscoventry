"use client";

import { useEffect, useRef } from "react";

/** Compact brand cursor — single tip, no trailing string. */
export function IngredientCursor() {
  const tipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const wide = window.matchMedia("(min-width: 768px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || !wide || reduce || !tipRef.current) return;

    const tip = tipRef.current;
    document.documentElement.classList.add("fz-custom-cursor");
    tip.style.opacity = "1";

    let hide = false;
    let x = -100;
    let y = -100;
    let tx = x;
    let ty = y;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      hide = !!(e.target as HTMLElement | null)?.closest?.(
        "a, button, [data-cursor-hide], input, select, textarea, label"
      );
    };

    const tick = () => {
      x += (tx - x) * 0.35;
      y += (ty - y) * 0.35;
      tip.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-30%, -20%)`;
      tip.style.opacity = hide ? "0" : "1";
      tip.dataset.mode = hide ? "link" : "point";
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.classList.remove("fz-custom-cursor");
    };
  }, []);

  return (
    <div
      ref={tipRef}
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden opacity-0 md:block"
      aria-hidden
      style={{ willChange: "transform" }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        className="drop-shadow-[2px_2px_0_var(--fz-outline)]"
      >
        <path
          d="M4 2.5 L24 13.2 L14.2 15.1 L11.8 25.5 Z"
          fill="var(--fz-tomato)"
          stroke="var(--fz-outline)"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <circle cx="8.2" cy="8.8" r="1.6" fill="var(--fz-mustard)" />
      </svg>
    </div>
  );
}
