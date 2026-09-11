import { motion } from 'framer-motion';
import { formatInt, formatPct } from '../../lib/metrics';
import type { DayTotals, Rates } from '../../lib/types';
import { IconChevronDown } from '../icons';

interface FunnelProps {
  totals: DayTotals;
  rates: Rates;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export function Funnel({ totals, rates }: FunnelProps) {
  const max = totals.contatados || 1;

  const stages = [
    { label: 'Contatados', value: totals.contatados, color: 'var(--color-novo)' },
    { label: 'Respostas', value: totals.respostas, color: 'var(--color-em-conversa)' },
    { label: 'Agendamentos', value: totals.agendamentos, color: 'var(--color-qualificado)' },
    { label: 'Comparecimentos', value: totals.comparecimentos, color: 'var(--color-agendado)' },
    { label: 'Conversões', value: totals.conversoes, color: 'var(--color-convertido)' },
  ];

  const transitions = [rates.taxaResposta, rates.taxaAgendamento, rates.taxaComparecimento, rates.taxaConversao];

  if (totals.contatados === 0) {
    return (
      <p className="py-6 text-center text-[13px] text-[var(--color-text-faint)]">
        Sem lançamentos neste período.
      </p>
    );
  }

  return (
    <div>
      {stages.map((stage, i) => (
        <div key={stage.label}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[12.5px] text-[var(--color-text-muted)]">{stage.label}</span>
            <span className="tnum text-[14px] font-semibold text-[var(--color-text)]">
              {formatInt(stage.value)}
            </span>
          </div>
          <div
            className="mt-1.5 h-2 w-full overflow-hidden rounded-full"
            style={{ background: 'rgba(245,244,236,0.06)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: stage.color, transformOrigin: 'left', width: '100%' }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: stage.value / max }}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.05 }}
            />
          </div>
          {i < stages.length - 1 && (
            <div className="flex items-center gap-1.5 py-1.5 pl-1 text-[11px] text-[var(--color-text-faint)]">
              <IconChevronDown size={11} />
              <span>{formatPct(transitions[i], 0)} seguem para a próxima etapa</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
