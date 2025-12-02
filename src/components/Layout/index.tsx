import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';
import AppsIcon from "@mui/icons-material/Apps";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PersonIcon from "@mui/icons-material/Person";
import { ROUTES } from '../../router/paths';
import { useIsMobile } from '../../hooks/useIsMobile';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const getActiveTab = () => {
    if (location.pathname === ROUTES.COLLECTIONS) return 0;
    if (location.pathname === ROUTES.GENERATE) return 1;
    if (location.pathname === ROUTES.PROFILE) return 2;
    return 0;
  };

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", pb: 7, pt: isMobile ? 10 : 0 }}>
      {children}
      
      <BottomNavigation
        value={getActiveTab()}
        sx={{
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(5px)",
          borderTop: "2px solid rgba(255, 255, 255, 0.2)",
          borderRadius: '40px 40px 0 0',
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '40px 40px 0 0',
            background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
            zIndex: -1,
          },
          "& .MuiBottomNavigationAction-root": {
            color: "rgba(255, 255, 255, 0.8)",
            minWidth: "auto",
            padding: "8px 12px",
            transition: "all 0.3s ease",
            borderRadius: '0px',
            "&:first-of-type": {
              borderTopLeftRadius: '40px',
            },
            "&:last-of-type": {
              borderTopRightRadius: '40px',
            },
            "&:hover": {
              color: "white",
              background: "rgba(255, 255, 255, 0.1)",
            },
            "&.Mui-selected": {
              color: "white",
              background: "rgba(255, 255, 255, 0.15)",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
            },
          },
          "& .MuiBottomNavigationAction-label": {
            fontSize: "0.75rem",
            fontWeight: 500,
            transition: "all 0.3s ease",
            "&.Mui-selected": {
              fontSize: "0.8rem",
              fontWeight: 600,
            },
          },
          "& .MuiSvgIcon-root": {
            fontSize: "1.5rem",
            transition: "all 0.3s ease",
          },
        }}
        showLabels
      >
        <BottomNavigationAction label="Collections" icon={<AppsIcon />} onClick={() => navigate(ROUTES.COLLECTIONS)} />
        <BottomNavigationAction label="Character" icon={<AutoAwesomeIcon />} onClick={() => navigate(ROUTES.GENERATE)} />
        <BottomNavigationAction label="Profile" icon={<PersonIcon />} onClick={() => navigate(ROUTES.PROFILE)} />
      </BottomNavigation>
    </Box>
  );
};