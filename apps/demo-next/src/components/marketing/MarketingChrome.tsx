"use client";

import { useState } from "react";
import { PageLoader } from "./PageLoader";
import { IngredientCursor } from "./IngredientCursor";
import { SmoothScroll } from "./SmoothScroll";

export function MarketingChrome({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  return (
    <>
      <PageLoader onDone={() => setReady(true)} />
      {ready && (
        <>
          <SmoothScroll />
          <IngredientCursor />
        </>
      )}
      {children}
    </>
  );
}
