import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { KeyboardArrowRightOutlined, ImageOutlined } from '@mui/icons-material';
import type { SxProps, Theme } from '@mui/material';
import styles from './CollectionCard.module.scss';

interface CollectionCardProps {
  title: string;
  imageUrl: string;
  onClick?: () => void;
  sx?: SxProps<Theme>;
}

const MAX_TITLE_LENGTH = 28;

const truncateTitle = (title: string): string =>
  title.length > MAX_TITLE_LENGTH ? `${title.slice(0, MAX_TITLE_LENGTH)}…` : title;

export const CollectionCard = ({ title, imageUrl, onClick, sx }: CollectionCardProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Card variant="glass" onClick={onClick} className={styles.card} sx={sx}>
      {imageError ? (
        <Box className={styles.imageErrorBox}>
          <ImageOutlined sx={{ fontSize: 48, color: 'rgba(255, 255, 255, 0.3)' }} />
        </Box>
      ) : (
        <CardMedia image={imageUrl} onError={() => setImageError(true)} className={styles.media} />
      )}
      <CardContent className={styles.content}>
        <Grid alignItems="center" justifyContent="space-between" direction="row" wrap="nowrap" container>
          <Typography variant="body2" className={styles.title}>
            {truncateTitle(title)}
          </Typography>
          <IconButton type="button" sx={{ color: 'white', padding: 0 }}>
            <KeyboardArrowRightOutlined />
          </IconButton>
        </Grid>
      </CardContent>
    </Card>
  );
};
