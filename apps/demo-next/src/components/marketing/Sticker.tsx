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
      className={`fz-sticker shadow-[0_10px_24px_rgba(0,0,0,0.45)] ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </span>
  );
}
