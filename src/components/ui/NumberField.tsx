import { useCallback, useEffect, useRef } from 'react';
import { IconMinus, IconPlus } from '../icons';

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
  error?: string;
  accentColor?: string;
}

const REPEAT_DELAY = 420;
const REPEAT_INTERVAL = 90;

export function NumberField({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  hint,
  error,
}: NumberFieldProps) {
  const valueRef = useRef(value);
  valueRef.current = value;
  const timerRef = useRef<number | undefined>(undefined);
  const intervalRef = useRef<number | undefined>(undefined);

  const clamp = useCallback(
    (n: number) => {
      let v = n;
      if (min !== undefined) v = Math.max(min, v);
      if (max !== undefined) v = Math.min(max, v);
      return v;
    },
    [min, max],
  );

  const bump = useCallback(
    (delta: number) => onChange(clamp(valueRef.current + delta)),
    [clamp, onChange],
  );

  const stopRepeat = useCallback(() => {
    window.clearTimeout(timerRef.current);
    window.clearInterval(intervalRef.current);
  }, []);

  const startRepeat = useCallback(
    (delta: number) => {
      bump(delta);
      timerRef.current = window.setTimeout(() => {
        intervalRef.current = window.setInterval(() => bump(delta), REPEAT_INTERVAL);
      }, REPEAT_DELAY);
    },
    [bump],
  );

  useEffect(() => stopRepeat, [stopRepeat]);

  const handleInput = (raw: string) => {
    const digits = raw.replace(/[^0-9]/g, '');
    if (digits === '') {
      onChange(0);
      return;
    }
    onChange(clamp(Number(digits)));
  };

  return (
    <div>
      <label className="mb-1.5 block text-[13px] text-[var(--color-text-muted)]">{label}</label>
      <div
        className={`field-input flex h-14 items-stretch overflow-hidden ${error ? 'border-[var(--color-negative)]' : ''}`}
      >
        <button
          type="button"
          aria-label={`Diminuir ${label.toLowerCase()}`}
          className="flex w-14 shrink-0 items-center justify-center text-[var(--color-text-muted)] transition-colors hover:bg-white/5 hover:text-[var(--color-text)] active:scale-95"
          onPointerDown={(e) => {
            e.preventDefault();
            startRepeat(-step);
          }}
          onPointerUp={stopRepeat}
          onPointerLeave={stopRepeat}
        >
          <IconMinus size={16} />
        </button>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onFocus={(e) => e.currentTarget.select()}
          onChange={(e) => handleInput(e.target.value)}
          className="tnum w-full min-w-0 flex-1 bg-transparent text-center text-[22px] font-semibold text-[var(--color-text)]"
        />
        <button
          type="button"
          aria-label={`Aumentar ${label.toLowerCase()}`}
          className="flex w-14 shrink-0 items-center justify-center text-[var(--color-text-muted)] transition-colors hover:bg-white/5 hover:text-[var(--color-text)] active:scale-95"
          onPointerDown={(e) => {
            e.preventDefault();
            startRepeat(step);
          }}
          onPointerUp={stopRepeat}
          onPointerLeave={stopRepeat}
        >
          <IconPlus size={16} />
        </button>
      </div>
      {error ? (
        <p className="mt-1.5 text-[12px] text-[var(--color-negative)]">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-[12px] text-[var(--color-text-faint)]">{hint}</p>
      ) : null}
    </div>
  );
}
