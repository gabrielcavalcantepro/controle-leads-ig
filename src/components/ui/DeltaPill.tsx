import { IconTrendDown, IconTrendUp } from '../icons';
import { Pill } from './Pill';

interface DeltaPillProps {
  /** Diferença já calculada (atual - anterior). */
  value: number | null;
  /** Formata o valor absoluto para exibição (ex.: "3,2 p.p." ou "12"). */
  format: (absValue: number) => string;
  /** Quando true, um valor positivo é ruim (ex.: taxa de no-show subindo). */
  invert?: boolean;
}

export function DeltaPill({ value, format, invert = false }: DeltaPillProps) {
  if (value === null) {
    return <Pill tone="neutral">sem comparação</Pill>;
  }
  if (Math.abs(value) < 1e-9) {
    return <Pill tone="neutral">estável</Pill>;
  }
  const isUp = value > 0;
  const isGood = invert ? !isUp : isUp;
  return (
    <Pill tone={isGood ? 'positive' : 'negative'} icon={isUp ? <IconTrendUp size={11} /> : <IconTrendDown size={11} />}>
      {format(Math.abs(value))}
    </Pill>
  );
}
