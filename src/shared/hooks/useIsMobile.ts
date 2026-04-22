import { useAppSelector } from '@shared/store';
import { selectIsMobile } from '@entities/app';

/**
 * Читает признак мобильной платформы из Redux.
 * Значение туда кладёт init() при старте приложения.
 */
export const useIsMobile = (): boolean => useAppSelector(selectIsMobile);
