export type WalletStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface WalletState {
  /** TON-адрес в user-friendly формате (EQ...). null если не подключен. */
  address: string | null;
  /** Имя приложения-кошелька (Tonkeeper, MyTonWallet и т.д.) */
  walletName: string | null;
  chain: string | null;
  status: WalletStatus;
  error: string | null;
}
