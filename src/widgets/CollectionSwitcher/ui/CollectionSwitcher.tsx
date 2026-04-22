import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import cn from 'classnames';
import { useHorizontalSwipe } from '@shared/lib/useHorizontalSwipe';
import styles from './CollectionSwitcher.module.scss';

export type SwitchDirection = 'next' | 'prev';

interface CollectionSwitcherProps {
  title: string;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  /**
   * Направление последнего переключения — управляет, куда улетает старое
   * название и откуда прилетает новое. Меняется в GeneratePage синхронно
   * с индексом коллекции.
   */
  direction: SwitchDirection;
}

// Должно совпадать с длительностью анимаций в CollectionSwitcher.module.scss.
const SWAP_DURATION_MS = 280;

/**
 * Компактный переключатель коллекций над превью персонажа: название по центру
 * с "двойной буферной" анимацией (уходящий + приходящий заголовки), стрелки
 * по бокам с дизейблом на границах. На мобиле дополняется свайпом по stage.
 */
export const CollectionSwitcher = ({
  title,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  direction,
}: CollectionSwitcherProps) => {
  // Двойной буфер: во время анимации живут одновременно уходящее (outgoing)
  // и текущее (displayed) названия. Через SWAP_DURATION_MS outgoing удаляется.
  const [displayedTitle, setDisplayedTitle] = useState(title);
  const [outgoingTitle, setOutgoingTitle] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (title === displayedTitle) return;

    setOutgoingTitle(displayedTitle);
    setDisplayedTitle(title);

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setOutgoingTitle(null);
      timerRef.current = null;
    }, SWAP_DURATION_MS);
  }, [title, displayedTitle]);

  useEffect(
    () => () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    },
    [],
  );

  // Свайп по самой пилюле переключателя: влево — вперёд, вправо — назад.
  // Стрелки и свайп работают от одних и тех же callback'ов, поэтому граница
  // списка корректно удерживает индекс (см. handlePrev/Next в GeneratePage).
  const swipeHandlers = useHorizontalSwipe({
    onSwipeLeft: onNext,
    onSwipeRight: onPrev,
  });

  return (
    <Box
      className={styles.root}
      role="toolbar"
      aria-label="Переключение коллекции"
      {...swipeHandlers}
    >
      <IconButton
        className={styles.arrow}
        onClick={onPrev}
        disabled={!hasPrev}
        aria-label="Предыдущая коллекция"
      >
        <ChevronLeftIcon />
      </IconButton>

      <Box className={styles.titleWrap} aria-live="polite">
        {outgoingTitle !== null && (
          <span
            key={`out-${outgoingTitle}-${direction}`}
            className={cn(
              styles.title,
              styles.titleOut,
              direction === 'next' ? styles.outToLeft : styles.outToRight,
            )}
            aria-hidden
          >
            {outgoingTitle}
          </span>
        )}
        <span
          key={`in-${displayedTitle}-${direction}`}
          className={cn(
            styles.title,
            styles.titleIn,
            direction === 'next' ? styles.inFromRight : styles.inFromLeft,
          )}
        >
          {displayedTitle}
        </span>
      </Box>

      <IconButton
        className={styles.arrow}
        onClick={onNext}
        disabled={!hasNext}
        aria-label="Следующая коллекция"
      >
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );
};
