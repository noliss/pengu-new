import type { ReactNode } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import type { SxProps, Theme } from '@mui/material';
import styles from './PageHeader.module.scss';

interface PageHeaderProps {
  title: string;
  rightSlot?: ReactNode;
  sx?: SxProps<Theme>;
}

export const PageHeader = ({ title, rightSlot, sx }: PageHeaderProps) => (
  <Grid
    container
    justifyContent="space-between"
    alignItems="center"
    className={styles.container}
    sx={sx}
  >
    <Typography align="center" variant="h5" className={styles.title}>
      {title}
    </Typography>
    {rightSlot}
  </Grid>
);
