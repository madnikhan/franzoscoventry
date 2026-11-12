"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PLATE_DROP_LAYERS } from "@/lib/plateDrop";
import { useMarketingReady } from "./MarketingChrome";

gsap.registerPlugin(ScrollTrigger);

export function BuildThePlate() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const ready = useMarketingReady();

  useEffect(() => {
    if (!ready) return;

    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const layers = Array.from(stage.querySelectorAll<HTMLElement>("[data-plate-layer]"));
    const labels = Array.from(section.querySelectorAll<HTMLElement>("[data-plate-step]"));
    if (!layers.length) return;

    // Always keep base plate visible — never leave a text-only empty stage.
    gsap.set(layers[0], { y: PLATE_DROP_LAYERS[0].settleY, opacity: 1, scale: 1 });
    for (let i = 1; i < layers.length; i++) {
      gsap.set(layers[i], {
        y: isMobile ? 40 : 80,
        opacity: reduce ? 1 : 0,
        scale: reduce ? 1 : 0.94,
      });
    }
    if (reduce) {
      gsap.set(labels, { opacity: 1 });
      return;
    }

    // Animate transforms/opacity only — never pin/reparent the React <section>
    // (ScrollTrigger pin-spacers cause Node.removeChild hydration errors).
    const ctx = gsap.context(() => {
      if (isMobile) {
        gsap.set(labels, { opacity: 0.45 });
        if (labels[0]) gsap.set(labels[0], { opacity: 1 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            once: true,
          },
        });
        layers.forEach((layer, i) => {
          if (i === 0) return;
          tl.to(
            layer,
            {
              y: PLATE_DROP_LAYERS[i].settleY,
              opacity: 1,
              scale: 1,
              duration: 0.95,
              ease: "power2.out",
            },
            (i - 1) * 0.55
          );
          if (labels[i]) {
            tl.to(labels[i], { opacity: 1, duration: 0.4 }, (i - 1) * 0.55);
          }
        });
        return;
      }

      gsap.set(labels, { opacity: 0.35 });
      if (labels[0]) gsap.set(labels[0], { opacity: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          end: "bottom 35%",
          scrub: 1.35,
          invalidateOnRefresh: true,
        },
      });

      layers.forEach((layer, i) => {
        if (i === 0) return;
        tl.to(
          layer,
          {
            y: PLATE_DROP_LAYERS[i].settleY,
            opacity: 1,
            scale: 1,
            duration: 1.4,
            ease: "none",
          },
          (i - 1) * 0.85
        );
        if (labels[i]) {
          tl.to(labels[i], { opacity: 1, duration: 0.5 }, (i - 1) * 0.85);
          labels.forEach((other, j) => {
            if (j !== i) tl.to(other, { opacity: 0.35, duration: 0.35 }, (i - 1) * 0.85);
          });
        }
      });

      tl.to(stage, { rotate: 1.2, duration: 1.1, ease: "none" }, "-=0.5");
    }, section);

    const refreshId = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.cancelAnimationFrame(refreshId);
      ctx.revert();
      gsap.set(layers, { clearProps: "opacity,transform" });
      gsap.set(layers[0], { opacity: 1 });
    };
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      className="relative z-[5] overflow-hidden bg-[color:var(--fz-surface)] px-[4vw] py-16 md:min-h-[140vh] md:py-24"
      aria-label="Build the plate"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(161,67,91,0.22),transparent_55%),radial-gradient(ellipse_at_70%_60%,rgba(213,153,91,0.12),transparent_50%)]" />
      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-start gap-8 md:grid-cols-2 md:gap-16 md:py-[10vh]">
        <div className="order-2 md:order-1 md:sticky md:top-[calc(var(--fz-nav-sticky)+1rem)]">
          <p className="text-[clamp(0.7rem,1.4vw,0.95rem)] font-bold tracking-[0.25em] text-[color:var(--fz-mustard)]">
            BUILD THE PLATE
          </p>
          <h2 className="fz-outline-text mt-3 font-display text-[clamp(2.4rem,7vw,4.5rem)] leading-[0.9]">
            Layer by layer flame
          </h2>
          <ol className="mt-8 space-y-4">
            {PLATE_DROP_LAYERS.map((step) => (
              <li
                key={step.order}
                data-plate-step
                className="rounded-2xl border border-[color:var(--fz-outline)]/50 bg-[color:var(--fz-elevated)]/80 px-4 py-3 backdrop-blur-sm"
              >
                <p className="font-display text-xl text-[color:var(--fz-mustard)]">{step.label}</p>
                <p className="mt-1 text-sm text-[color:var(--fz-ink)]/80">{step.copy}</p>
              </li>
            ))}
          </ol>
        </div>

        <div
          ref={stageRef}
          className="relative order-1 mx-auto aspect-square w-full max-w-[min(520px,88vw)] md:order-2 md:sticky md:top-[calc(var(--fz-nav-sticky)+2rem)]"
        >
          <div
            className="pointer-events-none absolute left-1/2 top-[84%] h-[18%] w-[70%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(213,153,91,0.28)_0%,transparent_70%)] blur-[2px]"
            aria-hidden
          />
          {PLATE_DROP_LAYERS.map((layer, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={layer.order}
              data-plate-layer
              src={layer.src}
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.55)]"
              style={{ zIndex: i + 1, opacity: i === 0 ? 1 : undefined }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
