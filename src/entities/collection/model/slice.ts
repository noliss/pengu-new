import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CollectionsState } from './types';
import { fetchCollections } from './thunks';

const initialState: CollectionsState = {
  items: [],
  status: 'idle',
  error: null,
  search: '',
  sort: 'default',
};

const collectionSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setSort: (state, action: PayloadAction<CollectionsState['sort']>) => {
      state.sort = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollections.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.status = 'success';
        state.items = action.payload;
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload ?? action.error.message ?? 'Failed to load';
      });
  },
});

export const { setSearch, setSort } = collectionSlice.actions;
export const collectionReducer = collectionSlice.reducer;
