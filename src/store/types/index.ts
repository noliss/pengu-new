export interface User {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  language_code?: string;
  photo_url?: string;
}

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface RootState {
  userData: AppState;
}