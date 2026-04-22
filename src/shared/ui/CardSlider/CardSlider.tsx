import { useEffect, useCallback, useState, type ReactNode } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import cn from 'classnames';
import styles from './CardSlider.module.scss';

export interface CardSliderItem {
  id: string;
}

export interface CardSliderProps<T extends CardSliderItem> {
  items: T[];
  selectedId?: string | null;
  /** Id элементов, помеченных как "настроенные" (имеют выбор, но не активны сейчас) */
  configuredIds?: string[];
  onSelect?: (id: string | null) => void;
  renderItem: (item: T, isSelected: boolean) => ReactNode;
  /** Визуальный класс для карточки (предопределённые: 'text' | 'image') */
  itemVariant?: 'text' | 'image';
  className?: string;
}

/**
 * Горизонтальный слайдер на базе embla-carousel.
 * Controlled: selectedId приходит извне, onSelect вызывается только по клику.
 */
export const CardSlider = <T extends CardSliderItem>({
  items,
  selectedId = null,
  configuredIds,
  onSelect,
  renderItem,
  itemVariant = 'text',
  className,
}: CardSliderProps<T>) => {
  const configuredSet = configuredIds ? new Set(configuredIds) : null;
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { axis: 'x', dragFree: true, containScroll: 'trimSnaps' },
    [WheelGesturesPlugin()],
  );
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    updateScrollState();
    emblaApi.on('select', updateScrollState);
    emblaApi.on('reInit', updateScrollState);
    return () => {
      emblaApi.off('select', updateScrollState);
      emblaApi.off('reInit', updateScrollState);
    };
  }, [emblaApi, updateScrollState]);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!emblaApi) return;
      e.preventDefault();
      if (e.deltaY > 0) emblaApi.scrollNext();
      else emblaApi.scrollPrev();
    },
    [emblaApi],
  );

  const handleItemClick = useCallback(
    (id: string) => {
      if (!onSelect) return;
      onSelect(selectedId === id ? null : id);
    },
    [selectedId, onSelect],
  );

  return (
    <div className={cn(styles.wrapper, className)}>
      {canScrollPrev && <div className={cn(styles.arrow, styles.arrowLeft)}>‹</div>}
      <div className={styles.embla} ref={emblaRef} onWheel={handleWheel}>
        <div className={styles.emblaContainer}>
          {items.map((item) => {
            const isSelected = selectedId === item.id;
            const isConfigured = !isSelected && configuredSet?.has(item.id) === true;
            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={cn(
                  styles.itemBase,
                  itemVariant === 'text' && styles.itemText,
                  itemVariant === 'image' && styles.itemImage,
                  isSelected && styles.selected,
                  isConfigured && styles.configured,
                )}
              >
                {renderItem(item, isSelected)}
              </div>
            );
          })}
        </div>
      </div>
      {canScrollNext && <div className={cn(styles.arrow, styles.arrowRight)}>›</div>}
    </div>
  );
};
