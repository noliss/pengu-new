import { backButton } from '@tma.js/sdk-react';

/**
 * Менеджер Telegram back-кнопки.
 *
 * Проблема: в приложении несколько мест одновременно хотят обрабатывать back
 * (страница + открытая модалка + шаг внутри страницы). Если каждое место
 * подписывается на backButton.onClick, мы получим множественные вызовы
 * или случайный порядок обработки.
 *
 * Решение: стек обработчиков. На back выполняется только ВЕРХНИЙ handler.
 * Когда модалка закрывается — она снимает свой handler со стека, и back снова
 * переходит к странице.
 */

type BackHandler = () => void;

const stack: BackHandler[] = [];
let isSdkSubscribed = false;
let unsubscribeSdk: (() => void) | null = null;

const sdkHandler = () => {
  const top = stack[stack.length - 1];
  if (top) top();
};

const ensureSdkSubscribed = () => {
  if (isSdkSubscribed) return;
  try {
    unsubscribeSdk = backButton.onClick(sdkHandler);
    isSdkSubscribed = true;
  } catch {
    // SDK ещё не проинициализирован / не Telegram — тихо игнорируем
  }
};

const refreshVisibility = () => {
  try {
    if (stack.length > 0) {
      backButton.show();
    } else {
      backButton.hide();
    }
  } catch {
    /* noop */
  }
};

export const backButtonManager = {
  /** Добавляет обработчик на вершину стека. Возвращает функцию снятия. */
  push(handler: BackHandler): () => void {
    ensureSdkSubscribed();
    stack.push(handler);
    refreshVisibility();

    return () => {
      const index = stack.lastIndexOf(handler);
      if (index >= 0) stack.splice(index, 1);
      refreshVisibility();
    };
  },

  /** Полная очистка — вызывать только при unmount всего приложения */
  destroy() {
    stack.length = 0;
    try {
      unsubscribeSdk?.();
    } catch {
      /* noop */
    }
    unsubscribeSdk = null;
    isSdkSubscribed = false;
    refreshVisibility();
  },
};
