/**
 * Дизайн-токены приложения.
 * Единый источник правды для цветов/радиусов/теней — используется и в MUI-теме,
 * и в SCSS через CSS-переменные (см. shared/styles/tokens.scss и shared/styles/global.css).
 *
 * При изменении — обнови также tokens.scss.
 *
 * Палитра: Neon Cyber Noir (NFT / liquid glass).
 */

export const palette = {
  bg: '#010204',
  bgSoft: '#06070c',
  textPrimary: '#f5fbff',
  textSecondary: 'rgba(225, 240, 255, 0.7)',
  textMuted: 'rgba(200, 215, 230, 0.46)',

  glassBg: 'rgba(160, 220, 255, 0.06)',
  glassBgStrong: 'rgba(160, 220, 255, 0.12)',
  glassBgSoft: 'rgba(160, 220, 255, 0.03)',
  glassBorder: 'rgba(190, 230, 255, 0.18)',
  glassBorderSoft: 'rgba(190, 230, 255, 0.08)',
  glassBorderStrong: 'rgba(190, 230, 255, 0.28)',

  overlay: 'rgba(0, 0, 0, 0.45)',
  overlayStrong: 'rgba(0, 0, 0, 0.68)',

  accent: '#00e5ff',
  accentStrong: '#22eeff',
  accentDeep: '#0099b8',
  accentSoft: 'rgba(0, 229, 255, 0.16)',

  accentSecondary: '#ff2ec4',
  accentSecondarySoft: 'rgba(255, 46, 196, 0.16)',

  danger: '#ff3b5c',
  success: '#3df5d3',
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
  accentGlow: '0 6px 22px rgba(0, 229, 255, 0.5)',
  accentGlowStrong:
    '0 8px 28px rgba(0, 229, 255, 0.65), 0 4px 20px rgba(255, 46, 196, 0.4)',
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
