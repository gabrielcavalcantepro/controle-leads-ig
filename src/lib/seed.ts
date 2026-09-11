import type { DayEntry } from './types';

/**
 * Dados reais já lançados na planilha original, usados como carga inicial.
 * "qualificados" não existia na planilha original — usamos o número de
 * agendamentos como valor mínimo seguro (todo agendamento pressupõe um lead
 * qualificado), fácil de corrigir pela tela "Preencher" se o número real for
 * outro.
 */
export const SEED_ENTRIES: DayEntry[] = [
  {
    data: '2026-09-08',
    contatados: 61,
    respostas: 11,
    qualificados: 2,
    agendamentos: 2,
    comparecimentos: 0,
    conversoes: 0,
    atualizadoEm: '2026-09-08T12:00:00.000Z',
  },
  {
    data: '2026-09-09',
    contatados: 52,
    respostas: 5,
    qualificados: 2,
    agendamentos: 2,
    comparecimentos: 0,
    conversoes: 0,
    atualizadoEm: '2026-09-09T12:00:00.000Z',
  },
  {
    data: '2026-09-10',
    contatados: 43,
    respostas: 4,
    qualificados: 0,
    agendamentos: 0,
    comparecimentos: 0,
    conversoes: 0,
    atualizadoEm: '2026-09-10T12:00:00.000Z',
  },
];
