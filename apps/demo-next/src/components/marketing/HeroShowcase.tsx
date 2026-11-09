"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { copyConfig } from "@/lib/data";
import { OrderNowButton } from "./OrderNowButton";
import { Sticker } from "./Sticker";
import { HeroDishDots, HeroFoodStage, dishes } from "./HeroFoodStage";

export function HeroShowcase() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const dish = dishes[activeIndex] ?? dishes[0];

  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const words = title.querySelectorAll("span");
    gsap.fromTo(
      words,
      { y: 60, opacity: 0, rotate: () => gsap.utils.random(-10, 10), scale: 0.6 },
      {
        y: 0,
        opacity: 1,
        rotate: 0,
        scale: 1,
        duration: 0.75,
        stagger: 0.055,
        ease: "back.out(2.35)",
        delay: 0.35,
      }
    );
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative -mt-[var(--fz-nav-offset)] min-h-[100svh] overflow-hidden bg-[color:var(--fz-canvas)] px-[4vw] pb-[12vw] pt-[22vw] max-md:pt-[calc(8vw+1rem)] md:min-h-[85vh] md:pb-24 md:pt-32"
    >
      {/* Feast atmosphere background */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/hero/feast-table.jpg"
          alt=""
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--fz-canvas)]/92 via-[color:var(--fz-canvas)]/78 to-[color:var(--fz-canvas)]/95" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[color:var(--fz-tomato)]/25 via-transparent to-[color:var(--fz-outline)]/20" />
      </div>

      <p className="relative z-30 text-center text-[clamp(0.7rem,1.5vw,1rem)] font-bold tracking-[0.2em] text-[color:var(--fz-outline)]/70">
        {copyConfig.heroEyebrow}
      </p>

      <div className="relative z-30 mx-auto mt-[1vw] max-w-6xl text-center">
        <HeroDishDots activeIndex={activeIndex} onSelect={setActiveIndex} />

        <div className="pointer-events-none absolute left-[2vw] top-[8vw] z-40 max-md:left-[8%] max-md:top-[4vw]">
          <Sticker rotate={-12} className="text-[clamp(0.65rem,1.4vw,1rem)]">
            {dish.badges[0] ?? copyConfig.stickerFresh}
          </Sticker>
        </div>
        <div className="pointer-events-none absolute right-[2vw] top-[18vw] z-40 max-md:right-0 max-md:top-[12vw]">
          <Sticker rotate={8} className="text-[clamp(0.65rem,1.4vw,1rem)]">
            {dish.badges[1] ?? copyConfig.stickerBold}
          </Sticker>
        </div>

        <h1
          ref={titleRef}
          className="fz-outline-text relative z-30 font-display text-[clamp(3.5rem,14vw,9rem)] leading-[0.82]"
        >
          {(copyConfig.heroHeadline || "THE FLAME").split(" ").map((w) => (
            <span key={w} className="inline-block px-[0.5vw]">
              {w}
            </span>
          ))}
        </h1>
        <p className="fz-outline-text relative z-20 mt-[0.5vw] font-display text-[clamp(2.2rem,9vw,5.5rem)] leading-none">
          {copyConfig.heroHeadlineAlt}
        </p>
      </div>

      {/* Large single-dish food-drop — overlaps lower headline */}
      <div className="relative z-[25] -mt-[10vw] flex justify-center max-md:-mt-[8vw] md:-mt-16">
        <HeroFoodStage activeIndex={activeIndex} onIndexChange={setActiveIndex} />
      </div>

      <div className="relative z-30 mx-auto -mt-[2vw] flex max-w-xl flex-col items-center text-center max-md:mt-0 md:-mt-4">
        <p className="text-[clamp(1rem,2vw,1.25rem)] font-semibold text-[color:var(--fz-outline)]">
          {copyConfig.heroSub}
        </p>
        <div className="mt-[3vw] max-md:mt-8">
          <OrderNowButton hideCursor />
        </div>
      </div>
    </section>
  );
}
