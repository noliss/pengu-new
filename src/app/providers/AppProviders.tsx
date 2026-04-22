import { useMemo, type ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { store } from '@shared/store';
import { createAppTheme } from '@shared/config/theme';
import { ErrorBoundary } from '@shared/ui/ErrorBoundary';
import { env } from '@shared/config/env';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  const theme = useMemo(() => createAppTheme(), []);

  return (
    <ErrorBoundary>
      <TonConnectUIProvider manifestUrl={env.tonConnect.manifestUrl}>
        <ReduxProvider store={store}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <HashRouter>{children}</HashRouter>
          </ThemeProvider>
        </ReduxProvider>
      </TonConnectUIProvider>
    </ErrorBoundary>
  );
};
