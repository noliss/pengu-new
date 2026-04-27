import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { retrieveLaunchParams } from '@tma.js/sdk-react';

import { AppProviders } from '@app/providers';
import { init } from '@app/init';
import { initSentry } from '@app/sentry';
import { initI18n } from '@shared/i18n';
import { env } from '@shared/config/env';

import '@shared/styles/fonts.css';
import '@shared/styles/reset.css';
import '@shared/styles/global.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);

const bootstrap = async () => {
  initSentry();
  await initI18n();

  const launchParams = retrieveLaunchParams();
  const platform = launchParams.tgWebAppPlatform;
  const debug = (launchParams.tgWebAppStartParam || '').includes('debug') || env.debug;

  await init({
    debug,
    eruda: debug && (platform === 'ios' || platform === 'android'),
    mockForMacOS: platform === 'macos',
  });

  if (env.debug) {
    console.info('[main] TonConnect manifest URL:', env.tonConnect.manifestUrl);
  }

  root.render(
    <StrictMode>
      <AppProviders />
    </StrictMode>,
  );
};

bootstrap().catch((e) => {
  console.error('[main] bootstrap error:', e);
  root.render(
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem',
        padding: '2rem',
        textAlign: 'center',
        color: 'white',
      }}
    >
      <h2>Oops! Something went wrong</h2>
      <p>Please try refreshing the page or contact support if the problem persists.</p>
      {import.meta.env.DEV && (
        <pre
          style={{
            background: 'rgba(255,255,255,0.08)',
            padding: '1rem',
            borderRadius: '4px',
            fontSize: '0.875rem',
            overflow: 'auto',
            maxWidth: '100%',
          }}
        >
          {e instanceof Error ? e.message : String(e)}
        </pre>
      )}
    </div>,
  );
});
