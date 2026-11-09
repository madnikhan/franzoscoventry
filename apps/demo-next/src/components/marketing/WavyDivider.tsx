const WAVE_A =
  "M0 48 Q180 6 360 48 T720 48 T1080 48 T1440 48 V80 H0 Z";
const WAVE_B =
  "M0 36 Q180 72 360 36 T720 36 T1080 36 T1440 36 V80 H0 Z";
const WAVE_C =
  "M0 52 Q180 18 360 52 T720 52 T1080 52 T1440 52 V80 H0 Z";

/** Flipped: filled band along the top edge of the viewBox */
const FLIP_A =
  "M0 0 H1440 V32 Q1260 74 1080 32 T720 32 T360 32 T0 32 Z";
const FLIP_B =
  "M0 0 H1440 V44 Q1260 8 1080 44 T720 44 T360 44 T0 44 Z";
const FLIP_C =
  "M0 0 H1440 V28 Q1260 58 1080 28 T720 28 T360 28 T0 28 Z";

export function WavyDivider({
  color = "var(--fz-tomato)",
  flip = false,
  className = "",
}: {
  color?: string;
  flip?: boolean;
  className?: string;
}) {
  const a = flip ? FLIP_A : WAVE_A;
  const b = flip ? FLIP_B : WAVE_B;
  const c = flip ? FLIP_C : WAVE_C;

  return (
    <div className={`leading-[0] ${className}`} style={{ color }} aria-hidden>
      <svg
        className="fz-wave block h-full w-full"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={a} fill="currentColor">
          <animate
            attributeName="d"
            dur="3.2s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
            keyTimes="0;0.5;1"
            values={`${a};${b};${a}`}
          />
        </path>
        {/* Secondary soft crest for richer motion */}
        <path d={c} fill="currentColor" opacity="0.55">
          <animate
            attributeName="d"
            dur="3.2s"
            begin="0.35s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
            keyTimes="0;0.5;1"
            values={`${c};${b};${c}`}
          />
        </path>
      </svg>
    </div>
  );
}
