import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material';
import styles from './Loader.module.scss';
import cn from 'classnames';

interface LoaderProps {
  text?: string;
  size?: number;
  height?: number | string;
  sx?: SxProps<Theme>;
}

export const Loader = ({ 
  text, 
  size = 60, 
  height = 300,
  sx
}: LoaderProps) => {
  return (
    <Box
      className={cn(styles.container, { [styles.withText]: text })}
      sx={{ height, ...sx }}
    >
      <Box className={styles.progressWrapper}>
        <CircularProgress
          variant="determinate"
          value={100}
          size={size}
          thickness={4}
          className={styles.progressBackground}
        />
        <CircularProgress
          variant="indeterminate"
          size={size}
          thickness={4}
          className={styles.progressForeground}
        />
      </Box>
      
      {text && (
        <Typography variant="body1" className={styles.text}>
          {text}
        </Typography>
      )}
    </Box>
  );
};