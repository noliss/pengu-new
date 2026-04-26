/**
 * Дизайн-токены приложения.
 * Единый источник правды для цветов/радиусов/теней — используется и в MUI-теме,
 * и в SCSS через CSS-переменные (см. shared/styles/tokens.scss и shared/styles/global.css).
 *
 * Палитра: Strict Graphite.
 * При изменении — обнови также tokens.scss/global.css.
 */

export const palette = {
  bg: '#000000',
  bgSoft: '#090a0c',
  textPrimary: '#f4f4f5',
  textSecondary: 'rgba(185, 188, 195, 0.74)',
  textMuted: 'rgba(128, 132, 140, 0.52)',

  glassBg: 'rgba(255, 255, 255, 0.045)',
  glassBgStrong: 'rgba(255, 255, 255, 0.085)',
  glassBgSoft: 'rgba(255, 255, 255, 0.025)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  glassBorderSoft: 'rgba(255, 255, 255, 0.065)',
  glassBorderStrong: 'rgba(255, 255, 255, 0.2)',

  overlay: 'rgba(0, 0, 0, 0.56)',
  overlayStrong: 'rgba(0, 0, 0, 0.78)',

  accent: '#a3a3a3',
  accentStrong: '#d4d4d4',
  accentDeep: '#5f5f5f',

  accentSecondary: '#eeeeee',

  danger: '#d96773',
  success: '#8fc7b1',
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
  card: '0 4px 20px rgba(0, 0, 0, 0.65)',
  cardHover: '0 8px 30px rgba(0, 0, 0, 0.8)',
  panel: '0 -8px 32px rgba(0, 0, 0, 0.78)',
  soft: '0 2px 8px rgba(0, 0, 0, 0.55)',
  accentGlow: '0 4px 16px rgba(163, 163, 163, 0.28)',
  accentGlowStrong:
    '0 8px 24px rgba(163, 163, 163, 0.38), 0 4px 16px rgba(238, 238, 238, 0.22)',
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

export type Palette = typeof palette;
