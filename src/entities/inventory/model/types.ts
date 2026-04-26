export type NftChainStatus = 'onchain' | 'offchain';

export type InventoryNftId = string;

/** Элемент инвентаря (NFT или оффчейн-предмет). */
export interface InventoryNftItem {
  id: InventoryNftId;
  title: string;
  imageUrl: string;
  chainStatus: NftChainStatus;
  /** Для onchain — бейдж «#tokenId». */
  tokenId?: number;
}

export type InventoryLoadStatus = 'idle' | 'loading' | 'success' | 'error';

export interface InventoryState {
  items: InventoryNftItem[];
  status: InventoryLoadStatus;
  error: string | null;
}
