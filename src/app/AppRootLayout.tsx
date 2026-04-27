import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { authenticateUser, selectAuthStatus } from '@entities/user';
import { selectInitDataRaw, selectAppReady } from '@entities/app';
import { WalletStatusListener } from '@features/connect-wallet';
import { ScrollToTop } from '@shared/ui';

export const AppRootLayout = () => {
  const dispatch = useAppDispatch();
  const appReady = useAppSelector(selectAppReady);
  const initDataRaw = useAppSelector(selectInitDataRaw);
  const authStatus = useAppSelector(selectAuthStatus);

  useEffect(() => {
    if (!appReady) return;
    if (!initDataRaw) return;
    if (authStatus !== 'idle') return;
    void dispatch(authenticateUser({ initDataRaw }));
  }, [appReady, initDataRaw, authStatus, dispatch]);

  return (
    <>
      <WalletStatusListener />
      <ScrollToTop />
      <Outlet />
    </>
  );
};
