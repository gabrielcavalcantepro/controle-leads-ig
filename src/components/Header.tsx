export function Header() {
  return (
    <header
      className="sticky top-0 z-40 flex items-center gap-2.5 border-b border-[var(--color-border)] bg-[var(--color-base)]/85 px-4 backdrop-blur-md"
      style={{ paddingTop: 'calc(var(--safe-top) + 12px)', paddingBottom: 12 }}
    >
      <img src="/brand/mark.png" alt="" width={24} height={24} className="shrink-0" />
      <div className="min-w-0">
        <h1 className="truncate text-[14.5px] font-semibold text-[var(--color-text)]">
          Controle de Leads IG
        </h1>
        <p className="truncate text-[10.5px] text-[var(--color-text-faint)]">X Performance</p>
      </div>
    </header>
  );
}
