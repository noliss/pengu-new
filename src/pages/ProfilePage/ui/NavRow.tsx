import type { ReactNode, MouseEventHandler } from 'react';
import ButtonBase from '@mui/material/ButtonBase';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import styles from './NavRow.module.scss';

interface NavRowProps {
  icon: ReactNode;
  title: string;
  hint?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const NavRow = ({ icon, title, hint, onClick }: NavRowProps) => (
  <ButtonBase className={styles.row} onClick={onClick}>
    <Box className={styles.iconWrap}>{icon}</Box>
    <Box className={styles.text}>
      <Typography variant="body1" className={styles.title}>
        {title}
      </Typography>
      {hint && (
        <Typography variant="caption" className={styles.hint}>
          {hint}
        </Typography>
      )}
    </Box>
    <ChevronRightIcon className={styles.chevron} />
  </ButtonBase>
);
