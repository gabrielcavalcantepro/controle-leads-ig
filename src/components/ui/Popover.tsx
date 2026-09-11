import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PopoverProps {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
  children: ReactNode;
  align?: 'start' | 'end';
}

interface Position {
  top: number;
  left: number;
  ready: boolean;
}

const MARGIN = 8;

export function Popover({ open, onClose, anchorRef, children, align = 'start' }: PopoverProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<Position>({ top: 0, left: 0, ready: false });
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Fase 1: posição otimista logo abaixo do gatilho, antes de medir o painel.
  useLayoutEffect(() => {
    if (!open) return;
    const anchor = anchorRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    setPos({ top: rect.bottom + MARGIN, left: align === 'end' ? rect.right : rect.left, ready: false });
  }, [open, anchorRef, align]);

  // Fase 2: corrige a posição depois de medir o tamanho real do painel,
  // presa às bordas da viewport.
  useLayoutEffect(() => {
    if (!open) return;
    const anchor = anchorRef.current;
    const panel = panelRef.current;
    if (!anchor || !panel) return;

    const place = () => {
      const rect = anchor.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      let left = align === 'end' ? rect.right - panelRect.width : rect.left;
      let top = rect.bottom + MARGIN;

      left = Math.min(Math.max(MARGIN, left), window.innerWidth - panelRect.width - MARGIN);
      if (top + panelRect.height > window.innerHeight - MARGIN) {
        top = rect.top - panelRect.height - MARGIN;
      }
      top = Math.max(MARGIN, top);

      setPos({ top, left, ready: true });
    };

    place();
  }, [open, anchorRef, align, children]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      onCloseRef.current();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    const handleReposition = () => onCloseRef.current();

    window.addEventListener('pointerdown', handlePointerDown, true);
    window.addEventListener('keydown', handleKey);
    window.addEventListener('scroll', handleReposition, true);
    window.addEventListener('resize', handleReposition);
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown, true);
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('scroll', handleReposition, true);
      window.removeEventListener('resize', handleReposition);
    };
  }, [open, anchorRef]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: pos.ready ? 1 : 0, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="card-raised fixed z-[95] rounded-[var(--radius-md)] p-3"
          style={{ top: pos.top, left: pos.left }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
