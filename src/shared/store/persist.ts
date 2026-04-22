import type { Middleware } from '@reduxjs/toolkit';

/**
 * Persist — сохраняет выбранные куски Redux-состояния в localStorage.
 *
 * Зачем: у пользователя должен сохраняться черновик генератора персонажа,
 * последний подключённый кошелёк и т.п. при перезагрузке/возврате в Mini App.
 *
 * Как работает:
 * 1. loadPersistedState() читает из localStorage при старте и возвращает
 *    partial-стейт для configureStore({ preloadedState }).
 * 2. createPersistMiddleware() после каждого action читает whitelist-ключи
 *    из стора и пишет в localStorage с debounce 300 мс.
 *
 * ВАЖНО:
 * - В whitelist кладём ТОЛЬКО безопасные и не-секретные данные (настройки, драфт).
 *   Токены/сессии/initData — сюда НЕ кладём: для них есть sessionStorage / httpOnly cookie / CloudStorage.
 * - При изменении структуры слайса увеличивай VERSION — старый стейт просто сбросится.
 * - Для синка между устройствами в TMA лучше подойдёт Telegram CloudStorage,
 *   это можно добавить позже как альтернативный backend (см. migrateToCloudStorage TODO).
 */

const STORAGE_KEY = 'pengu.state.v2';
const VERSION = 2;
const DEBOUNCE_MS = 300;

type PartialState = Record<string, unknown>;

export type PersistConfig<TState extends object> = {
  /** Ключи-слайсы, которые нужно сохранять */
  whitelist: (keyof TState & string)[];
};

const isStorageAvailable = (): boolean => {
  try {
    const testKey = '__pengu_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

export const loadPersistedState = <TState extends object>(
  config: PersistConfig<TState>,
): Partial<TState> | undefined => {
  if (!isStorageAvailable()) return undefined;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;

    const parsed = JSON.parse(raw) as { version: number; state: PartialState } | null;
    if (!parsed || parsed.version !== VERSION) return undefined;

    const result: PartialState = {};
    for (const key of config.whitelist) {
      if (key in parsed.state) {
        result[key] = parsed.state[key];
      }
    }
    return result as Partial<TState>;
  } catch {
    return undefined;
  }
};

export const createPersistMiddleware = <TState extends object>(
  config: PersistConfig<TState>,
): Middleware => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastSerialized = '';

  return (store) => (next) => (action) => {
    const result = next(action);

    if (!isStorageAvailable()) return result;

    if (timeoutId !== null) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      timeoutId = null;
      try {
        const state = store.getState() as TState;
        const snapshot: PartialState = {};
        for (const key of config.whitelist) {
          snapshot[key] = state[key];
        }
        const payload = JSON.stringify({ version: VERSION, state: snapshot });
        if (payload === lastSerialized) return;
        lastSerialized = payload;
        window.localStorage.setItem(STORAGE_KEY, payload);
      } catch {
        // игнорируем: quota / private mode / и т.п.
      }
    }, DEBOUNCE_MS);

    return result;
  };
};

export const clearPersistedState = (): void => {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
};
