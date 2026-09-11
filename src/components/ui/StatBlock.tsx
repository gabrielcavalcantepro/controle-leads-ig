import type { ReactNode } from 'react';

interface StatBlockProps {
  label: string;
  value: string;
  hero?: boolean;
  sub?: ReactNode;
  tone?: 'default' | 'accent' | 'positive' | 'negative';
}

const TONE_COLOR: Record<NonNullable<StatBlockProps['tone']>, string> = {
  default: 'var(--color-text)',
  accent: 'var(--color-accent)',
  positive: 'var(--color-positive)',
  negative: 'var(--color-negative)',
};

export function StatBlock({ label, value, hero = false, sub, tone = 'default' }: StatBlockProps) {
  return (
    <div
      className={
        hero
          ? 'card-raised rounded-[var(--radius-lg)] p-4 sm:p-5'
          : 'card rounded-[var(--radius-lg)] p-3'
      }
    >
      <p
        className={`font-medium leading-tight text-[var(--color-text-muted)] ${hero ? 'text-[12px]' : 'text-[10.5px]'}`}
      >
        {label}
      </p>
      <p
        className={`tnum mt-1.5 font-semibold ${hero ? 'text-[28px] leading-tight sm:text-[34px]' : 'text-[18px]'}`}
        style={{ color: TONE_COLOR[tone] }}
      >
        {value}
      </p>
      {sub && <div className="mt-1.5">{sub}</div>}
    </div>
  );
}
