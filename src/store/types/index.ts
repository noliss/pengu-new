import type { User } from '@tma.js/sdk-react';

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface RootState {
  userData: AppState;
}