import { createAsyncThunk } from '@reduxjs/toolkit';
import { authWithTelegram } from '../api/authApi';
import type { AuthResponse } from '../api/authApi';

/**
 * Валидация пользователя через бэкенд.
 *
 * Принимает сырой initDataRaw, отдаёт его на сервер. Слайс обработает
 * pending/fulfilled/rejected и положит user+token в состояние.
 */
export const authenticateUser = createAsyncThunk<
  AuthResponse,
  { initDataRaw: string },
  { rejectValue: string }
>('user/authenticate', async ({ initDataRaw }, { rejectWithValue }) => {
  try {
    return await authWithTelegram({ initDataRaw });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return rejectWithValue(message);
  }
});
