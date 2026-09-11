import { AnimatePresence, motion } from 'framer-motion';
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { IconAlertTriangle, IconCheck, IconInfo, IconX } from '../icons';

type ToastType = 'success' | 'error' | 'info';

interface ToastInput {
  type?: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastItem extends Required<Omit<ToastInput, 'description'>> {
  id: number;
  description?: string;
}

interface ToastContextValue {
  showToast: (toast: ToastInput) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastType, ReactNode> = {
  success: <IconCheck />,
  error: <IconAlertTriangle />,
  info: <IconInfo />,
};

const TONE_CLASS: Record<ToastType, string> = {
  success: 'border-[var(--color-accent-border)] bg-[var(--color-accent-soft)]',
  error: 'border-[rgba(255,111,112,0.35)] bg-[rgba(255,111,112,0.1)]',
  info: 'border-[var(--color-border-strong)] bg-[var(--color-surface-raised)]',
};

const ICON_TONE_CLASS: Record<ToastType, string> = {
  success: 'text-[var(--color-accent)]',
  error: 'text-[var(--color-negative)]',
  info: 'text-[var(--color-text-muted)]',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type = 'info', title, description, duration = 3200 }: ToastInput) => {
      const id = idRef.current++;
      setToasts((prev) => [...prev, { id, type, title, description, duration }]);
      window.setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {createPortal(
        <div
          className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-stretch gap-2 p-3 pb-[calc(env(safe-area-inset-bottom,0px)+76px)] sm:inset-x-auto sm:right-0 sm:w-[360px] sm:items-end sm:pb-4"
          aria-live="polite"
        >
          <AnimatePresence initial={false}>
            {toasts.map((t) => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 24, transition: { duration: 0.15 } }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => dismiss(t.id)}
                className={`card-raised backdrop-blur-md pointer-events-auto flex w-full cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border px-4 py-3 sm:w-full ${TONE_CLASS[t.type]}`}
              >
                <span className={`mt-0.5 shrink-0 ${ICON_TONE_CLASS[t.type]}`}>
                  {ICONS[t.type]}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-medium text-[var(--color-text)]">
                    {t.title}
                  </span>
                  {t.description && (
                    <span className="mt-0.5 block text-[12px] text-[var(--color-text-muted)]">
                      {t.description}
                    </span>
                  )}
                </span>
                <IconX className="mt-0.5 shrink-0 text-[var(--color-text-faint)]" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast precisa estar dentro de <ToastProvider>');
  return ctx;
}
