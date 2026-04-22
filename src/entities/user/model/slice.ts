import { createSlice } from '@reduxjs/toolkit';
import type { UserState } from './types';
import { authenticateUser } from './thunks';

const initialState: UserState = {
  user: null,
  token: null,
  status: 'idle',
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.status = 'authenticated';
        state.error = null;
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload ?? action.error.message ?? 'Auth failed';
      });
  },
});

export const { logout } = userSlice.actions;
export const userReducer = userSlice.reducer;
