import type { ReactNode } from 'react';

interface PillProps {
  children: ReactNode;
  tone?: 'neutral' | 'accent' | 'positive' | 'negative';
  icon?: ReactNode;
}

const TONE_STYLE: Record<NonNullable<PillProps['tone']>, { bg: string; border: string; color: string }> = {
  neutral: {
    bg: 'rgba(245,244,236,0.08)',
    border: 'rgba(245,244,236,0.18)',
    color: 'var(--color-text-muted)',
  },
  accent: {
    bg: 'var(--color-accent-soft)',
    border: 'var(--color-accent-border)',
    color: 'var(--color-accent)',
  },
  positive: {
    bg: 'rgba(123,227,168,0.12)',
    border: 'rgba(123,227,168,0.35)',
    color: 'var(--color-positive)',
  },
  negative: {
    bg: 'rgba(255,111,112,0.12)',
    border: 'rgba(255,111,112,0.35)',
    color: 'var(--color-negative)',
  },
};

export function Pill({ children, tone = 'neutral', icon }: PillProps) {
  const s = TONE_STYLE[tone];
  return (
    <span
      className="pill"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
    >
      {icon}
      {children}
    </span>
  );
}
