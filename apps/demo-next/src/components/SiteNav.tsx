"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useCart } from "@/context/CartContext";

const menuItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/menu", label: "Menu" },
  { href: "/opening-hours", label: "Hours" },
  { href: "/contact", label: "Contact" },
  { href: "/order", label: "Order / Cart" },
  { href: "/track", label: "Track" },
];

const opsLinks = [
  { href: "/kitchen", label: "Kitchen" },
  { href: "/driver", label: "Driver" },
  { href: "/till", label: "Till" },
  { href: "/admin", label: "Admin" },
];

export function SiteNav() {
  const pathname = usePathname();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isOps = ["/kitchen", "/driver", "/till", "/admin"].some((p) =>
    pathname.startsWith(p)
  );

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    if (open) {
      gsap.fromTo(
        el,
        { autoAlpha: 0, scale: 0.85, y: -12 },
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 0.35,
          ease: "back.out(1.6)",
          transformOrigin: "100% 0%",
        }
      );
      el.style.pointerEvents = "auto";
    } else {
      gsap.to(el, {
        autoAlpha: 0,
        scale: 0.9,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          el.style.pointerEvents = "none";
        },
      });
    }
  }, [open]);

  if (isOps) {
    return (
      <header className="fixed top-0 left-0 z-[999] w-full bg-[color:var(--fz-canvas)]/95 px-[2.5vw] py-[1vw] backdrop-blur max-md:px-[4vw] max-md:py-[3vw]">
        <div className="flex items-center justify-between gap-3">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/logo/franzos-logo-nav.png"
              alt="Franzos"
              className="h-[10vw] max-h-16 w-auto max-md:h-[14vw] md:h-20"
            />
          </Link>
          <nav className="flex flex-wrap gap-2 text-sm font-bold">
            {opsLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-3 py-1.5 ${
                  pathname.startsWith(l.href)
                    ? "bg-[color:var(--fz-tomato)] text-white"
                    : "bg-white"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    );
  }

  return (
    <nav className="fixed top-0 left-0 z-[999] flex w-full items-center justify-between px-[2.5vw] py-[1vw] max-md:px-[4vw] max-md:py-[2.5vw]">
      <Link href="/" className="group relative z-10 shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/logo/franzos-logo-nav.png"
          alt="Franzos"
          className="h-[9vw] w-auto max-w-[22vw] transition duration-300 group-hover:scale-105 group-hover:rotate-[-3deg] max-md:h-[12vw] max-md:max-w-[28vw] md:h-24"
        />
        <span className="sr-only">Franzos</span>
      </Link>

      <div className="relative z-10 flex items-center gap-[1vw] max-md:gap-[3vw]">
        <Link
          href="/menu"
          data-cursor-hide
          className="flex items-center justify-center rounded-full bg-[color:var(--fz-tomato)] px-[1.6vw] py-[0.5vw] font-display text-[1.3vw] uppercase tracking-wide text-[color:var(--fz-canvas)] transition-all duration-300 hover:scale-105 hover:bg-[color:var(--fz-outline)] max-md:px-[5vw] max-md:py-[1.8vw] max-md:text-[4vw]"
        >
          Menu
        </Link>

        <Link
          href="/order"
          data-cursor-hide
          aria-label={count > 0 ? `Cart, ${count} items` : "Cart"}
          className="relative flex items-center justify-center rounded-full border-[0.15vw] border-[color:var(--fz-outline)] bg-[color:var(--fz-mustard)] px-[1.2vw] py-[0.45vw] text-[color:var(--fz-outline)] shadow-[2px_2px_0_var(--fz-outline)] transition-all duration-300 hover:scale-105 max-md:border-[0.4vw] max-md:px-[3.5vw] max-md:py-[1.6vw]"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            className="h-[1.45vw] w-[1.45vw] min-h-5 min-w-5 fill-none stroke-current stroke-[2.2]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.5 5h1.6l1.3 9.2a1.6 1.6 0 0 0 1.6 1.3h8.2a1.6 1.6 0 0 0 1.6-1.3L19.5 8H7"
            />
            <circle cx="9.2" cy="19.2" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="16.2" cy="19.2" r="1.2" fill="currentColor" stroke="none" />
          </svg>
          {count > 0 ? (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[color:var(--fz-tomato)] px-1 text-[0.65rem] font-bold leading-none text-white shadow-[1px_1px_0_var(--fz-outline)]">
              {count > 99 ? "99+" : count}
            </span>
          ) : null}
        </Link>

        <div className="relative">
          <button
            type="button"
            data-cursor-hide
            aria-label={open ? "Close site menu" : "Open site menu"}
            aria-expanded={open}
            aria-controls="main-menu"
            onClick={() => setOpen((v) => !v)}
            className="flex cursor-pointer items-center gap-[0.6vw] rounded-full border-[0.15vw] border-[color:var(--fz-tomato)] bg-[color:var(--fz-tomato)] px-[1.4vw] py-[0.5vw] font-display text-[1.3vw] uppercase tracking-wide text-[color:var(--fz-canvas)] transition-all duration-400 hover:scale-105 max-md:gap-[2vw] max-md:border-[0.4vw] max-md:px-[4vw] max-md:py-[1.8vw] max-md:text-[4vw]"
          >
            {open ? (
              <>
                Close
                <span aria-hidden className="inline-flex items-center justify-center text-[1.2em] leading-none">
                  ×
                </span>
              </>
            ) : (
              <span aria-hidden className="inline-flex h-[1.2vw] min-h-[1.1rem] w-[1.6vw] min-w-[1.25rem] flex-col justify-center gap-[0.28vw] max-md:h-4 max-md:w-5 max-md:gap-1">
                <span className="block h-[0.22vw] min-h-[2px] w-full rounded-full bg-[color:var(--fz-canvas)] max-md:h-0.5" />
                <span className="block h-[0.22vw] min-h-[2px] w-full rounded-full bg-[color:var(--fz-canvas)] max-md:h-0.5" />
                <span className="block h-[0.22vw] min-h-[2px] w-full rounded-full bg-[color:var(--fz-canvas)] max-md:h-0.5" />
              </span>
            )}
          </button>

          <div
            id="main-menu"
            ref={menuRef}
            role="menu"
            className="absolute top-[calc(100%+1vw)] right-0 w-[18vw] rounded-[1.2vw] bg-[color:var(--fz-tomato)] p-[2vw] shadow-[0_1vw_3vw_rgba(27,27,27,.25)] max-md:mt-[5vw] max-md:w-[91vw] max-md:rounded-[4vw] max-md:p-[6vw]"
            style={{ opacity: 0, pointerEvents: "none" }}
          >
            <ul className="flex flex-col gap-[1.2vw] max-md:gap-[4vw]">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    role="menuitem"
                    href={item.href}
                    className="block font-display text-[1.6vw] uppercase tracking-wide text-[color:var(--fz-canvas)] transition hover:text-[color:var(--fz-mustard)] max-md:text-[7vw]"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                    {item.href === "/order" && count > 0 ? ` (${count})` : ""}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-[2vw] border-t border-white/30 pt-[1.2vw] text-[0.85vw] font-semibold uppercase tracking-wider text-[color:var(--fz-canvas)]/80 max-md:mt-[5vw] max-md:pt-[4vw] max-md:text-[3.2vw]">
              Est. Coventry — Corporation Street
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}
