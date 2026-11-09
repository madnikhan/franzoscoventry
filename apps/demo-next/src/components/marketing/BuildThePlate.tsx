"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dishesData from "@/data/dishes.json";

gsap.registerPlugin(ScrollTrigger);

const dish = dishesData.dishes[0];
const STEPS = [
  { label: "Base heat", copy: "Flame-kissed foundations hit the grill." },
  { label: "Mid stack", copy: "Sauces, greens, and melt settle into place." },
  { label: "Crown it", copy: "Top layers lock the Franzos signature." },
  { label: "Serve dark", copy: "Night-kitchen plating — ready to order." },
];

export function BuildThePlate() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const layers = stage.querySelectorAll<HTMLElement>("[data-plate-layer]");
    const labels = section.querySelectorAll<HTMLElement>("[data-plate-step]");
    if (!layers.length) return;

    const ctx = gsap.context(() => {
      gsap.set(layers, { y: 80, opacity: 0, scale: 0.92 });
      gsap.set(labels, { opacity: 0.35 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=220%",
          scrub: 0.65,
          pin: true,
          anticipatePin: 1,
        },
      });

      layers.forEach((layer, i) => {
        const depth = (i + 1) * 18;
        tl.to(
          layer,
          {
            y: -depth,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power2.out",
          },
          i * 0.55
        );
        if (labels[i]) {
          tl.to(labels[i], { opacity: 1, duration: 0.35 }, i * 0.55);
          labels.forEach((other, j) => {
            if (j !== i) tl.to(other, { opacity: 0.35, duration: 0.25 }, i * 0.55);
          });
        }
      });

      tl.to(stage, { rotate: 2, duration: 0.8, ease: "sine.inOut" }, "-=0.4");
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-[5] flex min-h-[100svh] items-center overflow-hidden bg-[color:var(--fz-surface)] px-[4vw] py-16"
      aria-label="Build the plate"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(161,67,91,0.22),transparent_55%),radial-gradient(ellipse_at_70%_60%,rgba(213,153,91,0.12),transparent_50%)]" />
      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <p className="text-[clamp(0.7rem,1.4vw,0.95rem)] font-bold tracking-[0.25em] text-[color:var(--fz-mustard)]">
            BUILD THE PLATE
          </p>
          <h2 className="fz-outline-text mt-3 font-display text-[clamp(2.4rem,7vw,4.5rem)] leading-[0.9]">
            Layer by layer flame
          </h2>
          <ol className="mt-8 space-y-4">
            {STEPS.map((step) => (
              <li
                key={step.label}
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
          className="relative mx-auto aspect-square w-full max-w-[min(520px,88vw)]"
        >
          <div
            className="pointer-events-none absolute left-1/2 top-[84%] h-[18%] w-[70%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(213,153,91,0.28)_0%,transparent_70%)] blur-[2px]"
            aria-hidden
          />
          {dish.layers.map((layer, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={layer.order}
              data-plate-layer
              src={layer.src}
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.55)]"
              style={{ zIndex: i + 1 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
