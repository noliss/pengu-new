import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@shared/store';
import { selectIsWalletConnected } from '@entities/wallet';
import { ROUTES } from '@shared/config/routes';

interface RequireWalletProps {
  children: ReactNode;
  /** Куда редиректить, если кошелёк не подключен */
  fallbackPath?: string;
}

/**
 * Guard для роутов, требующих подключённого TON-кошелька.
 * Использовать для покупок / детальных экранов с оплатой.
 */
export const RequireWallet = ({ children, fallbackPath = ROUTES.PROFILE }: RequireWalletProps) => {
  const isConnected = useAppSelector(selectIsWalletConnected);
  if (!isConnected) {
    return <Navigate to={fallbackPath} replace />;
  }
  return <>{children}</>;
};
