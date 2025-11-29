import type { RootState } from "../types";

export const useUserSelector = (state: RootState) => state.userData.user;