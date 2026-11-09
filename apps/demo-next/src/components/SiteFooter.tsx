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
    <footer className="relative mt-auto overflow-hidden border-t-[3px] border-[color:var(--fz-outline)] bg-[color:var(--fz-canvas)] text-[color:var(--fz-outline)]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8">
        <nav className="flex flex-wrap gap-4 text-lg font-bold" aria-label="Footer navigation">
          <Link href="/">Home</Link>
          <Link href="/menu">Menu</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <p className="text-base font-semibold">{copyConfig.footerLine}</p>
      </div>

      <div ref={stageRef} className="relative h-52 md:h-72">
        {INGREDIENTS.map((src) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            data-juggle
            src={src}
            alt=""
            className="absolute h-12 w-12 -translate-x-1/2 md:h-16 md:w-16"
          />
        ))}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/logo/franzos-logo.png"
          alt="Franzos"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-auto max-w-[90%] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_4px_0_var(--fz-outline)]"
        />
      </div>

      <div className="border-t-[3px] border-[color:var(--fz-outline)]/20 px-4 py-3 text-center text-sm">
        © {new Date().getFullYear()} {businessConfig.name} · {copyConfig.footerBlurb}
      </div>
    </footer>
  );
}
