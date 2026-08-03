// @ts-nocheck
import { useMemo } from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider, CssBaseline } from '@mui/material';
import useSettings from '../hooks/useSettings';

export default function ThemeProvider({ children }) {
  const { themeMode } = useSettings();
  const isDark = themeMode === 'dark';

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode: isDark ? 'dark' : 'light',
        primary: {
          main: '#6C63FF',   // vibrant purple
        },
        secondary: {
          main: '#FF6584',   // coral pink
        },
        background: {
          default: isDark ? '#0A0B0F' : '#F5F7FA',
          paper:   isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
        },
        text: {
          primary:   isDark ? '#F0F0F5' : '#1A1C20',
          secondary: isDark ? '#8B8FA8' : '#5A6072',
        },
        divider: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
      },
      typography: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        h5:       { fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' },
        subtitle2:{ fontWeight: 600, letterSpacing: '-0.01em' },
        body2:    { fontSize: '0.875rem', lineHeight: 1.5 },
        caption:  { fontSize: '0.75rem', color: '#8B92A8' },
      },
      shape: { borderRadius: 16 },
      shadows: [
        'none',
        '0px 2px 8px rgba(0,0,0,0.15)',
        '0px 4px 16px rgba(0,0,0,0.25)',
        ...Array(22).fill('none'),
      ],
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              textTransform: 'none',
              fontWeight: 600,
              padding: '8px 16px',
            },
          },
        },
        MuiIconButton: {
          styleOverrides: {
            root: { borderRadius: 12 },
          },
        },
        MuiTab: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.8rem',
            },
          },
        },
      },
    }), [isDark]);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}