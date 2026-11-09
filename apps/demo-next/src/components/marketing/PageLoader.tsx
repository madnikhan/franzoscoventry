"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { copyConfig } from "@/lib/data";

const STATUS = [
  "FIRING UP THE FLAME GRILL...",
  "STACKING THE WEEKEND BURGERS...",
  "MELTING THE SECRET SAUCE...",
  "READY TO SERVE FRANZOS...",
];

const LOADER_KEY = "franzos_loader_dark_v1";
const HERO_SRC = "/media/loader/weekend-burgers.png";

export function PageLoader({ onDone }: { onDone?: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLImageElement>(null);
  const crumbsRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState(STATUS[0]);
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const finish = () => {
      try {
        sessionStorage.setItem(LOADER_KEY, "1");
      } catch {
        /* ignore */
      }
      document.body.style.overflow = "";
      setHidden(true);
      onDone?.();
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(LOADER_KEY) === "1";
    } catch {
      seen = false;
    }

    if (reduce || seen) {
      finish();
      return;
    }

    const hero = heroRef.current;
    const curtains = rootRef.current?.querySelectorAll<SVGElement>("[data-curtain]");
    const crumbs = crumbsRef.current?.querySelectorAll<HTMLElement>("[data-crumb]");
    if (!hero || !curtains?.length) return;

    document.body.style.overflow = "hidden";
    gsap.set(hero, { y: -420, opacity: 0, scale: 0.72, rotate: -6 });
    if (crumbs) gsap.set(crumbs, { opacity: 0, scale: 0 });

    const tl = gsap.timeline({ onComplete: finish });

    tl.to(hero, {
      y: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      duration: 0.55,
      ease: "back.out(1.4)",
      onStart: () => setStatus(STATUS[0]),
    });

    STATUS.slice(1).forEach((label, i) => {
      tl.call(() => setStatus(label), undefined, 0.35 + i * 0.28);
    });

    const prog = { v: 0 };
    tl.to(
      prog,
      {
        v: 100,
        duration: 1.2,
        ease: "none",
        onUpdate: () => setProgress(Math.round(prog.v)),
      },
      0
    );

    tl.to(
      hero,
      {
        y: -14,
        scale: 1.04,
        duration: 0.35,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut",
      },
      0.55
    );

    if (crumbs?.length) {
      crumbs.forEach((c, i) => {
        const angle = (i / crumbs.length) * Math.PI * 2;
        const dist = 110 + (i % 3) * 26;
        tl.to(
          c,
          {
            opacity: 1,
            scale: 1,
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist - 20,
            duration: 0.4,
            ease: "power2.out",
          },
          "-=0.08"
        );
        tl.to(c, { opacity: 0, duration: 0.22 }, "-=0.18");
      });
    }

    tl.to(".loader-ready", { opacity: 1, scale: 1, duration: 0.28, ease: "back.out(2)" }, "-=0.28");
    tl.to(hero, { y: -28, scale: 1.06, duration: 0.2, ease: "power2.out" }, "-=0.1");
    tl.to(hero, { y: 0, scale: 1, duration: 0.26, ease: "bounce.out" });
    tl.to(hero, { y: -900, opacity: 0, duration: 0.38, ease: "power2.in" }, "+=0.05");

    curtains.forEach((curtain, i) => {
      tl.to(
        curtain,
        { yPercent: -125, duration: 0.45, ease: "power2.inOut" },
        `+=${i === 0 ? 0.02 : 0.04}`
      );
    });
    tl.to(rootRef.current, { autoAlpha: 0, duration: 0.1 }, "-=0.15");

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, [onDone]);

  if (hidden) return null;

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Page loading"
      className="fixed inset-0 z-[99999] flex h-dvh w-full flex-col items-center justify-center overflow-hidden bg-[color:var(--fz-canvas)]"
    >
      {["#a1435b", "#704d6d", "#120d14"].map((c, i) => (
        <svg
          key={c}
          data-curtain
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ zIndex: 10 - i }}
        >
          <path d="M0 0 H100 V88 Q50 100 0 88 Z" fill={c} />
        </svg>
      ))}

      <div className="relative z-30 mb-[4vw] flex flex-col items-center max-md:mb-[10vw]">
        <div
          className="relative flex items-center justify-center"
          style={{ width: "min(86vw, 460px)", height: "min(86vw, 460px)" }}
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={heroRef}
            src={HERO_SRC}
            alt=""
            className="h-full w-full object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.4)]"
          />
          <div ref={crumbsRef} className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                data-crumb
                className="absolute h-2 w-2 rounded-full md:h-2.5 md:w-2.5"
                style={{
                  background: i % 3 === 0 ? "#d5995b" : i % 3 === 1 ? "#f6e7c8" : "#a1435b",
                }}
              />
            ))}
          </div>
        </div>

        <p className="loader-ready mt-2 origin-center scale-75 text-center font-display text-[clamp(1.75rem,6vw,3.5rem)] tracking-wide text-[color:var(--fz-mustard)] opacity-0">
          {copyConfig.loaderReady}
        </p>
        <p className="mt-3 max-w-[90vw] text-center text-[clamp(0.7rem,2.5vw,1rem)] font-semibold tracking-widest text-[color:var(--fz-ink)]/90">
          {status}
        </p>
        <div className="mt-5 h-2 w-[56vw] max-w-[320px] overflow-hidden rounded-full bg-[color:var(--fz-elevated)] md:h-2.5 md:w-80">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[color:var(--fz-tomato)] to-[color:var(--fz-mustard)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
