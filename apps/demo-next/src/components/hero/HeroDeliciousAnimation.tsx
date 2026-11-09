"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { businessConfig, copyConfig } from "@/lib/data";

function DeliciousWordmark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 160"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <text
        x="450"
        y="118"
        textAnchor="middle"
        fill="none"
        stroke="white"
        strokeWidth="4"
        paintOrder="stroke"
        style={{
          fontFamily: "var(--fz-font-display), Bebas Neue, Impact, sans-serif",
          fontSize: "148px",
          letterSpacing: "0.02em",
        }}
      >
        {copyConfig.heroWord ?? "DELICIOUS"}
      </text>
    </svg>
  );
}

export function HeroDeliciousAnimation() {
  const rootRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const deliciousRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const image = imageRef.current;
    const logo = logoRef.current;
    const eyebrow = eyebrowRef.current;
    const delicious = deliciousRef.current;
    const cta = ctaRef.current;
    if (!image || !logo || !eyebrow || !delicious || !cta) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      gsap.set([image, logo, eyebrow, delicious, cta], { opacity: 1, y: 0, scale: 1 });
      return;
    }

    gsap.set(image, { opacity: 0, scale: 0.92 });
    gsap.set(logo, { opacity: 0, y: -16 });
    gsap.set(eyebrow, { opacity: 0, y: -20 });
    gsap.set(delicious, { opacity: 0, scale: 1.08, y: 12 });
    gsap.set(cta, { opacity: 0, y: 28 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(image, { opacity: 1, scale: 1, duration: 1.15 })
      .to(logo, { opacity: 1, y: 0, duration: 0.45 }, "-=0.55")
      .to(eyebrow, { opacity: 1, y: 0, duration: 0.5 }, "-=0.25")
      .to(delicious, { opacity: 1, scale: 1, y: 0, duration: 0.75, ease: "back.out(1.2)" }, "-=0.15")
      .to(cta, { opacity: 1, y: 0, duration: 0.55 }, "-=0.2");

    return () => {
      tl.kill();
    };
  }, []);

  const phone = businessConfig.phoneE164 ?? businessConfig.phone;
  const phoneDisplay = "+44 24 7509 2252";

  return (
    <section
      ref={rootRef}
      className="relative min-h-[88vh] overflow-hidden bg-[#1a1210] text-[color:var(--fz-cream)]"
    >
      <div ref={imageRef} className="absolute inset-0">
        <Image
          src="/media/hero/delicious-burgers.jpg"
          alt="Franzos stacked burgers held in black gloves"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/70" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[88vh] w-full max-w-6xl flex-col px-4 pt-8 pb-12 md:pt-10 md:pb-16">
        <div ref={logoRef} className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/logo/franzos.svg"
            alt="Franzos"
            className="h-10 w-auto drop-shadow-lg md:h-12"
          />
          <span className="sr-only">{copyConfig.brandName}</span>
        </div>

        <div className="mt-6 flex flex-1 flex-col items-center justify-center text-center">
          <p
            ref={eyebrowRef}
            className="max-w-xl text-base font-medium tracking-wide text-white/95 drop-shadow md:text-xl"
          >
            {copyConfig.heroEyebrow}
          </p>

          <div
            ref={deliciousRef}
            className="pointer-events-none relative mt-4 w-full max-w-4xl px-2"
          >
            <DeliciousWordmark className="h-auto w-full drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)]" />
          </div>

          <div
            ref={ctaRef}
            className="mt-8 flex flex-col items-center gap-4 sm:mt-10"
          >
            <Link
              href="/order"
              className="rounded-xl bg-gradient-to-b from-[#e6392a] to-[#b91c1c] px-10 py-3.5 text-sm font-bold tracking-[0.12em] text-white shadow-[0_12px_30px_rgba(185,28,28,0.45)] transition hover:from-[#ff4a3a] hover:to-[#e6392a] md:text-base"
            >
              {copyConfig.ctaOrder}
            </Link>
            <a
              href={`tel:${phone}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#e6392a] px-5 py-2 text-sm font-semibold text-white shadow-lg"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-current"
                aria-hidden="true"
              >
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8z" />
              </svg>
              {phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
