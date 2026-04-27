import type { ComponentType } from 'react';
import { createHashRouter, Navigate } from 'react-router-dom';
import { ROUTES } from '@shared/config/routes';
import { importWithMinDelay } from '@shared/lib/importWithMinDelay';
import { Layout } from '@widgets/Layout';
import { AppRootLayout } from '../AppRootLayout';

const ROUTE_TRANSITION_MIN_MS = 500;

const lazyWithMinDelay = (importer: () => Promise<{ Component: ComponentType<object> }>) => () =>
  importWithMinDelay(importer, ROUTE_TRANSITION_MIN_MS);

export const appRouter = createHashRouter([
  {
    element: <AppRootLayout />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: ROUTES.COLLECTIONS,
            lazy: lazyWithMinDelay(() =>
              import('@pages/CollectionsPage').then((m) => ({ Component: m.CollectionsPage })),
            ),
          },
          {
            path: ROUTES.GENERATE,
            lazy: lazyWithMinDelay(() =>
              import('@pages/GeneratePage').then((m) => ({ Component: m.GeneratePage })),
            ),
          },
          {
            path: ROUTES.PROFILE,
            lazy: lazyWithMinDelay(() =>
              import('@pages/ProfilePage').then((m) => ({ Component: m.ProfilePage })),
            ),
          },
          {
            path: ROUTES.INVENTORY,
            lazy: lazyWithMinDelay(() =>
              import('@pages/InventoryPage').then((m) => ({ Component: m.InventoryPage })),
            ),
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to={ROUTES.COLLECTIONS} replace />,
      },
    ],
  },
]);
