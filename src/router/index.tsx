import { Routes, Route, Navigate } from 'react-router-dom';
import { routes } from './routes';
import { Page } from '../components/Page';

export const AppRoutes = () => {
  return (
    <Routes>
      {routes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={
            <Page back={path !== '/'}>
              <Component />
            </Page>
          }
        />
      ))}
      {/* Fallback route for any unknown paths */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};