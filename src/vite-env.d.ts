/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Семантическая версия из package.json на момент сборки (см. vite.config). */
  readonly VITE_APP_VERSION: string;
}
