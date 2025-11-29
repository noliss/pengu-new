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

  // Configure all application dependencies.
  await init({
    debug,
    eruda: debug && ["ios", "android"].includes(platform),
    mockForMacOS: platform === "macos",
  }).then(() => {
    root.render(
      <StrictMode>
        <TonConnectUIProvider
          manifestUrl={publicUrl("tonconnect-manifest.json")}
        >
          <Provider store={store}>
            <App />
          </Provider>
        </TonConnectUIProvider>
      </StrictMode>
    );
  });
} catch (e) {
  console.log("Error render:", e);
  root.render(<div>Unsoported</div>);
}
