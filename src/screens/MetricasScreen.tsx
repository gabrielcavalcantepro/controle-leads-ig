import { useMemo, useState } from 'react';
import {
  bestWorstDay,
  compareToPreviousMonth,
  computeStreak,
  delta,
  entriesInRange,
} from '../lib/analytics';
import { IconFlame } from '../components/icons';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { DateField } from '../components/ui/DateField';
import { DeltaPill } from '../components/ui/DeltaPill';
import { Funnel } from '../components/ui/Funnel';
import { PeriodStepper } from '../components/ui/PeriodStepper';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { StatBlock } from '../components/ui/StatBlock';
import { TimeSeriesChart } from '../components/ui/TimeSeriesChart';
import {
  addDays,
  dateRange,
  endOfMonth,
  endOfWeek,
  formatBR,
  isAfter,
  startOfMonth,
  startOfWeek,
  todayISO,
} from '../lib/date';
import { formatInt, formatPct, ratesForPeriod } from '../lib/metrics';
import type { PeriodKind } from '../lib/types';
import { useEntries } from '../store/EntriesProvider';

const KIND_OPTIONS: { value: PeriodKind; label: string }[] = [
  { value: 'dia', label: 'Dia' },
  { value: 'semana', label: 'Semana' },
  { value: 'mes', label: 'Mês' },
  { value: 'personalizado', label: 'Personalizado' },
];

type TrendMetric = 'contatados' | 'conversaoGeral';

