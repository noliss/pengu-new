import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  CharacterDraft,
  CharacterState,
  GenerationType,
  HistoryEntry,
  PartSelection,
} from './types';

const MAX_HISTORY = 20;

const createEmptyDraft = (): CharacterDraft => ({
  name: '',
  generationType: 'sticker',
  selections: {},
});

const initialState: CharacterState = {
  draft: createEmptyDraft(),
  activePartId: null,
  history: [],
  lastGeneratedId: null,
  saveStatus: 'idle',
  saveError: null,
};

/**
 * Сохраняет в историю текущий снэпшот selections + activePartId.
 * Вызывать ДО изменения соответствующих полей — чтобы undo вернул
 * состояние ровно в то, что было до действия.
 */
const pushHistory = (state: CharacterState) => {
  state.history.push({
    selections: { ...state.draft.selections },
    activePartId: state.activePartId,
  });
  if (state.history.length > MAX_HISTORY) {
    state.history.shift();
  }
};

const characterSlice = createSlice({
  name: 'character',
  initialState,
  reducers: {
    setCharacterName: (state, action: PayloadAction<string>) => {
      state.draft.name = action.payload;
    },
    setGenerationType: (state, action: PayloadAction<GenerationType>) => {
      state.draft.generationType = action.payload;
    },
    setActivePartId: (state, action: PayloadAction<string | null>) => {
      // Пушим историю только при реальной смене значения — иначе повторные клики
      // по той же части зашумляли бы стек. Пуш важен, чтобы undo мог сбросить
      // выбранную часть тела обратно в null даже после нескольких отмен selections.
      if (state.activePartId === action.payload) return;
      pushHistory(state);
      state.activePartId = action.payload;
    },
    setPartSelection: (state, action: PayloadAction<PartSelection>) => {
      const { partId, svgId } = action.payload;
      const prev = state.draft.selections[partId];
      const last = state.history[state.history.length - 1];

      // Это защищает стек от спама событий HexColorPicker и сохраняет возможность
      // откатиться к состоянию до начала редактирования цвета.
      const isColorOnlyChange = Boolean(prev) && prev?.svgId === svgId;
      const alreadyCaptured =
        isColorOnlyChange &&
        last?.selections[partId]?.svgId === svgId &&
        last.activePartId === state.activePartId;

      if (!alreadyCaptured) {
        pushHistory(state);
      }
      state.draft.selections[partId] = action.payload;
    },
    clearPartSelection: (state, action: PayloadAction<string>) => {
      if (!(action.payload in state.draft.selections)) return;
      pushHistory(state);
      delete state.draft.selections[action.payload];
    },
    undoDraft: (state) => {
      const prev: HistoryEntry | undefined = state.history.pop();
      if (!prev) return;
      state.draft.selections = prev.selections;
      state.activePartId = prev.activePartId;
    },
    resetDraft: (state) => {
      state.draft = createEmptyDraft();
      state.activePartId = null;
      state.history = [];
    },
    randomizeDraft: (
      state,
      action: PayloadAction<{ partIds: string[]; svgIds: string[]; colors: string[] }>,
    ) => {
      const { partIds, svgIds, colors } = action.payload;
      pushHistory(state);
      const pick = <T,>(arr: T[]): T | null =>
        arr.length ? arr[Math.floor(Math.random() * arr.length)]! : null;
      state.draft.selections = partIds.reduce<Record<string, PartSelection>>((acc, partId) => {
        acc[partId] = {
          partId,
          svgId: pick(svgIds),
          color: pick(colors),
        };
        return acc;
      }, {});
      state.activePartId = pick(partIds);
    },
  },
});

export const {
  setCharacterName,
  setGenerationType,
  setActivePartId,
  setPartSelection,
  clearPartSelection,
  undoDraft,
  resetDraft,
  randomizeDraft,
} = characterSlice.actions;

export const characterReducer = characterSlice.reducer;
