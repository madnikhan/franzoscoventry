"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const PLATE_LAYERS = [
  { order: "01", part: "plate", src: "/media/hero/plate-drop/01-plate.png" },
  { order: "02", part: "fries", src: "/media/hero/plate-drop/02-fries.png" },
  { order: "03", part: "chicken", src: "/media/hero/plate-drop/03-chicken.png" },
  { order: "04", part: "salad", src: "/media/hero/plate-drop/04-salad.png" },
] as const;

const STAGGER = 0.32;
const SPRING = { type: "spring" as const, stiffness: 140, damping: 22 };

export function HeroFoodStage() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<"enter" | "hold">("enter");
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPhase("enter");
    if (reduce) {
      setPhase("hold");
      return;
    }
    const enterMs = (PLATE_LAYERS.length * STAGGER + 1.2) * 1000;
    const t = window.setTimeout(() => setPhase("hold"), enterMs);
    return () => window.clearTimeout(t);
  }, [reduce]);

  useEffect(() => {
    if (reduce) return;
    const stage = stageRef.current;
    if (!stage) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
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
      stage.querySelectorAll<HTMLElement>("[data-hero-layer]").forEach((layer) => {
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
  }, [reduce]);

  return (
    <div
      ref={stageRef}
      className="relative mx-auto aspect-square w-[min(680px,62vw)] max-md:w-[min(88vw,560px)]"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-[82%] h-[16%] w-[72%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(213,153,91,0.32)_0%,transparent_72%)] blur-[3px]"
        aria-hidden
      />
      <motion.div
        className="absolute inset-0"
        animate={
          phase === "hold" && !reduce
            ? {
                y: [0, -12, 0],
                transition: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
              }
            : { y: 0 }
        }
      >
        {PLATE_LAYERS.map((layer, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <motion.img
            key={layer.order}
            data-hero-layer
            src={layer.src}
            alt=""
            width={1200}
            height={1200}
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full object-contain drop-shadow-[0_18px_36px_rgba(0,0,0,0.55)] will-change-transform"
            style={{ zIndex: i + 1, transition: "transform 120ms linear" }}
            initial={reduce ? false : { y: -280, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={reduce ? { duration: 0 } : { ...SPRING, delay: i * STAGGER }}
          />
        ))}
      </motion.div>
      <span className="sr-only">Franzos peri peri plate with fries and salad</span>
    </div>
  );
}
