"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import dishesData from "@/data/dishes.json";

export type Dish = (typeof dishesData.dishes)[number];

const dishes = dishesData.dishes as Dish[];
const HOLD_MS = 3800;
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
  const stageRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef({ x: 0, y: 0 });

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

  useEffect(() => {
    if (reduce) return;
    const stage = stageRef.current;
    if (!stage) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      parallaxRef.current = { x: nx, y: ny };
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const layers = stage.querySelectorAll<HTMLElement>("[data-hero-layer]");
        layers.forEach((layer, i) => {
          const depth = (i + 1) * 6;
          layer.style.transform = `translate3d(${nx * depth}px, ${ny * depth}px, 0)`;
        });
      });
    };

    const onLeave = () => {
      const layers = stage.querySelectorAll<HTMLElement>("[data-hero-layer]");
      layers.forEach((layer) => {
        layer.style.transform = "translate3d(0,0,0)";
      });
    };

    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce, activeIndex]);

  return (
    <div
      ref={stageRef}
      className="relative mx-auto aspect-square w-[min(680px,62vw)] max-md:w-[min(88vw,560px)]"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-[82%] h-[16%] w-[72%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(213,153,91,0.32)_0%,transparent_72%)] blur-[3px]"
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
                    y: [0, -14, 0],
                    transition: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
                  }
                : { opacity: 1, y: 0 }
          }
          exit={{ opacity: 0, y: -24, transition: { duration: 0.32 } }}
        >
          {dish.layers.map((layer, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <motion.img
              key={`${dish.id}-${layer.order}`}
              data-hero-layer
              src={layer.src}
              alt=""
              width={1200}
              height={1200}
              draggable={false}
              className="pointer-events-none absolute inset-0 h-full w-full object-contain drop-shadow-[0_18px_36px_rgba(0,0,0,0.55)] will-change-transform"
              style={{ zIndex: Number(layer.order), transition: "transform 120ms linear" }}
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
      className="pointer-events-auto absolute left-0 top-1/2 z-40 hidden max-h-[min(48vh,420px)] -translate-y-1/2 flex-col items-center gap-1.5 overflow-y-auto py-1 md:left-[1vw] md:flex md:gap-2"
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
                ? "h-4 bg-[color:var(--fz-mustard)] md:h-5"
                : "h-2 bg-[color:var(--fz-rose)]/70 hover:bg-[color:var(--fz-mustard)]/70 md:h-2.5"
            }`}
          />
        );
      })}
    </div>
  );
}

export { dishes };
