import { useRef, useState } from 'react';
import { formatBR } from '../../lib/date';
import { IconCalendar } from '../icons';
import { Calendar } from './Calendar';
import { Popover } from './Popover';

interface DateFieldProps {
  label: string;
  value: string;
  onChange: (iso: string) => void;
  min?: string;
  max?: string;
}

export function DateField({ label, value, onChange, min, max }: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  return (
    <div>
      <label className="mb-1.5 block text-[13px] text-[var(--color-text-muted)]">{label}</label>
      <button
        ref={anchorRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="field-input flex h-12 w-full items-center gap-2.5 px-3.5 text-left"
      >
        <IconCalendar size={14} className="shrink-0 text-[var(--color-text-faint)]" />
        <span className="tnum text-[14px] text-[var(--color-text)]">{formatBR(value)}</span>
      </button>
      <Popover open={open} onClose={() => setOpen(false)} anchorRef={anchorRef}>
        <Calendar
          value={value}
          min={min}
          max={max}
          onSelect={(iso) => {
            onChange(iso);
            setOpen(false);
          }}
        />
      </Popover>
    </div>
  );
}
