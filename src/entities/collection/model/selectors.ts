import type { RootState } from '@shared/store/types';
import { createSelector } from '@reduxjs/toolkit';
import type { Collection } from './types';

export const selectCollections = (state: RootState) => state.collection.items;
export const selectCollectionsStatus = (state: RootState) => state.collection.status;
export const selectCollectionsError = (state: RootState) => state.collection.error;
export const selectCollectionsSearch = (state: RootState) => state.collection.search;
export const selectCollectionsSort = (state: RootState) => state.collection.sort;

export const selectFilteredCollections = createSelector(
  [selectCollections, selectCollectionsSearch, selectCollectionsSort],
  (items, search, sort): Collection[] => {
    const term = search.trim().toLowerCase();
    const filtered = term
      ? items.filter((item) => item.title.toLowerCase().includes(term))
      : items.slice();

    switch (sort) {
      case 'price_asc':
        return filtered.sort((a, b) => compareBigIntStr(a.priceNano, b.priceNano));
      case 'price_desc':
        return filtered.sort((a, b) => compareBigIntStr(b.priceNano, a.priceNano));
      case 'title_asc':
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return filtered;
    }
  },
);

const compareBigIntStr = (a: string, b: string): number => {
  try {
    const aN = BigInt(a);
    const bN = BigInt(b);
    if (aN === bN) return 0;
    return aN < bN ? -1 : 1;
  } catch {
    return 0;
  }
};
