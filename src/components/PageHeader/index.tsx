import { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import type { SxProps, Theme } from '@mui/material';
import { TonConnectButton, useTonConnectUI } from "@tonconnect/ui-react";
import styles from './PageHeader.module.scss';

interface PageHeaderProps {
  title: string;
  sx?: SxProps<Theme>;
}

export const PageHeader = ({ title, sx }: PageHeaderProps) => {
  const [tonConnectUI] = useTonConnectUI();

  useEffect(() => {
    // Debug: Log TonConnect UI state
    if (import.meta.env.DEV) {
      console.log('TonConnect UI initialized:', tonConnectUI);
    }
  }, [tonConnectUI]);

  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      className={styles.container}
      sx={sx}
    >
      <Typography
        align="center"
        variant="h5"
        className={styles.title}
      >
        {title}
      </Typography>
      <TonConnectButton className={styles.connectButton} />
    </Grid>
  );
};