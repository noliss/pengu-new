import type { RootState } from '@shared/store/types';

export const selectCharacterDraft = (state: RootState) => state.character.draft;
export const selectCharacterName = (state: RootState) => state.character.draft.name;
export const selectGenerationType = (state: RootState) => state.character.draft.generationType;
export const selectCharacterSelections = (state: RootState) => state.character.draft.selections;
export const selectActivePartId = (state: RootState) => state.character.activePartId;
export const selectCanUndo = (state: RootState) => state.character.history.length > 0;
