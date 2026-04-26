import type { InventoryNftItem } from './types';

/**
 * Моки предметов инвентаря. URL картинок — те же, что у моков коллекций.
 * Заменить ответом API, когда появится бэкенд.
 */
export const MOCK_INVENTORY_NFTS: InventoryNftItem[] = [
  {
    id: 'inv-1',
    title: 'Pengu Gold',
    imageUrl:
      'https://img.decrypt.co/insecure/rs:fit:3840:0:0:0/plain/https://cdn.decrypt.co/wp-content/uploads/2024/12/pudgy-door-gID_7.png@webp',
    chainStatus: 'onchain',
    tokenId: 1842,
  },
  {
    id: 'inv-2',
    title: 'Pengu Silver',
    imageUrl: 'https://pintu-academy.pintukripto.com/wp-content/uploads/2025/05/What-is-Pengu.png',
    chainStatus: 'offchain',
  },
  {
    id: 'inv-3',
    title: 'Pengu Classic',
    imageUrl: 'https://www.tbstat.com/wp/uploads/2024/12/Screenshot-2024-12-17-at-18.29.12-1200x675.png',
    chainStatus: 'onchain',
    tokenId: 90210,
  },
  {
    id: 'inv-4',
    title: 'Doodles Classic',
    imageUrl:
      'https://img.decrypt.co/insecure/rs:fit:3840:0:0:0/plain/https://cdn.decrypt.co/wp-content/uploads/2023/01/doodles2-gID_7.jpeg@webp',
    chainStatus: 'offchain',
  },
  {
    id: 'inv-5',
    title: 'Doodles Gold',
    imageUrl: 'https://cointab.com/wp-content/uploads/2025/09/Doodles-.jpg',
    chainStatus: 'onchain',
    tokenId: 42,
  },
];
