import { Routes, Route, Navigate } from 'react-router-dom';
import { routes } from './routes';
import { Page } from '../components/Page';
import { ROUTES } from './paths';
import { ScrollToTop } from '../components/ScrollToTop';

export const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {routes.map(({ path, Component }) => (
          <Route
            key={path}
            path={path}
            element={
              <Page back={path !== ROUTES.COLLECTIONS}>
                <Component />
              </Page>
            }
          />
        ))}
        <Route path="*" element={<Navigate to={ROUTES.COLLECTIONS} replace />} />
      </Routes>
    </>
  );
};