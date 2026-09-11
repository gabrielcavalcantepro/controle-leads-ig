import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { DateField } from '../components/ui/DateField';
import { NumberField } from '../components/ui/NumberField';
import { useToast } from '../components/ui/Toast';
import { IconAlertTriangle, IconCheck, IconTrash } from '../components/icons';
import { formatBR, isToday, todayISO } from '../lib/date';
import { formatPct, ratesForEntry, validateEntry } from '../lib/metrics';
import type { DayTotals } from '../lib/types';
import { useEntries } from '../store/EntriesProvider';

const FIELDS: { key: keyof DayTotals; label: string }[] = [
  { key: 'contatados', label: 'Leads contatados' },
  { key: 'respostas', label: 'Respostas recebidas' },
  { key: 'qualificados', label: 'Leads qualificados' },
  { key: 'agendamentos', label: 'Agendamentos' },
  { key: 'comparecimentos', label: 'Comparecimentos' },
  { key: 'conversoes', label: 'Conversões' },
];

const WARNING_FIELD: Record<string, keyof DayTotals> = {
  'Respostas maior que contatados.': 'respostas',
  'Qualificados maior que respostas.': 'qualificados',
  'Agendamentos maior que qualificados.': 'agendamentos',
  'Comparecimentos maior que agendamentos.': 'comparecimentos',
  'Conversões maior que comparecimentos.': 'conversoes',
};

const EMPTY: DayTotals = {
  contatados: 0,
  respostas: 0,
  qualificados: 0,
  agendamentos: 0,
  comparecimentos: 0,
  conversoes: 0,
};

interface PreencherScreenProps {
  date: string;
  onDateChange: (date: string) => void;
}

export function PreencherScreen({ date, onDateChange: setDate }: PreencherScreenProps) {
  const { entryByDate, upsertEntry, deleteEntry } = useEntries();
  const { showToast } = useToast();
  const [form, setForm] = useState<DayTotals>(EMPTY);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const existing = entryByDate.get(date);

  useEffect(() => {
    setForm(existing ? { ...existing } : EMPTY);
  }, [date, existing]);

  const warnings = useMemo(() => validateEntry(form), [form]);
  const rates = useMemo(() => ratesForEntry(form), [form]);
  const hasAnyValue = FIELDS.some((f) => form[f.key] > 0);
  const isDirty = existing
    ? FIELDS.some((f) => form[f.key] !== existing[f.key])
    : hasAnyValue;

  const handleSave = () => {
    upsertEntry(date, form);
    showToast({
      type: 'success',
      title: existing ? 'Lançamento atualizado' : 'Lançamento salvo',
      description: `${formatBR(date)} · resposta ${formatPct(rates.taxaResposta)} · conversão geral ${formatPct(rates.taxaConversaoGeral)}`,
    });
  };

  const handleDelete = () => {
    deleteEntry(date);
    setConfirmDelete(false);
    setForm(EMPTY);
    showToast({ type: 'info', title: 'Lançamento excluído', description: formatBR(date) });
  };

  return (
    <div className="mx-auto max-w-[520px] px-4 pt-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card>
          <CardHeader
            title={existing ? 'Editar lançamento' : 'Novo lançamento'}
            action={
              existing && (
                <button
                  type="button"
                  aria-label="Excluir lançamento deste dia"
                  onClick={() => setConfirmDelete(true)}
                  className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-faint)] transition-colors hover:bg-[rgba(255,111,112,0.1)] hover:text-[var(--color-negative)]"
                >
                  <IconTrash size={15} />
                </button>
              )
            }
          />
          <CardContent className="flex flex-col gap-4">
            <DateField label="Data" value={date} max={todayISO()} onChange={setDate} />

            {FIELDS.map((f) => (
              <NumberField
                key={f.key}
                label={f.label}
                value={form[f.key]}
                onChange={(v) => setForm((prev) => ({ ...prev, [f.key]: v }))}
                error={warnings.find((w) => WARNING_FIELD[w] === f.key)}
              />
            ))}
          </CardContent>
        </Card>

        {hasAnyValue && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4"
          >
            <Card>
              <CardHeader title="Prévia das taxas deste dia" />
              <CardContent>
                <div className="grid grid-cols-4 gap-2.5">
                  <RatePreview label="Resposta" value={rates.taxaResposta} />
                  <RatePreview label="Qualific." value={rates.taxaQualificacao} />
                  <RatePreview label="Agendam." value={rates.taxaAgendamento} />
                  <RatePreview label="Comparec." value={rates.taxaComparecimento} />
                  <RatePreview label="No-show" value={rates.taxaNoShow} />
                  <RatePreview label="Conversão" value={rates.taxaConversao} />
                  <RatePreview label="Conv. geral" value={rates.taxaConversaoGeral} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="mt-5 flex flex-col gap-2">
          <Button variant="primary" className="w-full" onClick={handleSave} disabled={!isDirty}>
            <IconCheck size={16} />
            {existing ? 'Salvar alterações' : 'Salvar lançamento'}
          </Button>
          {!isToday(date) && (
            <p className="flex items-center justify-center gap-1.5 text-center text-[11.5px] text-[var(--color-text-faint)]">
              <IconAlertTriangle size={12} />
              Você está lançando um dia diferente de hoje.
            </p>
          )}
        </div>
      </motion.div>

      <ConfirmDialog
        open={confirmDelete}
        title="Excluir lançamento"
        description={`Isso remove os números de ${formatBR(date)}. Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}

function RatePreview({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="card-sunken rounded-[var(--radius-sm)] px-2.5 py-2.5 text-center">
      <p className="text-[10.5px] text-[var(--color-text-faint)]">{label}</p>
      <p className="tnum mt-0.5 text-[16px] font-semibold text-[var(--color-text)]">
        {formatPct(value)}
      </p>
    </div>
  );
}
