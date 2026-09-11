import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { loadEntries, persistEntries } from '../lib/storage';
import type { DayEntry, DayTotals } from '../lib/types';

interface EntriesContextValue {
  entries: DayEntry[];
  entryByDate: Map<string, DayEntry>;
  upsertEntry: (data: string, totals: DayTotals) => DayEntry;
  deleteEntry: (data: string) => void;
  replaceAll: (entries: DayEntry[]) => void;
}

const EntriesContext = createContext<EntriesContextValue | null>(null);

export function EntriesProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<DayEntry[]>([]);
  // Estado (não ref) de propósito: o efeito de persistência precisa ver
  // `isHydrated` e `entries` do MESMO render para não gravar um array vazio
  // no localStorage antes da carga inicial realmente aplicar seus dados —
  // uma ref mutada de forma síncrona dispararia essa gravação prematura em
  // React StrictMode (duplo disparo de efeitos no mount).
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setEntries(loadEntries());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    persistEntries(entries);
  }, [entries, isHydrated]);

  const entryByDate = useMemo(() => {
    const map = new Map<string, DayEntry>();
    for (const e of entries) map.set(e.data, e);
    return map;
  }, [entries]);

  const value = useMemo<EntriesContextValue>(
    () => ({
      entries,
      entryByDate,
      upsertEntry: (data, totals) => {
        const next: DayEntry = { data, ...totals, atualizadoEm: new Date().toISOString() };
        setEntries((prev) => {
          const idx = prev.findIndex((e) => e.data === data);
          if (idx === -1) return [...prev, next];
          const copy = [...prev];
          copy[idx] = next;
          return copy;
        });
        return next;
      },
      deleteEntry: (data) => {
        setEntries((prev) => prev.filter((e) => e.data !== data));
      },
      replaceAll: (next) => {
        setEntries(next);
      },
    }),
    [entries, entryByDate],
  );

  return <EntriesContext.Provider value={value}>{children}</EntriesContext.Provider>;
}

export function useEntries(): EntriesContextValue {
  const ctx = useContext(EntriesContext);
  if (!ctx) throw new Error('useEntries precisa estar dentro de <EntriesProvider>');
  return ctx;
}
