export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:py-14">
      <div className="rounded-[1.75rem] border-2 border-[color:var(--fz-outline)]/50 bg-[color:var(--fz-surface)]/88 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-md md:p-8">
        {children}
      </div>
    </div>
  );
}
