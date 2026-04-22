import * as Sentry from '@sentry/react';
import { env } from '@shared/config/env';

let initialized = false;

export const initSentry = (): void => {
  if (initialized || !env.sentry.enabled) return;
  initialized = true;

  Sentry.init({
    dsn: env.sentry.dsn,
    environment: env.sentry.environment,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
  });
};
