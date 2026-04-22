import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import styles from './SvgSlider.module.scss';

interface SvgItem {
  id: string;
  src: string;
}

interface SvgSliderProps {
  items: SvgItem[];
  onSelect?: (selectedIds: string[]) => void;
}

export const SvgSlider = ({ items, onSelect }: SvgSliderProps) => {
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

  const handleItemClick = (id: string) => {
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
          {items.map((item) => {
            const isSelected = selectedId === item.id;
            return (
              <div
                key={item.id}
                className={`${styles.item} ${isSelected ? styles.selected : ''}`}
                onClick={() => handleItemClick(item.id)}
              >
                <img 
                  src={item.src} 
                  alt={`SVG ${item.id}`}
                  className={styles.svgImage}
                />
              </div>
            );
          })}
        </div>
      </div>
      {canScrollNext && <div className={styles.arrowRight}>›</div>}
    </div>
  );
};

