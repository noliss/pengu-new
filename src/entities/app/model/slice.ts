import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AppMeta } from './types';

const initialState: AppMeta = {
  initDataRaw: null,
  platform: 'unknown',
  isMobile: false,
  isTma: false,
  version: null,
  ready: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppMeta: (state, action: PayloadAction<Partial<AppMeta>>) => {
      Object.assign(state, action.payload);
    },
    setAppReady: (state, action: PayloadAction<boolean>) => {
      state.ready = action.payload;
    },
  },
});

export const { setAppMeta, setAppReady } = appSlice.actions;
export const appReducer = appSlice.reducer;
