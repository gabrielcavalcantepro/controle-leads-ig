import type { DayEntry } from './types';
import { SEED_ENTRIES } from './seed';

const ENTRIES_KEY = 'controle-leads-ig:entries:v1';

export function loadEntries(): DayEntry[] {
  try {
    const raw = window.localStorage.getItem(ENTRIES_KEY);
    if (!raw) return SEED_ENTRIES;
    const parsed = JSON.parse(raw) as DayEntry[];
    if (!Array.isArray(parsed)) throw new Error('formato inválido');
    return parsed;
  } catch (err) {
    console.error('Falha ao ler dados salvos, iniciando com a carga inicial.', err);
    return SEED_ENTRIES;
  }
}

export function persistEntries(entries: DayEntry[]): void {
  try {
    window.localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  } catch (err) {
    console.error('Falha ao salvar dados no dispositivo.', err);
    throw err;
  }
}
