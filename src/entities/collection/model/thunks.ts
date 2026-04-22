import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Collection } from './types';
import { MOCK_COLLECTIONS } from './mocks';

/**
 * МОК. Заменить на реальный GET /collections, когда появится бэкенд.
 */
export const fetchCollections = createAsyncThunk<Collection[], void, { rejectValue: string }>(
  'collection/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return MOCK_COLLECTIONS;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return rejectWithValue(message);
    }
  },
);
