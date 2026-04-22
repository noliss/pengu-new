import { useEffect } from 'react';
import { backButtonManager } from '@shared/lib/backButtonManager';

/**
 * Подписывает компонент на Telegram back-кнопку.
 *
 * Использование:
 *   useTelegramBackButton(enabled, () => navigate(-1));
 *
 * Любое число одновременно смонтированных вызовов работает корректно:
 * обработчик, смонтированный последним, выполняется первым (стек).
 */
export const useTelegramBackButton = (enabled: boolean, handler: () => void): void => {
  useEffect(() => {
    if (!enabled) return;
    return backButtonManager.push(handler);
  }, [enabled, handler]);
};
