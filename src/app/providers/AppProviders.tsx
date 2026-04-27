import { useMemo } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { store } from '@shared/store';
import { createAppTheme } from '@shared/config/theme';
import { ErrorBoundary } from '@shared/ui/ErrorBoundary';
import { env } from '@shared/config/env';
import { appRouter } from '@app/router/appHashRouter';

export const AppProviders = () => {
  const theme = useMemo(() => createAppTheme(), []);

  return (
    <ErrorBoundary>
      <TonConnectUIProvider manifestUrl={env.tonConnect.manifestUrl}>
        <ReduxProvider store={store}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <RouterProvider router={appRouter} />
          </ThemeProvider>
        </ReduxProvider>
      </TonConnectUIProvider>
    </ErrorBoundary>
  );
};
