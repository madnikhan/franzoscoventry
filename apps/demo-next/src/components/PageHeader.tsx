export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8">
      <h1 className="fz-outline-text font-display break-words text-[clamp(2rem,9vw,3.75rem)] leading-none tracking-wide md:text-6xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 max-w-2xl text-base font-semibold text-[color:var(--fz-muted)] md:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
