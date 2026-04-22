import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import styles from './TextSlider.module.scss';

interface TextBlock {
  id: string;
  text: string;
}

interface TextSliderProps {
  blocks: TextBlock[];
  onSelect?: (selectedIds: string[]) => void;
}

export const TextSlider = ({ blocks, onSelect }: TextSliderProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    axis: 'x',
    dragFree: true,
    containScroll: 'trimSnaps'
  }, [WheelGesturesPlugin()]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (onSelect) {
      onSelect(selectedId ? [selectedId] : []);
    }
  }, [selectedId, onSelect]);

  const onSelectEmbla = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    // Используем setTimeout чтобы избежать синхронного setState в эффекте
    setTimeout(() => {
      onSelectEmbla();
    }, 0);
    emblaApi.on('select', onSelectEmbla);
    emblaApi.on('reInit', onSelectEmbla);
    return () => {
      emblaApi.off('select', onSelectEmbla);
      emblaApi.off('reInit', onSelectEmbla);
    };
  }, [emblaApi, onSelectEmbla]);

  const handleBlockClick = (id: string) => {
    // Выбираем только один элемент - если кликнули на уже выбранный, снимаем выбор
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!emblaApi) return;
    e.preventDefault();
    if (e.deltaY > 0) {
      emblaApi.scrollNext();
    } else {
      emblaApi.scrollPrev();
    }
  }, [emblaApi]);

  return (
    <div className={styles.wrapper}>
      {canScrollPrev && <div className={styles.arrowLeft}>‹</div>}
      <div className={styles.embla} ref={emblaRef} onWheel={handleWheel}>
        <div className={styles.emblaContainer}>
          {blocks.map((block) => {
            const isSelected = selectedId === block.id;
            return (
              <div
                key={block.id}
                className={`${styles.block} ${isSelected ? styles.selected : ''}`}
                onClick={() => handleBlockClick(block.id)}
              >
                {block.text}
              </div>
            );
          })}
        </div>
      </div>
      {canScrollNext && <div className={styles.arrowRight}>›</div>}
    </div>
  );
};

