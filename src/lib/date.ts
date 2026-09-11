const pad2 = (n: number) => String(n).padStart(2, '0');

/** Parses a YYYY-MM-DD string into a local-midnight Date (no timezone drift). */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function toISODate(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function addDays(iso: string, days: number): string {
  const d = parseISODate(iso);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

export function addMonths(iso: string, months: number): string {
  const d = parseISODate(iso);
  d.setMonth(d.getMonth() + months);
  return toISODate(d);
}

export function isBefore(a: string, b: string): boolean {
  return a < b;
}

export function isAfter(a: string, b: string): boolean {
  return a > b;
}

export function clampISO(iso: string, min?: string, max?: string): string {
  let v = iso;
  if (min && isBefore(v, min)) v = min;
  if (max && isAfter(v, max)) v = max;
  return v;
}

/** Monday of the ISO week containing `iso`. */
export function startOfWeek(iso: string): string {
  const d = parseISODate(iso);
  const day = d.getDay(); // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return toISODate(d);
}

export function endOfWeek(iso: string): string {
  return addDays(startOfWeek(iso), 6);
}

export function startOfMonth(iso: string): string {
  const d = parseISODate(iso);
  return toISODate(new Date(d.getFullYear(), d.getMonth(), 1));
}

export function endOfMonth(iso: string): string {
  const d = parseISODate(iso);
  return toISODate(new Date(d.getFullYear(), d.getMonth() + 1, 0));
}

/** Every ISO date from start to end, inclusive. */
export function dateRange(start: string, end: string): string[] {
  const out: string[] = [];
  let cur = start;
  let guard = 0;
  while (!isAfter(cur, end) && guard < 3660) {
    out.push(cur);
    cur = addDays(cur, 1);
    guard += 1;
  }
  return out;
}

const DIAS_SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const MESES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];
const MESES_ABREV = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
];

export function formatBR(iso: string): string {
  const d = parseISODate(iso);
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export function formatShort(iso: string): string {
  const d = parseISODate(iso);
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}`;
}

export function formatWeekday(iso: string): string {
  const d = parseISODate(iso);
  return DIAS_SEMANA[d.getDay()];
}

export function formatLong(iso: string): string {
  const d = parseISODate(iso);
  return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
}

export function formatMonthLabel(iso: string): string {
  const d = parseISODate(iso);
  return `${MESES[d.getMonth()]} de ${d.getFullYear()}`;
}

export function formatMonthShort(iso: string): string {
  const d = parseISODate(iso);
  return `${MESES_ABREV[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`;
}

export function formatWeekLabel(iso: string): string {
  const start = startOfWeek(iso);
  const end = endOfWeek(iso);
  return `${formatShort(start)} – ${formatShort(end)}`;
}

export function isToday(iso: string): boolean {
  return iso === todayISO();
}
