import { useCallback, useRef, type PointerEvent } from 'react';

interface SwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  /** Мин. горизонтальное смещение для засчитывания свайпа (px). */
  threshold?: number;
  /** Макс. отклонение по Y относительно X, выше которого жест считается вертикальным. */
  verticalTolerance?: number;
}

interface SwipeHandlers {
  onPointerDown: (e: PointerEvent<HTMLElement>) => void;
  onPointerMove: (e: PointerEvent<HTMLElement>) => void;
  onPointerUp: (e: PointerEvent<HTMLElement>) => void;
  onPointerCancel: (e: PointerEvent<HTMLElement>) => void;
}

export const useHorizontalSwipe = ({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  verticalTolerance = 40,
}: SwipeOptions): SwipeHandlers => {
  const start = useRef<{ x: number; y: number; id: number } | null>(null);

  const onPointerDown = useCallback((e: PointerEvent<HTMLElement>) => {
    // Игнорируем правую/среднюю кнопки мыши; тач и основной клик — ок.
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    start.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
  }, []);

  const reset = useCallback(() => {
    start.current = null;
  }, []);

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (!start.current || start.current.id !== e.pointerId) return;
      const dy = Math.abs(e.clientY - start.current.y);
      const dx = Math.abs(e.clientX - start.current.x);
      // Если жест ушёл больше по вертикали — пусть работает обычный скролл.
      if (dy > verticalTolerance && dy > dx) {
        reset();
      }
    },
    [reset, verticalTolerance],
  );

  const onPointerUp = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (!start.current || start.current.id !== e.pointerId) return;
      const dx = e.clientX - start.current.x;
      reset();
      if (Math.abs(dx) < threshold) return;
      if (dx < 0) onSwipeLeft?.();
      else onSwipeRight?.();
    },
    [onSwipeLeft, onSwipeRight, reset, threshold],
  );

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel: reset as unknown as SwipeHandlers['onPointerCancel'],
  };
};
