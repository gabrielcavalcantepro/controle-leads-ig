interface Option<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = '',
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      className={`card-sunken inline-flex w-full gap-1 rounded-[var(--radius-sm)] p-1 ${className}`}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={`relative flex-1 rounded-[calc(var(--radius-sm)-2px)] px-2 py-2 text-[12.5px] font-medium transition-colors duration-150 ${
              active
                ? 'bg-[var(--color-accent)] text-[var(--color-accent-ink)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
