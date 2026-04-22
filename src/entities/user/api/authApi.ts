import { env } from '@shared/config/env';
import type { AppUser } from '../model/types';

/**
 * МОК-реализация. Когда будет готов бэкенд — заменить на реальный POST к /auth/telegram.
 *
 * Реальный бэкенд:
 *  1) принимает initDataRaw (строку, как её прислал Telegram);
 *  2) валидирует HMAC подпись по TELEGRAM_BOT_TOKEN;
 *  3) возвращает { user, token } (JWT).
 *
 * НЕ передавай сюда разобранный user-объект с клиента — только сырую строку initDataRaw.
 */
export interface AuthRequest {
  initDataRaw: string;
}

export interface AuthResponse {
  user: AppUser;
  token: string;
}

const MOCK_DELAY_MS = 600;

const isMock = !env.api.url || env.api.url === 'https://api.example.com';

export const authWithTelegram = async (payload: AuthRequest): Promise<AuthResponse> => {
  if (isMock) {
    return mockAuth(payload);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), env.api.timeoutMs);

  try {
    const response = await fetch(`${env.api.url}/auth/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Auth failed: ${response.status}`);
    }

    return (await response.json()) as AuthResponse;
  } finally {
    clearTimeout(timeout);
  }
};

const mockAuth = async ({ initDataRaw }: AuthRequest): Promise<AuthResponse> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

  if (!initDataRaw) {
    throw new Error('initDataRaw is empty');
  }

  // Разбор для заглушки. В реальном бэке это делать на сервере.
  const params = new URLSearchParams(initDataRaw);
  const userJson = params.get('user');
  const tgUser = userJson ? (JSON.parse(userJson) as Record<string, unknown>) : {};

  const telegramId = Number(tgUser.id) || 0;

  return {
    token: `mock.jwt.${telegramId}.${Date.now()}`,
    user: {
      id: telegramId,
      telegramId,
      firstName: String(tgUser.first_name ?? 'Anonymous'),
      lastName: typeof tgUser.last_name === 'string' ? tgUser.last_name : undefined,
      username: typeof tgUser.username === 'string' ? tgUser.username : undefined,
      languageCode: typeof tgUser.language_code === 'string' ? tgUser.language_code : undefined,
      photoUrl: typeof tgUser.photo_url === 'string' ? tgUser.photo_url : undefined,
      isPremium: Boolean(tgUser.is_premium),
      balance: 0,
      createdAt: new Date().toISOString(),
    },
  };
};
