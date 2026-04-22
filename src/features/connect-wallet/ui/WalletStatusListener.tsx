import { useEffect } from 'react';
import { useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';
import { useAppDispatch } from '@shared/store';
import { walletConnected, walletDisconnected } from '@entities/wallet';

/**
 * Маунтится один раз на уровне App и синхронизирует состояние TonConnect
 * с нашим Redux. Отрисовывает null — чисто "listener".
 */
export const WalletStatusListener = () => {
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!tonConnectUI) return;
    const unsubscribe = tonConnectUI.onStatusChange((w) => {
      if (w) {
        dispatch(
          walletConnected({
            address: w.account.address,
            walletName: 'name' in w ? (w as { name?: string }).name ?? null : null,
            chain: w.account.chain ?? null,
          }),
        );
      } else {
        dispatch(walletDisconnected());
      }
    });
    return () => unsubscribe();
  }, [tonConnectUI, dispatch]);

  useEffect(() => {
    if (wallet) {
      dispatch(
        walletConnected({
          address: wallet.account.address,
          walletName: 'name' in wallet ? (wallet as { name?: string }).name ?? null : null,
          chain: wallet.account.chain ?? null,
        }),
      );
    }
  }, [wallet, dispatch]);

  return null;
};
