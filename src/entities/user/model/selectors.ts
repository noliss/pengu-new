import type { RootState } from '@shared/store/types';

export const selectUser = (state: RootState) => state.user.user;
export const selectAuthToken = (state: RootState) => state.user.token;
export const selectAuthStatus = (state: RootState) => state.user.status;
export const selectAuthError = (state: RootState) => state.user.error;
export const selectIsAuthenticated = (state: RootState) => state.user.status === 'authenticated';
export const selectIsAuthLoading = (state: RootState) => state.user.status === 'loading';
