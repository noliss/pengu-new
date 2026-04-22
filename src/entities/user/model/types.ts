/**
 * Пользователь в нашем домене.
 *
 * ВАЖНО: мы НЕ храним сырой User из @tma.js/sdk — эти данные клиентские и им нельзя доверять
 * (пользователь в DevTools может подменить). Бэкенд валидирует initDataRaw (HMAC c bot token)
 * и возвращает уже доверенного пользователя + JWT/session.
 */
export interface AppUser {
  id: number;
  telegramId: number;
  firstName: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
  photoUrl?: string;
  isPremium?: boolean;
  /** Наш внутренний баланс/очки (если есть) */
  balance?: number;
  createdAt?: string;
}

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error';

export interface UserState {
  /** Данные пользователя, полученные ОТ БЭКЕНДА (после валидации initData) */
  user: AppUser | null;
  /** JWT/session от бэкенда. Хранится только в памяти — не персистим. */
  token: string | null;
  status: AuthStatus;
  error: string | null;
}
