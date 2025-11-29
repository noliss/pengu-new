import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    userData: appReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;