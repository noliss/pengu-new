import { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { TonConnectButton, useTonConnectUI } from "@tonconnect/ui-react";

interface PageHeaderProps {
  title: string;
}

export const PageHeader = ({ title }: PageHeaderProps) => {
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
      pb={3}
    >
      <Typography
        align="center"
        variant="h5"
        sx={{
          color: "white",
          textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
        }}
      >
        {title}
      </Typography>
      <TonConnectButton style={{ maxWidth: '160px' }} />
    </Grid>
  );
};