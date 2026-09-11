import type { DayEntry, DayTotals, Rates } from './types';

/** Division that returns null (never NaN/Infinity) when the denominator is zero. */
export function safeDiv(numerator: number, denominator: number): number | null {
  if (!denominator) return null;
  return numerator / denominator;
}

export function sumTotals(entries: DayTotals[]): DayTotals {
  return entries.reduce<DayTotals>(
    (acc, e) => ({
      contatados: acc.contatados + e.contatados,
      respostas: acc.respostas + e.respostas,
      agendamentos: acc.agendamentos + e.agendamentos,
      comparecimentos: acc.comparecimentos + e.comparecimentos,
      conversoes: acc.conversoes + e.conversoes,
    }),
    { contatados: 0, respostas: 0, agendamentos: 0, comparecimentos: 0, conversoes: 0 },
  );
}

/**
 * Rates are always computed from summed totals, never averaged day-by-day —
 * averaging daily rates would let a low-volume day distort the period metric.
 */
export function computeRates(totals: DayTotals): Rates {
  const taxaResposta = safeDiv(totals.respostas, totals.contatados);
  const taxaAgendamento = safeDiv(totals.agendamentos, totals.respostas);
  const taxaComparecimento = safeDiv(totals.comparecimentos, totals.agendamentos);
  const taxaNoShow = taxaComparecimento === null ? null : 1 - taxaComparecimento;
  const taxaConversao = safeDiv(totals.conversoes, totals.comparecimentos);
  const taxaConversaoGeral = safeDiv(totals.conversoes, totals.contatados);

  return {
    taxaResposta,
    taxaAgendamento,
    taxaComparecimento,
    taxaNoShow,
    taxaConversao,
    taxaConversaoGeral,
  };
}

export function ratesForEntry(entry: DayTotals): Rates {
  return computeRates(entry);
}

export function ratesForPeriod(entries: DayTotals[]): { totals: DayTotals; rates: Rates } {
  const totals = sumTotals(entries);
  return { totals, rates: computeRates(totals) };
}

export function formatPct(value: number | null, digits = 0): string {
  if (value === null || Number.isNaN(value) || !Number.isFinite(value)) return '—';
  return `${(value * 100).toFixed(digits)}%`;
}

export function formatInt(value: number): string {
  return value.toLocaleString('pt-BR');
}

/** Validation warnings for a single day's raw counts — informative, never blocking. */
export function validateEntry(entry: DayTotals): string[] {
  const warnings: string[] = [];
  if (entry.respostas > entry.contatados) {
    warnings.push('Respostas maior que contatados.');
  }
  if (entry.agendamentos > entry.respostas) {
    warnings.push('Agendamentos maior que respostas.');
  }
  if (entry.comparecimentos > entry.agendamentos) {
    warnings.push('Comparecimentos maior que agendamentos.');
  }
  if (entry.conversoes > entry.comparecimentos) {
    warnings.push('Conversões maior que comparecimentos.');
  }
  return warnings;
}

export function emptyEntry(data: string): DayEntry {
  return {
    data,
    contatados: 0,
    respostas: 0,
    agendamentos: 0,
    comparecimentos: 0,
    conversoes: 0,
    atualizadoEm: new Date().toISOString(),
  };
}
