import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';
import { createPersistMiddleware, loadPersistedState } from './persist';

/**
 * Персистим ТОЛЬКО `character` (черновик генератора) — чтобы пользователь
 * не терял наработки при перезагрузке Mini App.
 *
 * `user` не персистим сознательно: сессию всегда получаем свежей через валидацию
 * initData на бэке (см. authenticateUser thunk).
 * `wallet` не персистим: TonConnect сам восстанавливает подключение.
 * `app`, `collection` — транзиентные.
 */
type PersistableState = {
  character: ReturnType<typeof rootReducer>['character'];
};

const PERSIST_CONFIG = {
  whitelist: ['character'] as const satisfies ReadonlyArray<keyof PersistableState>,
};

const preloadedState = loadPersistedState<PersistableState>({
  whitelist: [...PERSIST_CONFIG.whitelist],
});

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: preloadedState as never,
  middleware: (getDefault) =>
    getDefault().concat(
      createPersistMiddleware<PersistableState>({
        whitelist: [...PERSIST_CONFIG.whitelist],
      }),
    ),
  devTools: import.meta.env.DEV,
});
