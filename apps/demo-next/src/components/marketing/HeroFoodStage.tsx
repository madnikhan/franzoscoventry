"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import dishesData from "@/data/dishes.json";

export type Dish = (typeof dishesData.dishes)[number];

const dishes = dishesData.dishes as Dish[];
const HOLD_MS = 3500;
const STAGGER = 0.28;
const SPRING = { type: "spring" as const, stiffness: 140, damping: 22 };

type Props = {
  activeIndex: number;
  onIndexChange: (index: number) => void;
};

export function HeroFoodStage({ activeIndex, onIndexChange }: Props) {
  const reduce = useReducedMotion();
  const dish = dishes[activeIndex] ?? dishes[0];
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  const goNext = useCallback(() => {
    onIndexChange((activeIndex + 1) % dishes.length);
  }, [activeIndex, onIndexChange]);

  useEffect(() => {
    setPhase("enter");
    if (reduce) {
      setPhase("hold");
      const t = window.setTimeout(goNext, HOLD_MS);
      return () => window.clearTimeout(t);
    }

    const enterMs = (dish.layers.length * STAGGER + 1.35) * 1000;
    const enterTimer = window.setTimeout(() => setPhase("hold"), enterMs);
    const holdTimer = window.setTimeout(() => setPhase("exit"), enterMs + HOLD_MS);
    const nextTimer = window.setTimeout(goNext, enterMs + HOLD_MS + 420);
    return () => {
      window.clearTimeout(enterTimer);
      window.clearTimeout(holdTimer);
      window.clearTimeout(nextTimer);
    };
  }, [activeIndex, dish.layers.length, goNext, reduce]);

  return (
    <div className="relative mx-auto aspect-square w-[min(680px,62vw)] max-md:w-[min(88vw,560px)]">
      <div
        className="pointer-events-none absolute left-1/2 top-[82%] h-[16%] w-[72%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(74,47,72,0.42)_0%,transparent_72%)] blur-[3px]"
        aria-hidden
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={dish.id}
          className="absolute inset-0"
          initial={reduce ? false : { opacity: 1 }}
          animate={
            phase === "exit"
              ? { opacity: 0, y: -28, transition: { duration: 0.38 } }
              : phase === "hold" && !reduce
                ? {
                    y: [0, -12, 0],
                    transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
                  }
                : { opacity: 1, y: 0 }
          }
          exit={{ opacity: 0, y: -24, transition: { duration: 0.32 } }}
        >
          {dish.layers.map((layer, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <motion.img
              key={`${dish.id}-${layer.order}`}
              src={layer.src}
              alt=""
              width={1200}
              height={1200}
              draggable={false}
              className="pointer-events-none absolute inset-0 h-full w-full object-contain drop-shadow-[0_14px_22px_rgba(74,47,72,0.4)]"
              style={{ zIndex: Number(layer.order) }}
              initial={reduce ? false : { y: -280, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={reduce ? { duration: 0 } : { ...SPRING, delay: i * STAGGER }}
            />
          ))}
        </motion.div>
      </AnimatePresence>
      <span className="sr-only">{dish.name}</span>
    </div>
  );
}

export function HeroDishDots({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div
      className="pointer-events-auto absolute left-0 top-1/2 z-40 flex max-h-[min(48vh,420px)] -translate-y-1/2 flex-col items-center gap-1.5 overflow-y-auto py-1 max-md:left-1 max-md:max-h-[32vh] md:left-[1vw] md:gap-2"
      role="tablist"
      aria-label="Dish slides"
    >
      {dishes.map((d, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={d.id}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={`Show ${d.name}`}
            onClick={() => onSelect(i)}
            className={`w-2 rounded-full border border-[color:var(--fz-outline)] transition-all md:w-2.5 ${
              active
                ? "h-4 bg-[color:var(--fz-tomato)] md:h-5"
                : "h-2 bg-[color:var(--fz-mustard)]/80 hover:bg-[color:var(--fz-tomato)]/70 md:h-2.5"
            }`}
          />
        );
      })}
    </div>
  );
}

export { dishes };
