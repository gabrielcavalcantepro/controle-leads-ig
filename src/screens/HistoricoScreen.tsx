import { useRef, useState } from 'react';
import { IconDownload, IconEdit, IconTrash, IconUpload } from '../components/icons';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useToast } from '../components/ui/Toast';
import { exportCSV, exportJSON, parseImportFile } from '../lib/backup';
import { formatBR, formatWeekday, isToday } from '../lib/date';
import { formatInt, formatPct, ratesForEntry } from '../lib/metrics';
import { useEntries } from '../store/EntriesProvider';

interface HistoricoScreenProps {
  onEditDate: (date: string) => void;
}

export function HistoricoScreen({ onEditDate }: HistoricoScreenProps) {
  const { entries, replaceAll, deleteEntry } = useEntries();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const sorted = [...entries].sort((a, b) => b.data.localeCompare(a.data));

  const handleImport = async (file: File) => {
    try {
      const imported = await parseImportFile(file);
      const merged = new Map(entries.map((e) => [e.data, e]));
      for (const e of imported) merged.set(e.data, e);
      replaceAll([...merged.values()].sort((a, b) => a.data.localeCompare(b.data)));
      showToast({
        type: 'success',
        title: 'Backup importado',
        description: `${imported.length} dia(s) mesclado(s) com o histórico atual.`,
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Não foi possível importar',
        description: err instanceof Error ? err.message : 'Arquivo inválido.',
      });
    }
  };

  return (
    <div className="mx-auto max-w-[520px] px-4 pt-4 pb-4">
      <Card className="mb-4">
        <CardHeader title="Backup" />
        <CardContent className="flex flex-col gap-3">
          <p className="text-[12px] leading-relaxed text-[var(--color-text-faint)]">
            Os dados ficam salvos só neste aparelho. Exporte de vez em quando para não correr o
            risco de perder o histórico.
          </p>
          <div className="flex gap-2.5">
            <Button className="flex-1" onClick={() => exportJSON(entries)}>
              <IconDownload size={14} />
              JSON
            </Button>
            <Button className="flex-1" onClick={() => exportCSV(entries)}>
              <IconDownload size={14} />
              CSV
            </Button>
            <Button className="flex-1" onClick={() => fileInputRef.current?.click()}>
              <IconUpload size={14} />
              Importar
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImport(file);
              e.target.value = '';
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader title={`${sorted.length} lançamento(s)`} />
        <CardContent className="p-0!">
          <ul>
            {sorted.map((entry) => {
              const rates = ratesForEntry(entry);
              return (
                <li
                  key={entry.data}
                  className="border-t border-[var(--color-border)] px-4 py-3 first:border-t-0 sm:px-5"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onEditDate(entry.data)}
                      className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                    >
                      <span className="tnum shrink-0 text-[13.5px] font-medium text-[var(--color-text)]">
                        {formatBR(entry.data).slice(0, 5)}
                      </span>
                      <span className="shrink-0 text-[10.5px] text-[var(--color-text-faint)]">
                        {isToday(entry.data) ? 'hoje' : formatWeekday(entry.data)}
                      </span>
                      <span className="tnum ml-auto shrink-0 text-[13px] font-medium text-[var(--color-accent)]">
                        {formatPct(rates.taxaConversaoGeral)}
                      </span>
                    </button>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        aria-label={`Editar ${formatBR(entry.data)}`}
                        onClick={() => onEditDate(entry.data)}
                        className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-faint)] hover:bg-white/5 hover:text-[var(--color-text)]"
                      >
                        <IconEdit size={14} />
                      </button>
                      <button
                        type="button"
                        aria-label={`Excluir ${formatBR(entry.data)}`}
                        onClick={() => setDeleteTarget(entry.data)}
                        className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-faint)] hover:bg-[rgba(255,111,112,0.1)] hover:text-[var(--color-negative)]"
                      >
                        <IconTrash size={14} />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onEditDate(entry.data)}
                    className="tnum mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-left text-[11.5px] text-[var(--color-text-faint)]"
                  >
                    <span>{formatInt(entry.contatados)} contatados</span>
                    <span>{formatInt(entry.respostas)} resp.</span>
                    <span>{formatInt(entry.agendamentos)} agend.</span>
                    <span>{formatInt(entry.comparecimentos)} comp.</span>
                    <span>{formatInt(entry.conversoes)} conv.</span>
                  </button>
                </li>
              );
            })}
            {sorted.length === 0 && (
              <li className="px-5 py-8 text-center text-[13px] text-[var(--color-text-faint)]">
                Nenhum lançamento ainda.
              </li>
            )}
          </ul>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Excluir lançamento"
        description={deleteTarget ? `Isso remove os números de ${formatBR(deleteTarget)}. Essa ação não pode ser desfeita.` : ''}
        confirmLabel="Excluir"
        danger
        onConfirm={() => {
          if (deleteTarget) {
            deleteEntry(deleteTarget);
            showToast({ type: 'info', title: 'Lançamento excluído', description: formatBR(deleteTarget) });
          }
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
