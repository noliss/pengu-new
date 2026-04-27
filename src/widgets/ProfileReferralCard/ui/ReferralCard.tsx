import { useTranslation } from 'react-i18next';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import GroupsIcon from '@mui/icons-material/Groups';
import PaidIcon from '@mui/icons-material/Paid';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import styles from './ReferralCard.module.scss';

interface ReferralCardProps {
  friends: number;
  earned: string;
  onDetails?: () => void;
}

export const ReferralCard = ({ friends, earned, onDetails }: ReferralCardProps) => {
  const { t } = useTranslation();

  return (
    <Card variant="glass" className={styles.card}>
      <CardContent className={styles.content}>
        <Box className={styles.header}>
          <Typography variant="subtitle2" className={styles.title}>
            {t('profile.referral.title')}
          </Typography>
          <Button
            variant="glass"
            onClick={onDetails}
            endIcon={<ArrowForwardIcon fontSize="small" />}
            className={styles.detailsButton}
          >
            {t('profile.referral.details')}
          </Button>
        </Box>

        <Box className={styles.stats}>
          <Box className={styles.stat}>
            <Box className={styles.statIcon}>
              <GroupsIcon fontSize="small" />
            </Box>
            <Typography variant="caption" className={styles.statLabel}>
              {t('profile.referral.friends')}
            </Typography>
            <Typography variant="h6" className={styles.statValue}>
              {friends}
            </Typography>
          </Box>

          <Box className={styles.divider} aria-hidden />

          <Box className={styles.stat}>
            <Box className={styles.statIcon}>
              <PaidIcon fontSize="small" />
            </Box>
            <Typography variant="caption" className={styles.statLabel}>
              {t('profile.referral.earned')}
            </Typography>
            <Typography variant="h6" className={styles.statValue}>
              {earned}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
