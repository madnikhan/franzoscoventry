"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { PLATE_DROP_LAYERS } from "@/lib/plateDrop";

const STAGGER = 0.34;
const SPRING = { type: "spring" as const, stiffness: 140, damping: 22 };

export function HeroFoodStage() {
  const reducePref = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<"enter" | "hold">("enter");
  const stageRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();

  const reduce = mounted && !!reducePref;

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!mounted || reduce) return;
    controls.set((i: number) => ({ y: -260, opacity: 0 }));
  }, [mounted, reduce, controls]);

  useEffect(() => {
    if (!mounted) return;

    if (reduce) {
      controls.set((i: number) => ({
        y: PLATE_DROP_LAYERS[i]?.settleY ?? 0,
        opacity: 1,
      }));
      setPhase("hold");
      return;
    }

    setPhase("enter");
    void controls
      .start((i: number) => ({
        y: PLATE_DROP_LAYERS[i]?.settleY ?? 0,
        opacity: 1,
        transition: { ...SPRING, delay: i * STAGGER },
      }))
      .then(() => setPhase("hold"));
  }, [mounted, reduce, controls]);

  useEffect(() => {
    if (!mounted || reduce) return;
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
          const depth = (i + 1) * 3.5;
          const base = PLATE_DROP_LAYERS[i]?.settleY ?? 0;
          layer.style.transform = `translate3d(${nx * depth}px, ${base + ny * depth * 0.35}px, 0)`;
        });
      });
    };

    const onLeave = () => {
      stage.querySelectorAll<HTMLElement>("[data-hero-layer]").forEach((layer, i) => {
        const base = PLATE_DROP_LAYERS[i]?.settleY ?? 0;
        layer.style.transform = `translate3d(0, ${base}px, 0)`;
      });
    };

    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, [mounted, reduce]);

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
          phase === "hold" && mounted && !reduce
            ? {
                y: [0, -10, 0],
                transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
              }
            : { y: 0 }
        }
      >
        {PLATE_DROP_LAYERS.map((layer, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <motion.img
            key={layer.order}
            custom={i}
            animate={controls}
            data-hero-layer
            src={layer.src}
            alt=""
            width={1200}
            height={1200}
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full object-contain drop-shadow-[0_18px_36px_rgba(0,0,0,0.55)] will-change-transform"
            style={{ zIndex: i + 1 }}
            initial={{ y: layer.settleY, opacity: 1 }}
          />
        ))}
      </motion.div>
      <span className="sr-only">Franzos peri peri plate with fries and salad</span>
    </div>
  );
}
