/**
 * Дизайн-токены приложения.
 * Единый источник правды для цветов/радиусов/теней — используется и в MUI-теме,
 * и в SCSS через CSS-переменные (см. shared/styles/tokens.scss и shared/styles/global.css).
 *
 * При изменении — обнови также tokens.scss.
 */

export const palette = {
  bg: '#0a0a0a',
  bgSoft: '#111114',
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textMuted: 'rgba(255, 255, 255, 0.5)',

  glassBg: 'rgba(255, 255, 255, 0.1)',
  glassBgStrong: 'rgba(255, 255, 255, 0.15)',
  glassBgSoft: 'rgba(255, 255, 255, 0.05)',
  glassBorder: 'rgba(255, 255, 255, 0.2)',
  glassBorderSoft: 'rgba(255, 255, 255, 0.1)',
  glassBorderStrong: 'rgba(255, 255, 255, 0.3)',

  overlay: 'rgba(0, 0, 0, 0.3)',
  overlayStrong: 'rgba(0, 0, 0, 0.5)',

  accent: '#ffffff',
  danger: '#ec3942',
  success: '#4ecdc4',
} as const;

export const radii = {
  sm: '6px',
  md: '10px',
  lg: '12px',
  xl: '16px',
  xxl: '30px',
  pill: '9999px',
} as const;

export const shadows = {
  card: '0 4px 20px rgba(0, 0, 0, 0.1)',
  cardHover: '0 8px 30px rgba(0, 0, 0, 0.2)',
  panel: '0 -8px 32px rgba(0, 0, 0, 0.3)',
  soft: '0 2px 8px rgba(0, 0, 0, 0.2)',
} as const;

export const blurs = {
  sm: 'blur(5px)',
  md: 'blur(10px)',
  lg: 'blur(20px)',
} as const;

export const transitions = {
  base: 'all 0.3s ease',
  fast: 'all 0.2s ease',
} as const;

export const zIndex = {
  bottomNav: 1000,
  floatingPanel: 999,
  dialog: 1300,
} as const;

export type Palette = typeof palette;
