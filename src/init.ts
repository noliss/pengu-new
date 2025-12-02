import {
  emitEvent,
  setDebug,
  themeParams,
  initData,
  viewport,
  init as initSDK,
  mockTelegramEnv,
  miniApp,
  backButton,
  isTMA,
  retrieveLaunchParams,
  swipeBehavior
} from '@tma.js/sdk-react';

/**
 * Initializes the application and configures its dependencies.
 */
export async function init(options: {
  debug: boolean;
  eruda: boolean;
  mockForMacOS: boolean;
}): Promise<void> {
  // Set @telegram-apps/sdk-react debug mode and initialize it.
  setDebug(options.debug);
  initSDK();

  // Add Eruda if needed.
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  options.eruda && void import('eruda').then(({ default: eruda }) => {
    eruda.init();
    eruda.position({ x: window.innerWidth - 50, y: 0 });
  });

  // Telegram for macOS has a ton of bugs, including cases, when the client doesn't
  // even response to the "web_app_request_theme" method. It also generates an incorrect
  // event for the "web_app_request_safe_area" method.
  if (options.mockForMacOS) {
    // let firstThemeSent = false;
    mockTelegramEnv({
      onEvent(event, next) {
        // if (event.name === 'web_app_request_theme') {
        //   let tp: ThemeParams = {};
        //   if (firstThemeSent) {
        //     tp = themeParams.state();
        //   } else {
        //     firstThemeSent = true;
        //     tp ||= retrieveLaunchParams().tgWebAppThemeParams;
        //   }
        //   return emitEvent('theme_changed', { theme_params: tp });
        // }

        if (event.name === 'web_app_request_safe_area') {
          return emitEvent('safe_area_changed', { left: 0, top: 0, right: 0, bottom: 0 });
        }

        next();
      },
    });
  }

  // Check if running in Telegram Mini App
  const isTelegramApp = await isTMA();

  if (isTelegramApp) {
    // Get platform to check if it's mobile
    const launchParams = retrieveLaunchParams();
    const platform = launchParams.tgWebAppPlatform;
    const isMobile = platform === 'ios' || platform === 'android';

    // Mount all components used in the project.
    backButton.mount.ifAvailable();
    initData.restore();

    if (miniApp.mount.isAvailable()) {
      themeParams.mount();
      miniApp.mount();
      themeParams.bindCssVars();
      backButton.show();
    }

    // Mount swipeBehavior first, then disable vertical swipes
    if (swipeBehavior.mount.isAvailable()) {
      swipeBehavior.mount();
      
      // After mounting, disable vertical swipes
      if (swipeBehavior.disableVertical.isAvailable()) {
        swipeBehavior.disableVertical();
      }
    }

    // Initialize viewport with expand and fullscreen
    if (viewport.mount.isAvailable()) {
      await viewport.mount();
      viewport.bindCssVars();
      
      // Expand the Mini App viewport
      viewport.expand();
      
      // Request fullscreen only on mobile devices
      if (isMobile && viewport.requestFullscreen.isAvailable()) {
        await viewport.requestFullscreen();
      }
    }
  }
}