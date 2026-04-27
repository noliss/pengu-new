import { useMemo } from 'react';
import { Outlet, useNavigate, useLocation, useNavigation } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';
import AppsIcon from '@mui/icons-material/Apps';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PersonIcon from '@mui/icons-material/Person';
import cn from 'classnames';
import { ROUTES } from '@shared/config/routes';
import { useIsMobile } from '@shared/hooks';
import { Loader } from '@shared/ui';
import styles from './Layout.module.scss';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { path: ROUTES.COLLECTIONS, label: 'Collections', icon: <AppsIcon /> },
  { path: ROUTES.GENERATE, label: 'Character', icon: <AutoAwesomeIcon /> },
  { path: ROUTES.PROFILE, label: 'Profile', icon: <PersonIcon /> },
];

export const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navigation = useNavigation();
  const isMobile = useIsMobile();

  /** Пока грузится lazy-чанк, подсвечиваем таб целевого маршрута (переход «сразу», лоадер только в контенте). */
  const effectivePathname = useMemo(() => {
    if (navigation.state === 'loading' && navigation.location) {
      return navigation.location.pathname;
    }
    return location.pathname;
  }, [location.pathname, navigation.location, navigation.state]);

  const activeIndex = useMemo(() => {
    const index = NAV_ITEMS.findIndex((item) =>
      item.path === ROUTES.COLLECTIONS
        ? effectivePathname === '/' || effectivePathname.startsWith('/collections')
        : effectivePathname.startsWith(item.path),
    );
    return index >= 0 ? index : 0;
  }, [effectivePathname]);

  const routeLoading = navigation.state === 'loading';

  return (
    <Box className={cn(styles.container, { [styles.mobile]: isMobile })}>
      <div className={cn(styles.outlet, routeLoading && styles.outletAwaitingRoute)}>
        <div className={styles.outletFrame} aria-hidden={routeLoading}>
          <Outlet />
        </div>
        {routeLoading ? (
          <div className={styles.outletLoading} aria-busy="true" aria-live="polite">
            <Loader size={52} height={112} />
          </div>
        ) : null}
      </div>

      <BottomNavigation value={activeIndex} className={styles.bottomNav}>
        {NAV_ITEMS.map((item) => (
          <BottomNavigationAction
            key={item.path}
            icon={item.icon}
            aria-label={item.label}
            onClick={() => navigate(item.path)}
          />
        ))}
      </BottomNavigation>
    </Box>
  );
};
