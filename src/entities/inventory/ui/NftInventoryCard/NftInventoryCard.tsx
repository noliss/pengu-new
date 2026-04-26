import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import cn from 'classnames';
import type { InventoryNftItem } from '../../model/types';
import styles from './NftInventoryCard.module.scss';

interface NftInventoryCardProps {
  item: InventoryNftItem;
}

export const NftInventoryCard = ({ item }: NftInventoryCardProps) => {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);
  const showOnchainBadges = item.chainStatus === 'onchain';

  return (
    <Card variant="glass" className={styles.card}>
      <Box className={styles.mediaWrap}>
        {showOnchainBadges && (
          <div className={styles.badges}>
            <span className={cn(styles.badge, styles.badgeNft)}>{t('inventory.nftBadge')}</span>
            {item.tokenId != null && (
              <span className={cn(styles.badge, styles.badgeId)}>#{item.tokenId}</span>
            )}
          </div>
        )}
        {imageError ? (
          <Box className={styles.imageErrorBox}>
            <ImageOutlined sx={{ fontSize: 48, color: 'rgba(255, 255, 255, 0.3)' }} />
          </Box>
        ) : (
          <CardMedia
            component="img"
            image={item.imageUrl}
            alt=""
            onError={() => setImageError(true)}
            className={styles.media}
          />
        )}
      </Box>
      <CardContent className={styles.content}>
        <Typography variant="body2" component="p" className={styles.title}>
          {item.title}
        </Typography>
      </CardContent>
    </Card>
  );
};
