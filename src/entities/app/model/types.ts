export type TgPlatform =
  | 'ios'
  | 'android'
  | 'android_x'
  | 'macos'
  | 'tdesktop'
  | 'weba'
  | 'webk'
  | 'web'
  | 'unigram'
  | 'unknown';

export interface AppMeta {
  /** Сырой initData — строка, как её прислал Telegram. Отдаём на бэк для валидации. */
  initDataRaw: string | null;
  platform: TgPlatform;
  isMobile: boolean;
  isTma: boolean;
  version: string | null;
  ready: boolean;
}
