import {
  addDays,
  addMonths,
  endOfMonth,
  isAfter,
  isBefore,
  startOfMonth,
  todayISO,
} from './date';
import { ratesForPeriod } from './metrics';
import type { DayEntry, DayTotals, Rates } from './types';

export function entriesInRange(entries: DayEntry[], start: string, end: string): DayEntry[] {
  return entries.filter((e) => !isBefore(e.data, start) && !isAfter(e.data, end));
}

/**
 * Dias consecutivos com lançamento, terminando hoje (ou ontem, se ela ainda
 * não lançou hoje — o dia não "quebra" a sequência até de fato terminar).
 */
export function computeStreak(entryByDate: Map<string, DayEntry>): number {
  const today = todayISO();
  let cursor = entryByDate.has(today) ? today : addDays(today, -1);
  let streak = 0;
  let guard = 0;
  while (entryByDate.has(cursor) && guard < 3660) {
    streak += 1;
    cursor = addDays(cursor, -1);
    guard += 1;
  }
  return streak;
}

export interface RankedDay {
  entry: DayEntry;
  value: number;
}

/** Melhor e pior dia do período por taxa de conversão geral (só considera dias com contato). */
export function bestWorstDay(entries: DayEntry[]): { best: RankedDay | null; worst: RankedDay | null } {
  const ranked = entries
    .filter((e) => e.contatados > 0)
    .map((e) => ({ entry: e, value: e.conversoes / e.contatados }));

  if (ranked.length === 0) return { best: null, worst: null };

  let best = ranked[0];
  let worst = ranked[0];
  for (const r of ranked) {
    if (r.value > best.value) best = r;
    if (r.value < worst.value) worst = r;
  }
  return { best, worst };
}

export interface PeriodComparison {
  currentLabel: { start: string; end: string };
  previousLabel: { start: string; end: string };
  current: { totals: DayTotals; rates: Rates };
  previous: { totals: DayTotals; rates: Rates };
}

/** Compara o mês (âncora) com o mesmo intervalo de dias do mês anterior. */
export function compareToPreviousMonth(entries: DayEntry[], anchor: string): PeriodComparison {
  const monthStart = startOfMonth(anchor);
  const monthEnd = endOfMonth(anchor);
  const isCurrentRealMonth = monthStart === startOfMonth(todayISO());
  const effectiveEnd = isCurrentRealMonth && isBefore(todayISO(), monthEnd) ? todayISO() : monthEnd;

  const dayCount = Math.round(
    (new Date(effectiveEnd).getTime() - new Date(monthStart).getTime()) / 86_400_000,
  ) + 1;

  const prevMonthStart = startOfMonth(addMonths(anchor, -1));
  const prevMonthEnd = endOfMonth(prevMonthStart);
  let prevEffectiveEnd = addDays(prevMonthStart, dayCount - 1);
  if (isAfter(prevEffectiveEnd, prevMonthEnd)) prevEffectiveEnd = prevMonthEnd;

  const current = ratesForPeriod(entriesInRange(entries, monthStart, effectiveEnd));
  const previous = ratesForPeriod(entriesInRange(entries, prevMonthStart, prevEffectiveEnd));

  return {
    currentLabel: { start: monthStart, end: effectiveEnd },
    previousLabel: { start: prevMonthStart, end: prevEffectiveEnd },
    current,
    previous,
  };
}

export function delta(current: number | null, previous: number | null): number | null {
  if (current === null || previous === null) return null;
  return current - previous;
}
