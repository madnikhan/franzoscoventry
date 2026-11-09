export function Sticker({
  children,
  rotate = -8,
  className = "",
}: {
  children: React.ReactNode;
  rotate?: number;
  className?: string;
}) {
  return (
    <span
      className={`fz-sticker shadow-[0.35vw_0.35vw_0_var(--fz-outline)] max-md:shadow-[3px_3px_0_var(--fz-outline)] ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </span>
  );
}
