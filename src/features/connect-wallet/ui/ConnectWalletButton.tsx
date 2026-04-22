import { TonConnectButton } from '@tonconnect/ui-react';

interface ConnectWalletButtonProps {
  className?: string;
}

export const ConnectWalletButton = ({ className }: ConnectWalletButtonProps) => (
  <TonConnectButton className={className} />
);
