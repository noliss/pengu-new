import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@shared/store/types';
import type { InventoryNftItem, NftChainStatus } from './types';

export const selectInventoryItems = (state: RootState) => state.inventory.items;
export const selectInventoryStatus = (state: RootState) => state.inventory.status;
export const selectInventoryError = (state: RootState) => state.inventory.error;

export const selectInventoryIsLoading = (state: RootState) =>
  state.inventory.status === 'loading' || state.inventory.status === 'idle';

export const selectInventoryIsSuccess = (state: RootState) => state.inventory.status === 'success';

export const selectInventoryNftsByChain = (chainStatus: NftChainStatus) =>
  createSelector([selectInventoryItems], (items): InventoryNftItem[] =>
    items.filter((item) => item.chainStatus === chainStatus),
  );

export const selectInventoryOnchainNfts = selectInventoryNftsByChain('onchain');
export const selectInventoryOffchainNfts = selectInventoryNftsByChain('offchain');

export const selectInventoryNftById = (id: string) => (state: RootState) =>
  state.inventory.items.find((item) => item.id === id) ?? null;

export const selectInventoryHasItems = createSelector(
  [selectInventoryItems],
  (items) => items.length > 0,
);

export const selectInventoryIsEmpty = createSelector(
  [selectInventoryStatus, selectInventoryItems],
  (status, items) => status === 'success' && items.length === 0,
);
