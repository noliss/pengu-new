export type CollectionId = string;

export interface Collection {
  id: CollectionId;
  title: string;
  description?: string;
  imageUrl: string;
  /** Цена в нанотонах (1 TON = 1e9). Хранить лучше как строку, если будут очень большие суммы. */
  priceNano: string;
  /** Остаток, если коллекция лимитированная */
  stock?: number;
  tags?: string[];
}

export type CollectionsLoadStatus = 'idle' | 'loading' | 'success' | 'error';

export interface CollectionsState {
  items: Collection[];
  status: CollectionsLoadStatus;
  error: string | null;
  search: string;
  sort: 'default' | 'price_asc' | 'price_desc' | 'title_asc';
}
