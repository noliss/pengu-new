import type { RootState } from '@shared/store/types';

export const selectAppMeta = (state: RootState) => state.app;
export const selectPlatform = (state: RootState) => state.app.platform;
export const selectIsMobile = (state: RootState) => state.app.isMobile;
export const selectInitDataRaw = (state: RootState) => state.app.initDataRaw;
export const selectAppReady = (state: RootState) => state.app.ready;
