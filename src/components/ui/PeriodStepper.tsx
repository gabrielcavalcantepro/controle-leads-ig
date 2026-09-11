import { useRef, useState } from 'react';
import {
  addDays,
  formatMonthLabel,
  formatWeekLabel,
  isAfter,
  parseISODate,
  toISODate,
  todayISO,
} from '../../lib/date';
import { IconChevronLeft, IconChevronRight } from '../icons';
import { Calendar } from './Calendar';
import { Popover } from './Popover';

type Kind = 'dia' | 'semana' | 'mes';

interface PeriodStepperProps {
  kind: Kind;
  anchor: string;
  onChange: (iso: string) => void;
}

const MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

function MonthYearGrid({
  anchor,
  onSelect,
}: {
  anchor: string;
  onSelect: (iso: string) => void;
}) {
  const anchorDate = parseISODate(anchor);
  const [year, setYear] = useState(anchorDate.getFullYear());

  return (
    <div className="w-[240px]">
      <div className="mb-2 flex items-center justify-between px-1">
        <button
          type="button"
          aria-label="Ano anterior"
          className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-white/5 hover:text-[var(--color-text)]"
          onClick={() => setYear((y) => y - 1)}
        >
          <IconChevronLeft size={16} />
        </button>
        <span className="text-[13px] font-medium text-[var(--color-text)]">{year}</span>
        <button
          type="button"
          aria-label="Próximo ano"
          className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-white/5 hover:text-[var(--color-text)]"
          onClick={() => setYear((y) => y + 1)}
        >
          <IconChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {MESES.map((m, i) => {
          const active = anchorDate.getFullYear() === year && anchorDate.getMonth() === i;
          return (
            <button
              key={m}
              type="button"
              onClick={() => onSelect(toISODate(new Date(year, i, 1)))}
              className={`rounded-[var(--radius-sm)] py-2 text-[12px] font-medium transition-colors ${
                active
                  ? 'bg-[var(--color-accent)] text-[var(--color-accent-ink)]'
                  : 'text-[var(--color-text-muted)] hover:bg-white/8 hover:text-[var(--color-text)]'
              }`}
            >
              {m.slice(0, 3)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function PeriodStepper({ kind, anchor, onChange }: PeriodStepperProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const today = todayISO();

  const step = (dir: 1 | -1) => {
    if (kind === 'dia') onChange(addDays(anchor, dir));
    else if (kind === 'semana') onChange(addDays(anchor, dir * 7));
    else {
      const d = parseISODate(anchor);
      onChange(toISODate(new Date(d.getFullYear(), d.getMonth() + dir, 1)));
    }
  };

  const capitalize = (s: string) => s.replace(/^(\w)/, (c) => c.toUpperCase());

  const label =
    kind === 'dia'
      ? anchor === today
        ? 'Hoje'
        : anchor === addDays(today, -1)
          ? 'Ontem'
          : new Intl.DateTimeFormat('pt-BR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }).format(parseISODate(anchor))
      : kind === 'semana'
        ? formatWeekLabel(anchor)
        : capitalize(formatMonthLabel(anchor));

  const nextDisabled = kind === 'dia' && isAfter(addDays(anchor, 1), today);

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        aria-label="Período anterior"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-white/5 hover:text-[var(--color-text)]"
        onClick={() => step(-1)}
      >
        <IconChevronLeft size={16} />
      </button>
      <button
        ref={anchorRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="field-input tnum h-10 flex-1 truncate px-3 text-center text-[13px] font-medium text-[var(--color-text)]"
      >
        {label}
      </button>
      <button
        type="button"
        aria-label="Próximo período"
        disabled={nextDisabled}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-white/5 hover:text-[var(--color-text)] disabled:opacity-30 disabled:pointer-events-none"
        onClick={() => step(1)}
      >
        <IconChevronRight size={16} />
      </button>

      <Popover open={open} onClose={() => setOpen(false)} anchorRef={anchorRef} align="end">
        {kind === 'mes' ? (
          <MonthYearGrid
            anchor={anchor}
            onSelect={(iso) => {
              onChange(iso);
              setOpen(false);
            }}
          />
        ) : (
          <Calendar
            value={anchor}
            mode={kind === 'semana' ? 'week' : 'day'}
            max={today}
            onSelect={(iso) => {
              onChange(iso);
              setOpen(false);
            }}
          />
        )}
      </Popover>
    </div>
  );
}
