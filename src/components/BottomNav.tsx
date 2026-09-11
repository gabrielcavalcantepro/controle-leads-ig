import { IconChartBar, IconEdit, IconList } from './icons';

export type Screen = 'preencher' | 'metricas' | 'historico';

interface BottomNavProps {
  screen: Screen;
  onChange: (screen: Screen) => void;
}

const ITEMS: { key: Screen; label: string; icon: (active: boolean) => React.ReactNode }[] = [
  { key: 'preencher', label: 'Preencher', icon: (a) => <IconEdit size={19} strokeWidth={a ? 1.9 : 1.6} /> },
  { key: 'metricas', label: 'Métricas', icon: (a) => <IconChartBar size={19} strokeWidth={a ? 1.9 : 1.6} /> },
  { key: 'historico', label: 'Histórico', icon: (a) => <IconList size={19} strokeWidth={a ? 1.9 : 1.6} /> },
];

export function BottomNav({ screen, onChange }: BottomNavProps) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-base)]/92 backdrop-blur-md"
      style={{ paddingBottom: 'var(--safe-bottom)' }}
    >
      <div className="mx-auto flex max-w-[520px] items-stretch">
        {ITEMS.map((item) => {
          const active = item.key === screen;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              className="flex flex-1 flex-col items-center gap-1 py-2.5 transition-colors"
              style={{ color: active ? 'var(--color-accent)' : 'var(--color-text-faint)' }}
            >
              {item.icon(active)}
              <span className="text-[10.5px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
