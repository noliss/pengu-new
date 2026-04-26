import { createAsyncThunk } from '@reduxjs/toolkit';
import type { InventoryNftItem } from './types';
import { MOCK_INVENTORY_NFTS } from './mocks';

/**
 * Загрузка инвентаря. Сейчас — мок с задержкой.
 * Заменить на `GET /inventory` / GraphQL и маппинг ответа в `InventoryNftItem[]`.
 */
export const fetchInventoryNfts = createAsyncThunk<
  InventoryNftItem[],
  void,
  { rejectValue: string }
>('inventory/fetchNfts', async (_, { rejectWithValue }) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return MOCK_INVENTORY_NFTS;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return rejectWithValue(message);
  }
});
