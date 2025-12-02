import { retrieveLaunchParams } from '@tma.js/sdk-react';

/**
 * Hook to determine if the app is running on a mobile platform
 * @returns true if platform is iOS or Android, false otherwise
 */
export const useIsMobile = (): boolean => {
  try {
    const launchParams = retrieveLaunchParams();
    const platform = launchParams.tgWebAppPlatform;
    
    // Mobile platforms: ios, android
    // Desktop platforms: macos, tdesktop, web, weba, etc.
    return platform === 'ios' || platform === 'android';
  } catch {
    // Fallback: check window width if launchParams not available
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  }
};

