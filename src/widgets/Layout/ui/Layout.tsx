import { useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';
import AppsIcon from '@mui/icons-material/Apps';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PersonIcon from '@mui/icons-material/Person';
import cn from 'classnames';
import { ROUTES } from '@shared/config/routes';
import { useIsMobile } from '@shared/hooks';
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
  const isMobile = useIsMobile();

  const activeIndex = useMemo(() => {
    const index = NAV_ITEMS.findIndex((item) =>
      item.path === ROUTES.COLLECTIONS
        ? location.pathname === '/' || location.pathname.startsWith('/collections')
        : location.pathname.startsWith(item.path),
    );
    return index >= 0 ? index : 0;
  }, [location.pathname]);

  return (
    <Box className={cn(styles.container, { [styles.mobile]: isMobile })}>
      <Outlet />

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
