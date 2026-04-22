export type GenerationType = 'sticker' | 'emoji';

/** Секции-атрибуты, которые пользователь настраивает */
export interface CharacterPart {
  id: string;
  label: string;
}

/** Выбор пользователем для конкретной части (один SVG + опциональный цвет) */
export interface PartSelection {
  partId: string;
  svgId: string | null;
  color: string | null;
}

/** Черновик персонажа в процессе сборки */
export interface CharacterDraft {
  name: string;
  generationType: GenerationType;
  /** Ключ — partId */
  selections: Record<string, PartSelection>;
}

/** Снэпшот для undo-стека: откатываем контент + активную часть атомарно */
export interface HistoryEntry {
  selections: Record<string, PartSelection>;
  activePartId: string | null;
}

export interface CharacterState {
  draft: CharacterDraft;
  /** UI: какая часть сейчас редактируется пользователем. null — никакая. */
  activePartId: string | null;
  history: HistoryEntry[];
  /** Сохранённый на бэке character (после генерации) */
  lastGeneratedId: string | null;
  saveStatus: 'idle' | 'saving' | 'success' | 'error';
  saveError: string | null;
}
