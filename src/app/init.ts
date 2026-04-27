import {
  emitEvent,
  setDebug,
  themeParams,
  initData,
  viewport,
  init as initSDK,
  mockTelegramEnv,
  miniApp,
  backButton,
  isTMA,
  retrieveLaunchParams,
  swipeBehavior,
} from '@tma.js/sdk-react';
import { env } from '@shared/config/env';
import { store } from '@shared/store';
import { setAppMeta, setAppReady } from '@entities/app';
import type { TgPlatform } from '@entities/app';

export interface InitOptions {
  debug: boolean;
  eruda: boolean;
  mockForMacOS: boolean;
}

const MOBILE_PLATFORMS: TgPlatform[] = ['ios', 'android', 'android_x'];
const ERUDA_BUTTON_SIZE = 50;
const ERUDA_SAFE_OFFSET = 14;

const positionEruda = (eruda: { position: (point: { x: number; y: number }) => void }) => {
  eruda.position({
    x: Math.max(ERUDA_SAFE_OFFSET, window.innerWidth - ERUDA_BUTTON_SIZE - ERUDA_SAFE_OFFSET),
    y: Math.max(ERUDA_SAFE_OFFSET, window.innerHeight - ERUDA_BUTTON_SIZE - ERUDA_SAFE_OFFSET),
  });
};

/**
 * Инициализация SDK, Telegram viewport, store-метаданных.
 * Вызывается один раз из main.tsx до рендера.
 */
export async function init(options: InitOptions): Promise<void> {
  setDebug(options.debug);
  initSDK();

  // Только dev-сервер: в production Vite вырезает ветку целиком — чанк eruda не попадает в билд.
  if (import.meta.env.DEV && options.eruda) {
    void import('eruda').then(({ default: eruda }) => {
      eruda.init();
      positionEruda(eruda);
      window.addEventListener('resize', () => positionEruda(eruda), { passive: true });
      window.addEventListener('orientationchange', () => {
        window.setTimeout(() => positionEruda(eruda), 250);
      });
    });
  }

  if (options.mockForMacOS) {
    mockTelegramEnv({
      onEvent(event, next) {
        if (event.name === 'web_app_request_safe_area') {
          return emitEvent('safe_area_changed', { left: 0, top: 0, right: 0, bottom: 0 });
        }
        next();
      },
    });
  }

  const isTelegramApp = await isTMA();

  if (isTelegramApp) {
    const launchParams = retrieveLaunchParams();
    const platform = (launchParams.tgWebAppPlatform ?? 'unknown') as TgPlatform;
    const isMobile = MOBILE_PLATFORMS.includes(platform);

    store.dispatch(
      setAppMeta({
        initDataRaw: launchParams.tgWebAppData ? serializeInitData(launchParams.tgWebAppData) : null,
        platform,
        isMobile,
        isTma: true,
        version: launchParams.tgWebAppVersion ?? null,
      }),
    );

    backButton.mount.ifAvailable();
    initData.restore();

    if (miniApp.mount.isAvailable()) {
      themeParams.mount();
      miniApp.mount();
      themeParams.bindCssVars();
    }

    if (swipeBehavior.mount.isAvailable()) {
      swipeBehavior.mount();
      if (swipeBehavior.disableVertical.isAvailable()) {
        swipeBehavior.disableVertical();
      }
    }

    if (viewport.mount.isAvailable()) {
      await viewport.mount();
      viewport.bindCssVars();
      viewport.expand();
      if (isMobile && viewport.requestFullscreen.isAvailable()) {
        await viewport.requestFullscreen();
      }
    }
  } else {
    store.dispatch(setAppMeta({ platform: 'unknown', isMobile: false, isTma: false }));
  }

  store.dispatch(setAppReady(true));

  if (env.debug) {
    console.info('[init] app ready', { isTma: isTelegramApp, env });
  }
}

/**
 * tgWebAppData в launchParams — это объект. Нам нужно отдать backend сырую строку
 * initData, которая пришла от Telegram (до разбора). SDK её не сохраняет удобно,
 * но она лежит в window.Telegram.WebApp.initData или в hash.
 *
 * Здесь простая реконструкция: по объекту tgWebAppData собираем querystring.
 * ВНИМАНИЕ: настоящая initDataRaw должна прийти 1:1, как Telegram передал,
 * иначе валидация HMAC на бэке упадёт. Лучший способ — взять window.Telegram.WebApp.initData.
 */
function serializeInitData(data: unknown): string | null {
  const wa = (window as unknown as { Telegram?: { WebApp?: { initData?: string } } }).Telegram?.WebApp;
  if (wa?.initData) return wa.initData;
  if (typeof data === 'string') return data;
  return null;
}
