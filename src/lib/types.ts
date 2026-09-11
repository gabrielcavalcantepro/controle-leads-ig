export interface DayEntry {
  data: string; // YYYY-MM-DD
  contatados: number;
  respostas: number;
  qualificados: number;
  agendamentos: number;
  comparecimentos: number;
  conversoes: number;
  atualizadoEm: string; // ISO timestamp, for streak/backup metadata
}

export type DayTotals = Pick<
  DayEntry,
  'contatados' | 'respostas' | 'qualificados' | 'agendamentos' | 'comparecimentos' | 'conversoes'
>;

export interface Rates {
  taxaResposta: number | null;
  taxaQualificacao: number | null;
  taxaAgendamento: number | null;
  taxaComparecimento: number | null;
  taxaNoShow: number | null;
  taxaConversao: number | null;
  taxaConversaoGeral: number | null;
}

export type PeriodKind = 'dia' | 'semana' | 'mes' | 'personalizado';

export interface PeriodSelection {
  kind: PeriodKind;
  /** Reference date (YYYY-MM-DD) for dia/semana/mes; ignored for personalizado. */
  anchor: string;
  /** Only used when kind === 'personalizado'. */
  start?: string;
  end?: string;
}
