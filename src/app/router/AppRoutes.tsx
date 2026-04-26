import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@shared/config/routes';
import { ScrollToTop } from '@shared/ui';
import { Layout } from '@widgets/Layout';
import { CollectionsPage } from '@pages/CollectionsPage';
import { GeneratePage } from '@pages/GeneratePage';
import { ProfilePage } from '@pages/ProfilePage';
import { InventoryPage } from '@pages/InventoryPage';

export const AppRoutes = () => (
  <>
    <ScrollToTop />
    <Routes>
      <Route element={<Layout />}>
        <Route path={ROUTES.COLLECTIONS} element={<CollectionsPage />} />
        <Route path={ROUTES.GENERATE} element={<GeneratePage />} />
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        <Route path={ROUTES.INVENTORY} element={<InventoryPage />} />
      </Route>
      <Route path="*" element={<Navigate to={ROUTES.COLLECTIONS} replace />} />
    </Routes>
  </>
);
