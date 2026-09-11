import { useId, useRef, useState } from 'react';
import { formatShort } from '../../lib/date';

export interface SeriesPoint {
  date: string;
  value: number;
}

interface TimeSeriesChartProps {
  data: SeriesPoint[];
  formatValue: (v: number) => string;
  color?: string;
  height?: number;
}

const WIDTH = 600;

export function TimeSeriesChart({
  data,
  formatValue,
  color = 'var(--color-accent)',
  height = 160,
}: TimeSeriesChartProps) {
  const gradientId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-[13px] text-[var(--color-text-faint)]">
        Sem dados suficientes para o gráfico.
      </p>
    );
  }

  const values = data.map((d) => d.value);
  const max = Math.max(...values, 0);
  const min = Math.min(...values, 0);
  const span = max - min || 1;
  const padTop = 12;
  const padBottom = 8;
  const plotH = height - padTop - padBottom;

  const x = (i: number) => (data.length === 1 ? WIDTH / 2 : (i / (data.length - 1)) * WIDTH);
  const y = (v: number) => padTop + plotH - ((v - min) / span) * plotH;

  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(d.value)}`).join(' ');
  const areaPath = `${linePath} L${x(data.length - 1)},${height - padBottom} L${x(0)},${height - padBottom} Z`;

  const gridLines = [0.25, 0.5, 0.75].map((f) => padTop + plotH * f);

  const updateActiveFromClientX = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const idx = Math.round(ratio * (data.length - 1));
    setActiveIndex(idx);
  };

  const active = activeIndex !== null ? data[activeIndex] : null;
  const activeLeftPct = activeIndex !== null ? (x(activeIndex) / WIDTH) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="relative touch-none select-none"
      onPointerDown={(e) => updateActiveFromClientX(e.clientX)}
      onPointerMove={(e) => {
        if (e.buttons === 0 && e.pointerType === 'mouse') updateActiveFromClientX(e.clientX);
        else if (e.pressure > 0 || e.pointerType === 'touch') updateActiveFromClientX(e.clientX);
      }}
      onPointerLeave={() => setActiveIndex(null)}
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${height}`}
        preserveAspectRatio="none"
        className="block w-full"
        style={{ height }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.32} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        {gridLines.map((gy, i) => (
          <line
            key={i}
            x1={0}
            x2={WIDTH}
            y1={gy}
            y2={gy}
            stroke="rgba(245,244,236,0.06)"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        ))}

        <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={2.25}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {activeIndex !== null && (
          <>
            <line
              x1={x(activeIndex)}
              x2={x(activeIndex)}
              y1={padTop}
              y2={height - padBottom}
              stroke="rgba(245,244,236,0.18)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
            <circle cx={x(activeIndex)} cy={y(data[activeIndex].value)} r={4} fill={color} />
          </>
        )}
      </svg>

      {active && (
        <div
          className="card-raised pointer-events-none absolute top-0 z-10 -translate-y-full rounded-[var(--radius-md)] px-3 py-2 text-center"
          style={{
            left: `clamp(4%, ${activeLeftPct}%, 96%)`,
            transform: 'translate(-50%, calc(-100% - 8px))',
          }}
        >
          <p className="whitespace-nowrap text-[11px] text-[var(--color-text-faint)]">
            {formatShort(active.date)}
          </p>
          <p className="tnum whitespace-nowrap text-[13px] font-semibold text-[var(--color-text)]">
            {formatValue(active.value)}
          </p>
        </div>
      )}
    </div>
  );
}