export function MetricasScreen() {
  const { entries, entryByDate } = useEntries();
  const today = todayISO();

  const [kind, setKind] = useState<PeriodKind>('semana');
  const [anchor, setAnchor] = useState(today);
  const [customStart, setCustomStart] = useState(startOfWeek(today));
  const [customEnd, setCustomEnd] = useState(today);
  const [trendMetric, setTrendMetric] = useState<TrendMetric>('contatados');

  const { start, end } = useMemo(() => {
    if (kind === 'dia') return { start: anchor, end: anchor };
    if (kind === 'semana') return { start: startOfWeek(anchor), end: endOfWeek(anchor) };
    if (kind === 'mes') return { start: startOfMonth(anchor), end: endOfMonth(anchor) };
    return { start: customStart, end: isAfter(customStart, customEnd) ? customStart : customEnd };
  }, [kind, anchor, customStart, customEnd]);

  const periodEntries = useMemo(() => entriesInRange(entries, start, end), [entries, start, end]);
  const { totals, rates } = useMemo(() => ratesForPeriod(periodEntries), [periodEntries]);

  const streak = useMemo(() => computeStreak(entryByDate), [entryByDate]);
  const { best, worst } = useMemo(() => bestWorstDay(periodEntries), [periodEntries]);

  const trendRange = kind === 'dia' ? { start: addDays(anchor, -13), end: anchor } : { start, end };
  const trendDates = useMemo(
    () => dateRange(trendRange.start, trendRange.end).filter((d) => entryByDate.has(d)),
    [trendRange.start, trendRange.end, entryByDate],
  );
  const trendData = useMemo(
    () =>
      trendDates.map((d) => {
        const e = entryByDate.get(d)!;
        const value =
          trendMetric === 'contatados' ? e.contatados : e.contatados ? e.conversoes / e.contatados : 0;
        return { date: d, value };
      }),
    [trendDates, entryByDate, trendMetric],
  );

  const comparison = useMemo(
    () => (kind === 'mes' ? compareToPreviousMonth(entries, anchor) : null),
    [kind, anchor, entries],
  );

  return (
    <div className="mx-auto max-w-[520px] px-4 pt-4 pb-2">
      <div className="mb-3 flex items-center justify-between gap-2">
        <SegmentedControl options={KIND_OPTIONS} value={kind} onChange={setKind} />
      </div>

      <div className="mb-4">
        {kind === 'personalizado' ? (
          <div className="grid grid-cols-2 gap-3">
            <DateField label="De" value={customStart} max={customEnd} onChange={setCustomStart} />
            <DateField label="Até" value={customEnd} min={customStart} max={today} onChange={setCustomEnd} />
          </div>
        ) : (
          <PeriodStepper kind={kind} anchor={anchor} onChange={setAnchor} />
        )}
      </div>

      {streak > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-accent-border)] bg-[var(--color-accent-soft)] px-3.5 py-2.5">
          <IconFlame size={15} className="shrink-0 text-[var(--color-accent)]" />
          <p className="text-[12.5px] text-[var(--color-text)]">
            <span className="tnum font-semibold">{streak}</span>{' '}
            {streak === 1 ? 'dia seguido preenchendo' : 'dias seguidos preenchendo'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2.5">
        <StatBlock hero label="Contatados" value={formatInt(totals.contatados)} />
        <StatBlock hero label="Conv. geral" value={formatPct(rates.taxaConversaoGeral)} tone="accent" />
        <StatBlock
          hero
          label="No-show"
          value={formatPct(rates.taxaNoShow)}
          tone={rates.taxaNoShow !== null && rates.taxaNoShow > 0.3 ? 'negative' : 'default'}
        />
      </div>

      <div className="mt-2.5 grid grid-cols-4 gap-2.5">
        <StatBlock label="Resposta" value={formatPct(rates.taxaResposta)} />
        <StatBlock label="Agendam." value={formatPct(rates.taxaAgendamento)} />
        <StatBlock label="Compar." value={formatPct(rates.taxaComparecimento)} />
        <StatBlock label="Conversão" value={formatPct(rates.taxaConversao)} />
      </div>

      <div className="mt-4">
        <Card>
          <CardHeader title="Funil" />
          <CardContent>
            <Funnel totals={totals} rates={rates} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <Card>
          <CardHeader title="Evolução" />
          <CardContent>
            <SegmentedControl
              className="mb-4"
              options={[
                { value: 'contatados', label: 'Contatados' },
                { value: 'conversaoGeral', label: 'Taxa de conversão' },
              ]}
              value={trendMetric}
              onChange={setTrendMetric}
            />
            <TimeSeriesChart
              data={trendData}
              formatValue={(v) => (trendMetric === 'contatados' ? formatInt(v) : formatPct(v))}
            />
          </CardContent>
        </Card>
      </div>

      {(best || worst) && (
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {best && (
            <Card>
              <CardContent className="pt-4">
                <p className="text-[11.5px] text-[var(--color-text-muted)]">Melhor dia</p>
                <p className="tnum mt-1 text-[15px] font-semibold text-[var(--color-positive)]">
                  {formatBR(best.entry.data)}
                </p>
                <p className="tnum mt-0.5 text-[12px] text-[var(--color-text-faint)]">
                  conversão geral {formatPct(best.value)}
                </p>
              </CardContent>
            </Card>
          )}
          {worst && (
            <Card>
              <CardContent className="pt-4">
                <p className="text-[11.5px] text-[var(--color-text-muted)]">Pior dia</p>
                <p className="tnum mt-1 text-[15px] font-semibold text-[var(--color-text)]">
                  {formatBR(worst.entry.data)}
                </p>
                <p className="tnum mt-0.5 text-[12px] text-[var(--color-text-faint)]">
                  conversão geral {formatPct(worst.value)}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {comparison && (
        <div className="mt-4 mb-4">
          <Card>
            <div className="px-4 pt-4 sm:px-5 sm:pt-5">
              <h3 className="text-[14.5px] font-medium text-[var(--color-text)]">
                Mês atual vs. anterior
              </h3>
              <p className="mt-0.5 text-[11px] text-[var(--color-text-faint)]">
                {formatBR(comparison.currentLabel.start)}–{formatBR(comparison.currentLabel.end)} vs.{' '}
                {formatBR(comparison.previousLabel.start)}–{formatBR(comparison.previousLabel.end)}
              </p>
            </div>
            <CardContent className="mt-1 flex flex-col gap-3">
              <ComparisonRow
                label="Contatados"
                current={formatInt(comparison.current.totals.contatados)}
                d={delta(comparison.current.totals.contatados, comparison.previous.totals.contatados)}
                format={(v) => formatInt(Math.round(v))}
              />
              <ComparisonRow
                label="Conversão geral"
                current={formatPct(comparison.current.rates.taxaConversaoGeral)}
                d={delta(comparison.current.rates.taxaConversaoGeral, comparison.previous.rates.taxaConversaoGeral)}
                format={(v) => `${(v * 100).toFixed(1)} p.p.`}
              />
              <ComparisonRow
                label="Taxa de no-show"
                current={formatPct(comparison.current.rates.taxaNoShow)}
                d={delta(comparison.current.rates.taxaNoShow, comparison.previous.rates.taxaNoShow)}
                format={(v) => `${(v * 100).toFixed(1)} p.p.`}
                invert
              />
            </CardContent>
          </Card>
        </div>
      )}

      <div className="pb-4" />
    </div>
  );
}

function ComparisonRow({
  label,
  current,
  d,
  format,
  invert = false,
}: {
  label: string;
  current: string;
  d: number | null;
  format: (v: number) => string;
  invert?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12.5px] text-[var(--color-text-muted)]">{label}</span>
      <div className="flex items-center gap-2">
        <span className="tnum text-[14px] font-semibold text-[var(--color-text)]">{current}</span>
        <DeltaPill value={d} format={format} invert={invert} />
      </div>
    </div>
  );
}
