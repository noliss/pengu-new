import type { Collection } from './types';

/**
 * Моки коллекций. Заменить на ответ бэкенда, когда появится /collections.
 * Картинки временно с внешних доменов — перенести на свой CDN перед продом.
 */
export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'pengu-gold',
    title: 'Pengu Gold',
    description: 'Limited gold edition penguins.',
    imageUrl:
      'https://img.decrypt.co/insecure/rs:fit:3840:0:0:0/plain/https://cdn.decrypt.co/wp-content/uploads/2024/12/pudgy-door-gID_7.png@webp',
    priceNano: '5000000000',
    stock: 100,
    tags: ['featured', 'limited'],
  },
  {
    id: 'pengu-silver',
    title: 'Pengu Silver',
    imageUrl: 'https://pintu-academy.pintukripto.com/wp-content/uploads/2025/05/What-is-Pengu.png',
    priceNano: '2000000000',
    tags: ['classic'],
  },
  {
    id: 'pengu-classic',
    title: 'Pengu Classic',
    imageUrl: 'https://www.tbstat.com/wp/uploads/2024/12/Screenshot-2024-12-17-at-18.29.12-1200x675.png',
    priceNano: '1000000000',
  },
  {
    id: 'doodles-classic',
    title: 'Doodles Classic',
    imageUrl:
      'https://img.decrypt.co/insecure/rs:fit:3840:0:0:0/plain/https://cdn.decrypt.co/wp-content/uploads/2023/01/doodles2-gID_7.jpeg@webp',
    priceNano: '1500000000',
  },
  {
    id: 'doodles-gold',
    title: 'Doodles Gold',
    imageUrl: 'https://cointab.com/wp-content/uploads/2025/09/Doodles-.jpg',
    priceNano: '4500000000',
  },
];
