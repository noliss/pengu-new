export const ROUTES = {
  COLLECTIONS: '/',
  COLLECTION_DETAILS: '/collections/:id',
  GENERATE: '/generate',
  PROFILE: '/profile',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];

export const buildCollectionDetailsPath = (id: string | number) => `/collections/${id}`;
