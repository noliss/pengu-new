import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { WalletState, WalletStatus } from './types';

const initialState: WalletState = {
  address: null,
  walletName: null,
  chain: null,
  status: 'disconnected',
  error: null,
};

interface WalletConnectedPayload {
  address: string;
  walletName: string | null;
  chain: string | null;
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    walletConnecting: (state) => {
      state.status = 'connecting';
      state.error = null;
    },
    walletConnected: (state, action: PayloadAction<WalletConnectedPayload>) => {
      state.address = action.payload.address;
      state.walletName = action.payload.walletName;
      state.chain = action.payload.chain;
      state.status = 'connected';
      state.error = null;
    },
    walletDisconnected: (state) => {
      state.address = null;
      state.walletName = null;
      state.chain = null;
      state.status = 'disconnected';
      state.error = null;
    },
    walletError: (state, action: PayloadAction<string>) => {
      state.status = 'error';
      state.error = action.payload;
    },
    setWalletStatus: (state, action: PayloadAction<WalletStatus>) => {
      state.status = action.payload;
    },
  },
});

export const {
  walletConnecting,
  walletConnected,
  walletDisconnected,
  walletError,
  setWalletStatus,
} = walletSlice.actions;

export const walletReducer = walletSlice.reducer;
