import { createTheme, type Theme } from '@mui/material/styles';
import { palette, radii, shadows, blurs, transitions } from './tokens';

declare module '@mui/material/Card' {
  interface CardPropsVariantOverrides {
    glass: true;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    glass: true;
    glassPrimary: true;
    /** Деструктивные действия: удаление, сброс, стирание. Не путать с `glassPrimary`. */
    glassDestructive: true;
  }
}

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    glass: true;
    glassBottom: true;
  }
}

export const createAppTheme = (): Theme =>
  createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: palette.bg,
        paper: palette.bgSoft,
      },
      text: {
        primary: palette.textPrimary,
        secondary: palette.textSecondary,
      },
      primary: {
        main: palette.accent,
        light: palette.accentStrong,
        dark: palette.accentDeep,
        contrastText: palette.bg,
      },
      secondary: {
        main: palette.accentSecondary,
        contrastText: palette.textPrimary,
      },
      error: {
        main: palette.danger,
      },
      success: {
        main: palette.success,
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    components: {
      MuiCard: {
        variants: [
          {
            props: { variant: 'glass' },
            style: {
              background: palette.glassBg,
              backdropFilter: blurs.md,
              WebkitBackdropFilter: blurs.md,
              border: `1px solid ${palette.glassBorder}`,
              borderRadius: radii.xl,
              boxShadow: shadows.card,
              transition: transitions.base,
            },
          },
        ],
      },
      MuiBottomNavigation: {
        styleOverrides: {
          root: {
            background: 'transparent',
          },
        },
      },
      MuiPaper: {
        variants: [
          {
            props: { variant: 'glass' },
            style: {
              background: palette.glassBg,
              backdropFilter: blurs.md,
              WebkitBackdropFilter: blurs.md,
              border: `1px solid ${palette.glassBorder}`,
              borderRadius: radii.xl,
            },
          },
          {
            props: { variant: 'glassBottom' },
            style: {
              background: palette.glassBgSoft,
              backdropFilter: blurs.lg,
              WebkitBackdropFilter: blurs.lg,
              border: `1px solid ${palette.glassBorderSoft}`,
              borderTopLeftRadius: radii.xl,
              borderTopRightRadius: radii.xl,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              boxShadow: shadows.panel,
            },
          },
        ],
      },
      MuiButton: {
        defaultProps: {
          disableRipple: false,
        },
        variants: [
          {
            props: { variant: 'glass' },
            style: {
              background: palette.glassBgSoft,
              border: `1px solid ${palette.glassBorderSoft}`,
              color: palette.textPrimary,
              borderRadius: radii.md,
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 500,
              minWidth: 70,
              '&:hover': {
                background: palette.glassBg,
                borderColor: palette.glassBorder,
              },
            },
          },
          {
            props: { variant: 'glassPrimary' },
            style: {
              background: `linear-gradient(135deg, ${palette.accent} 0%, ${palette.accentSecondary} 100%)`,
              border: `1px solid ${palette.glassBorder}`,
              color: palette.bg,
              borderRadius: radii.md,
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 700,
              minWidth: 70,
              boxShadow: shadows.accentGlow,
              '&:hover': {
                background: `linear-gradient(135deg, ${palette.accentStrong} 0%, ${palette.accentSecondary} 100%)`,
                borderColor: palette.glassBorderStrong,
                boxShadow: shadows.accentGlowStrong,
              },
            },
          },
          {
            props: { variant: 'glassDestructive' },
            style: {
              // Только красный спектр — без магенты, иначе на короткой кнопке
              // визуально сливается с glassPrimary (cyan→magenta).
              background:
                'linear-gradient(145deg, #b80028 0%, #ff3b5c 42%, #ff7a8a 100%)',
              border: '1px solid rgba(255, 130, 145, 0.55)',
              color: '#ffffff',
              borderRadius: radii.md,
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 700,
              minWidth: 70,
              boxShadow:
                '0 4px 18px rgba(255, 25, 45, 0.5), 0 0 32px rgba(255, 40, 55, 0.22)',
              '&:hover': {
                background:
                  'linear-gradient(145deg, #d9002e 0%, #ff5a72 45%, #ffb0b8 100%)',
                borderColor: 'rgba(255, 180, 190, 0.7)',
                boxShadow:
                  '0 6px 28px rgba(255, 35, 55, 0.6), 0 0 44px rgba(255, 50, 65, 0.3)',
              },
            },
          },
        ],
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: palette.textPrimary,
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: palette.textPrimary,
          },
        },
      },
      MuiContainer: {
        styleOverrides: {
          root: {
            paddingLeft: 15,
            paddingRight: 15,
          },
        },
      },
    },
  });
