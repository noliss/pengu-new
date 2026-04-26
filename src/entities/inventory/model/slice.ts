import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { InventoryNftItem, InventoryState } from './types';
import { fetchInventoryNfts } from './thunks';

const initialState: InventoryState = {
  items: [],
  status: 'idle',
  error: null,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    /** Сброс списка (например, при выходе из аккаунта). */
    clearInventory: (state) => {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    },
    /**
     * Прямая подстановка данных (оптимистичное обновление / сокет / кэш).
     * Для полного рефетча используй `fetchInventoryNfts`.
     */
    setInventoryItems: (state, action: PayloadAction<InventoryNftItem[]>) => {
      state.items = action.payload;
      state.status = 'success';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryNfts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchInventoryNfts.fulfilled, (state, action) => {
        state.status = 'success';
        state.items = action.payload;
      })
      .addCase(fetchInventoryNfts.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload ?? action.error.message ?? 'Failed to load';
      });
  },
});

export const { clearInventory, setInventoryItems } = inventorySlice.actions;
export const inventoryReducer = inventorySlice.reducer;
