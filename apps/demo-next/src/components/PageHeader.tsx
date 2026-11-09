export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8">
      <h1 className="fz-outline-text font-display text-5xl leading-none tracking-wide md:text-6xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 max-w-2xl text-lg font-semibold text-[color:var(--fz-outline)]/80">
          {subtitle}
        </p>
      )}
    </div>
  );
}
