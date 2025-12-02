// Include Telegram UI styles first to allow our code override the package CSS.
// import '@telegram-apps/telegram-ui/dist/styles.css';

import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { retrieveLaunchParams } from "@tma.js/sdk-react";

// Mock the environment in case, we are outside Telegram.
import { init } from "./init.ts";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/index.ts";
import { publicUrl } from "./helpers/publicUrl.ts";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

const root = ReactDOM.createRoot(document.getElementById("root")!);

try {
  const launchParams = retrieveLaunchParams();
  const { tgWebAppPlatform: platform } = launchParams;
  const debug =
    (launchParams.tgWebAppStartParam || "").includes("debug") ||
    import.meta.env.DEV;

  await init({
    debug,
    eruda: debug && ["ios", "android"].includes(platform),
    mockForMacOS: platform === "macos",
  }).then(() => {
    const manifestUrl = import.meta.env.PROD
      ? "https://noliq.github.io/pengu-new/tonconnect-manifest.json"
      : publicUrl("tonconnect-manifest.json");

    if (debug) {
      console.log("TonConnect manifest URL:", manifestUrl);
    }

    root.render(
      <StrictMode>
        <TonConnectUIProvider manifestUrl={manifestUrl}>
          <Provider store={store}>
            <App />
          </Provider>
        </TonConnectUIProvider>
      </StrictMode>
    );
  });
} catch (e) {
  console.error("Error render:", e);
  root.render(
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '1rem',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h2>Oops! Something went wrong</h2>
      <p>Please try refreshing the page or contact support if the problem persists.</p>
      {import.meta.env.DEV && (
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '1rem', 
          borderRadius: '4px',
          fontSize: '0.875rem',
          overflow: 'auto',
          maxWidth: '100%'
        }}>
          {e instanceof Error ? e.message : String(e)}
        </pre>
      )}
    </div>
  );
}
