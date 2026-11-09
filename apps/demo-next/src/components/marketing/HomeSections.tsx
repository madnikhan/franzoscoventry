import Image from "next/image";
import { copyConfig } from "@/lib/data";
import { OrderNowButton } from "./OrderNowButton";
import { WavyDivider } from "./WavyDivider";

export function HomeSections() {
  return (
    <>
      <section className="bg-[color:var(--fz-canvas)] px-[4vw] py-[8vw] text-center max-md:py-16">
        <p className="text-[clamp(0.7rem,1.4vw,0.95rem)] font-bold tracking-[0.25em] text-[color:var(--fz-tomato)]">
          TOP CLASSIC
        </p>
        <h2 className="fz-outline-text mx-auto mt-[1.5vw] max-w-5xl font-display text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.9]">
          {copyConfig.statementTitle}
        </h2>
        <p className="mx-auto mt-[2vw] max-w-2xl text-[clamp(1rem,2vw,1.35rem)] font-semibold">
          {copyConfig.statementBody}
        </p>
        <div className="mt-[3vw] max-md:mt-8">
          <OrderNowButton hideCursor />
        </div>
      </section>

      <WavyDivider
        color="var(--fz-tomato)"
        className="relative z-10 -mb-[3.5vw] h-[5vw] min-h-12"
      />
      <section className="relative z-0 bg-[color:var(--fz-tomato)] px-[4vw] pb-[8vw] pt-[calc(8vw+1.5rem)] text-white max-md:pb-16 max-md:pt-20">
        <div className="mx-auto grid max-w-6xl gap-[4vw] md:grid-cols-2 md:items-center">
          <div>
            <p className="text-[clamp(0.7rem,1.4vw,0.95rem)] font-bold tracking-[0.2em] text-[color:var(--fz-mustard)]">
              EXPERIENCE
            </p>
            <h2 className="mt-[1vw] font-display text-[clamp(2.5rem,7vw,4.5rem)] leading-none">
              {copyConfig.feelGoodTitle}
            </h2>
            <p className="mt-[1.5vw] text-[clamp(1rem,2vw,1.25rem)] text-white/90">
              450 kcal · High Protein · Fresh Ingredients
            </p>
            <p className="mt-[2vw] inline-block rounded-[1vw] border-[0.25vw] border-[color:var(--fz-outline)] bg-[color:var(--fz-mustard)] px-[1.5vw] py-[0.8vw] text-[clamp(0.9rem,1.8vw,1.2rem)] font-bold text-[color:var(--fz-outline)] shadow-[0.35vw_0.35vw_0_var(--fz-outline)] max-md:rounded-xl max-md:border-[3px] max-md:px-4 max-md:py-2 max-md:shadow-[3px_3px_0_var(--fz-outline)]">
              {copyConfig.feelGoodBand}
            </p>
            <p className="mt-[1.5vw] text-white/90">100% Halal · Zero Guilt · True Taste</p>
          </div>
          <div className="grid grid-cols-2 gap-[1.2vw] text-center font-bold max-md:gap-3">
            {["Pure quality", "Every Layer", "Packed With", "Signature Flavor"].map((t) => (
              <div
                key={t}
                className="rounded-[1.5vw] border-[0.25vw] border-[color:var(--fz-outline)] bg-[color:var(--fz-canvas)] px-[1vw] py-[3vw] text-[clamp(0.95rem,2vw,1.35rem)] text-[color:var(--fz-outline)] shadow-[0.4vw_0.4vw_0_var(--fz-outline)] max-md:rounded-2xl max-md:border-[3px] max-md:px-3 max-md:py-6 max-md:shadow-[4px_4px_0_var(--fz-outline)]"
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="relative z-0 overflow-hidden">
        <div className="relative min-h-[55vw] max-md:min-h-[420px] md:min-h-[520px]">
          <Image
            src="/media/hero/story-feast.jpg"
            alt="Franzos food story"
            fill
            className="object-cover"
            sizes="100vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-[color:var(--fz-outline)]/55" />
          {/* Waves sit on the feast photo — valleys show image, not cream canvas */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20">
            <WavyDivider color="var(--fz-tomato)" flip className="h-[7vw] min-h-14 md:h-16" />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
            <WavyDivider color="var(--fz-mustard)" className="h-[7vw] min-h-14 md:h-16" />
          </div>
          <div className="relative z-10 flex min-h-[55vw] flex-col items-center justify-center px-[4vw] py-[8vw] text-center text-white max-md:min-h-[420px] md:min-h-[520px]">
            <h2 className="font-display text-[clamp(2.5rem,8vw,5rem)] leading-none">
              {copyConfig.storyTitle}
            </h2>
            <p className="mt-[2vw] max-w-xl text-[clamp(1rem,2vw,1.35rem)]">{copyConfig.storyBody}</p>
          </div>
        </div>
      </section>

      <section className="relative z-0 bg-[color:var(--fz-mustard)] px-[4vw] py-[8vw] text-[color:var(--fz-outline)] max-md:py-16">
        <p className="text-center text-[clamp(0.7rem,1.4vw,0.95rem)] font-bold tracking-[0.25em]">
          TAKE AWAY
        </p>
        <h2 className="fz-outline-text mx-auto mt-[1.5vw] max-w-5xl text-center font-display text-[clamp(2.2rem,7vw,4.5rem)] leading-[0.9]">
          {copyConfig.travelsTitle}
        </h2>
        <p className="mx-auto mt-[2vw] max-w-2xl text-center text-[clamp(1rem,2vw,1.25rem)] font-semibold">
          {copyConfig.travelsBody}
        </p>
        <div className="mx-auto mt-[3vw] flex max-w-4xl flex-wrap justify-center gap-[1vw] max-md:mt-8 max-md:gap-3">
          {["COVENTRY", "EARLSDON", "FOLESHILL", "CANLEY", "TILE HILL"].map((c) => (
            <span
              key={c}
              className="rounded-full border-[0.2vw] border-[color:var(--fz-outline)] bg-white px-[1.5vw] py-[0.7vw] text-[clamp(0.85rem,1.6vw,1.1rem)] font-bold shadow-[0.3vw_0.3vw_0_var(--fz-outline)] max-md:border-[3px] max-md:px-4 max-md:py-2 max-md:shadow-[3px_3px_0_var(--fz-outline)]"
            >
              {c}
            </span>
          ))}
        </div>
      </section>
      <WavyDivider
        color="var(--fz-mustard)"
        flip
        className="relative z-10 -mt-[3.5vw] h-[5vw] min-h-12"
      />

      <section className="bg-[color:var(--fz-canvas)] px-[4vw] py-[10vw] text-center max-md:py-20">
        <p className="text-[clamp(0.7rem,1.4vw,0.95rem)] font-bold tracking-[0.25em] text-[color:var(--fz-tomato)]">
          FEEL IT
        </p>
        <h2 className="fz-outline-text mx-auto mt-[1.5vw] max-w-3xl font-display text-[clamp(2.5rem,8vw,5rem)] leading-none">
          {copyConfig.changeTitle}
        </h2>
        <p className="mx-auto mt-[2vw] max-w-2xl text-[clamp(1rem,2vw,1.35rem)] font-semibold">
          {copyConfig.changeBody}
        </p>
        <div className="mt-[3vw] max-md:mt-8">
          <OrderNowButton hideCursor />
        </div>
      </section>
    </>
  );
}
