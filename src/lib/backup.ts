import { formatBR, todayISO } from './date';
import type { DayEntry } from './types';

function download(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function exportJSON(entries: DayEntry[]): void {
  const payload = {
    exportadoEm: new Date().toISOString(),
    origem: 'controle-leads-ig',
    entries: [...entries].sort((a, b) => a.data.localeCompare(b.data)),
  };
  download(
    `leads-ig-backup-${todayISO()}.json`,
    JSON.stringify(payload, null, 2),
    'application/json',
  );
}

export function exportCSV(entries: DayEntry[]): void {
  const header = [
    'Data',
    'Leads contatados',
    'Respostas recebidas',
    'Agendamentos',
    'Comparecimentos',
    'Conversões',
  ];
  const rows = [...entries]
    .sort((a, b) => a.data.localeCompare(b.data))
    .map((e) => [
      formatBR(e.data),
      e.contatados,
      e.respostas,
      e.agendamentos,
      e.comparecimentos,
      e.conversoes,
    ]);
  const csv = [header, ...rows].map((row) => row.join(';')).join('\r\n');
  download(`leads-ig-${todayISO()}.csv`, `﻿${csv}`, 'text/csv;charset=utf-8');
}

function isValidEntry(value: unknown): value is DayEntry {
  if (!value || typeof value !== 'object') return false;
  const e = value as Record<string, unknown>;
  return (
    typeof e.data === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(e.data) &&
    typeof e.contatados === 'number' &&
    typeof e.respostas === 'number' &&
    typeof e.agendamentos === 'number' &&
    typeof e.comparecimentos === 'number' &&
    typeof e.conversoes === 'number'
  );
}

export async function parseImportFile(file: File): Promise<DayEntry[]> {
  const text = await file.text();
  const json = JSON.parse(text) as unknown;
  const list = Array.isArray(json)
    ? json
    : json && typeof json === 'object' && Array.isArray((json as { entries?: unknown }).entries)
      ? (json as { entries: unknown[] }).entries
      : null;

  if (!list) throw new Error('Arquivo não contém uma lista de lançamentos reconhecível.');

  const valid = list.filter(isValidEntry);
  if (valid.length === 0) throw new Error('Nenhum lançamento válido encontrado no arquivo.');

  return valid.map((e) => ({
    ...e,
    atualizadoEm: e.atualizadoEm ?? new Date().toISOString(),
  }));
}
