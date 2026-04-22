import type { RootState } from '@shared/store/types';

export const selectWalletAddress = (state: RootState) => state.wallet.address;
export const selectWalletStatus = (state: RootState) => state.wallet.status;
export const selectWalletName = (state: RootState) => state.wallet.walletName;
export const selectIsWalletConnected = (state: RootState) => state.wallet.status === 'connected';
export const selectWalletError = (state: RootState) => state.wallet.error;

export const selectShortWalletAddress = (state: RootState): string | null => {
  const address = state.wallet.address;
  if (!address) return null;
  if (address.length <= 10) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};
