/**
 * Типизированная обёртка над import.meta.env.
 * Любая переменная окружения читается строго здесь — не разбрасываем `import.meta.env.*` по коду.
 */

const readString = (key: string, fallback = ''): string => {
  const value = import.meta.env[key];
  return typeof value === 'string' && value.length > 0 ? value : fallback;
};

const readBoolean = (key: string, fallback = false): boolean => {
  const raw = readString(key, String(fallback));
  return raw === 'true' || raw === '1';
};

const readNumber = (key: string, fallback: number): number => {
  const raw = readString(key);
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export type TonNetwork = 'mainnet' | 'testnet';

const tonNetwork: TonNetwork = readString('VITE_TON_NETWORK', 'testnet') === 'mainnet' ? 'mainnet' : 'testnet';

export const env = {
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  mode: import.meta.env.MODE,
  debug: readBoolean('VITE_DEBUG', import.meta.env.DEV),

  tonConnect: {
    manifestUrl: readString(
      'VITE_TONCONNECT_MANIFEST_URL',
      'https://noliq.github.io/pengu-new/tonconnect-manifest.json',
    ),
  },

  api: {
    url: readString('VITE_API_URL', ''),
    timeoutMs: readNumber('VITE_API_TIMEOUT_MS', 15_000),
  },

  ton: {
    network: tonNetwork,
    collectionMasterAddress: readString('VITE_COLLECTION_MASTER_ADDRESS'),
    receiverWalletAddress: readString('VITE_RECEIVER_WALLET_ADDRESS'),
  },

  sentry: {
    dsn: readString('VITE_SENTRY_DSN'),
    environment: readString('VITE_SENTRY_ENVIRONMENT', import.meta.env.MODE),
    enabled: readString('VITE_SENTRY_DSN').length > 0,
  },
} as const;

export type Env = typeof env;
