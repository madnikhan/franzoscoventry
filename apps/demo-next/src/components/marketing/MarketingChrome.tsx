"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { PageLoader } from "./PageLoader";
import { IngredientCursor } from "./IngredientCursor";
import { SmoothScroll } from "./SmoothScroll";

const MarketingReadyContext = createContext(false);

const OPS_PREFIXES = ["/kitchen", "/driver", "/till", "/admin"];

export function useMarketingReady() {
  return useContext(MarketingReadyContext);
}

export function MarketingChrome({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const onDone = useCallback(() => setReady(true), []);
  const value = useMemo(() => ready, [ready]);
  const pathname = usePathname();

  useEffect(() => {
    const isOps = OPS_PREFIXES.some((p) => pathname.startsWith(p));
    document.body.classList.toggle("fz-ops", isOps);
    return () => {
      document.body.classList.remove("fz-ops");
    };
  }, [pathname]);

  return (
    <MarketingReadyContext.Provider value={value}>
      <PageLoader onDone={onDone} />
      {ready ? (
        <>
          <SmoothScroll />
          <IngredientCursor />
        </>
      ) : null}
      {children}
    </MarketingReadyContext.Provider>
  );
}
