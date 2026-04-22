import type { CharacterPart } from './types';

/**
 * Моки для шагов генерации. Когда будет бэкенд — приходят с /generator/config.
 */
export const MOCK_CHARACTER_PARTS: CharacterPart[] = [
  { id: 'beak', label: 'Клюв' },
  { id: 'wings', label: 'Крылья' },
  { id: 'feet', label: 'Лапы' },
  { id: 'eyes', label: 'Глаза' },
  { id: 'tail', label: 'Хвост' },
  { id: 'neck', label: 'Шея' },
  { id: 'head', label: 'Голова' },
  { id: 'body', label: 'Туловище' },
];

export const DEFAULT_COLORS: string[] = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FFA07A',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#85C1E2',
];
