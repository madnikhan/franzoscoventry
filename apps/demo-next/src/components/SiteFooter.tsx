"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { businessConfig, copyConfig } from "@/lib/data";

const INGREDIENTS = [
  "/media/loader/lettuce.svg",
  "/media/loader/tomato.svg",
  "/media/loader/cheese.svg",
  "/media/loader/patty.svg",
];

export function SiteFooter() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = stageRef.current?.querySelectorAll<HTMLElement>("[data-juggle]");
    if (!items?.length || reduce) return;

    const lanes = [0.12, 0.34, 0.56, 0.8];
    const tweens: gsap.core.Timeline[] = [];

    items.forEach((el, i) => {
      const throwOnce = () => {
        const tl = gsap.timeline({
          onComplete: () => {
            gsap.delayedCall(0.3 + Math.random() * 0.6, throwOnce);
          },
        });
        const peak = -(window.innerHeight * (0.18 + Math.random() * 0.12));
        gsap.set(el, {
          left: `${lanes[i] * 100}%`,
          bottom: "8%",
          opacity: 1,
          rotate: 0,
        });
        tl.to(el, {
          y: peak,
          x: gsap.utils.random(-40, 40),
          rotate: gsap.utils.random(-220, 220),
          duration: 0.9 + Math.random() * 0.3,
          ease: "power2.out",
        }).to(el, {
          y: 0,
          x: 0,
          rotate: gsap.utils.random(180, 400),
          opacity: 0,
          duration: 1.1 + Math.random() * 0.3,
          ease: "power2.in",
        });
        tweens.push(tl);
      };
      gsap.delayedCall(i * 0.55, throwOnce);
    });

    return () => tweens.forEach((t) => t.kill());
  }, []);

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-[color:var(--fz-outline)]/60 text-[color:var(--fz-ink)]">
      <div className="relative z-10 mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 bg-[color:var(--fz-surface)]/90 px-4 py-8 backdrop-blur-sm">
        <nav className="flex flex-wrap gap-4 text-lg font-bold" aria-label="Footer navigation">
          <Link href="/" className="hover:text-[color:var(--fz-mustard)]">Home</Link>
          <Link href="/menu" className="hover:text-[color:var(--fz-mustard)]">Menu</Link>
          <Link href="/about" className="hover:text-[color:var(--fz-mustard)]">About</Link>
          <Link href="/contact" className="hover:text-[color:var(--fz-mustard)]">Contact</Link>
        </nav>
        <p className="text-base font-semibold text-[color:var(--fz-muted)]">{copyConfig.footerLine}</p>
      </div>

      <div className="fz-mosaic-band">
        <div ref={stageRef} className="relative h-52 md:h-72">
          {INGREDIENTS.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              data-juggle
              src={src}
              alt=""
              className="absolute z-[2] h-12 w-12 -translate-x-1/2 md:h-16 md:w-16"
            />
          ))}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/logo/franzos-logo.png"
            alt="Franzos"
            className="pointer-events-none absolute left-1/2 top-1/2 z-[2] h-[80%] w-auto max-w-[90%] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_12px_32px_rgba(213,153,91,0.35)]"
          />
        </div>
      </div>

      <div className="relative z-10 border-t border-[color:var(--fz-outline)]/40 bg-[color:var(--fz-surface)]/95 px-4 py-3 text-center text-sm text-[color:var(--fz-muted)]">
        © 2026 {businessConfig.name} · {copyConfig.footerBlurb}
      </div>
    </footer>
  );
}
