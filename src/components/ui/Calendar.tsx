import { useState } from 'react';
import {
  addMonths,
  isAfter,
  isBefore,
  parseISODate,
  startOfMonth,
  startOfWeek,
  toISODate,
  todayISO,
} from '../../lib/date';
import { IconChevronLeft, IconChevronRight } from '../icons';

interface CalendarProps {
  value: string;
  onSelect: (iso: string) => void;
  mode?: 'day' | 'week';
  min?: string;
  max?: string;
}

const WEEKDAY_LABELS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
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

export function Calendar({ value, onSelect, mode = 'day', min, max }: CalendarProps) {
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(value || todayISO()));

  const monthStart = parseISODate(viewMonth);
  const gridStart = startOfWeek(viewMonth);
  const today = todayISO();
  const selectedWeekStart = mode === 'week' ? startOfWeek(value) : null;

  const cells: string[] = [];
  let cursor = gridStart;
  for (let i = 0; i < 42; i++) {
    cells.push(cursor);
    const d = parseISODate(cursor);
    d.setDate(d.getDate() + 1);
    cursor = toISODate(d);
  }

  const isDisabled = (iso: string) =>
    Boolean((min && isBefore(iso, min)) || (max && isAfter(iso, max)));

  return (
    <div className="w-[280px]">
      <div className="mb-2 flex items-center justify-between px-1">
        <button
          type="button"
          aria-label="Mês anterior"
          className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-white/5 hover:text-[var(--color-text)]"
          onClick={() => setViewMonth(addMonths(viewMonth, -1))}
        >
          <IconChevronLeft size={16} />
        </button>
        <span className="text-[13px] font-medium text-[var(--color-text)]">
          {MESES[monthStart.getMonth()]} {monthStart.getFullYear()}
        </span>
        <button
          type="button"
          aria-label="Próximo mês"
          className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-white/5 hover:text-[var(--color-text)]"
          onClick={() => setViewMonth(addMonths(viewMonth, 1))}
        >
          <IconChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {WEEKDAY_LABELS.map((w, i) => (
          <div
            key={i}
            className="flex h-7 items-center justify-center text-[11px] font-medium text-[var(--color-text-faint)]"
          >
            {w}
          </div>
        ))}
        {cells.map((iso) => {
          const inMonth = iso.slice(0, 7) === viewMonth.slice(0, 7);
          const isToday = iso === today;
          const isSelected = mode === 'day' ? iso === value : startOfWeek(iso) === selectedWeekStart;
          const disabled = isDisabled(iso);
          const day = parseISODate(iso).getDate();

          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(mode === 'week' ? startOfWeek(iso) : iso)}
              className={`relative mx-auto flex h-8 w-9 items-center justify-center rounded-[var(--radius-sm)] text-[12.5px] transition-colors ${
                disabled
                  ? 'cursor-not-allowed text-[var(--color-text-faint)] opacity-30'
                  : isSelected
                    ? 'bg-[var(--color-accent)] font-semibold text-[var(--color-accent-ink)]'
                    : inMonth
                      ? 'text-[var(--color-text)] hover:bg-white/8'
                      : 'text-[var(--color-text-faint)] hover:bg-white/5'
              }`}
            >
              {day}
              {isToday && !isSelected && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[var(--color-accent)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
