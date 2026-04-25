import { useTranslation } from 'react-i18next';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import PersonIcon from '@mui/icons-material/Person';
import type { AppUser } from '@entities/user';
import styles from './UserInfoCard.module.scss';

interface UserInfoCardProps {
  user: AppUser | null;
  onShare?: () => void;
}

export const UserInfoCard = ({ user, onShare }: UserInfoCardProps) => {
  const { t } = useTranslation();

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName || user?.username || t('profile.anonymous');

  const avatarFallback = (user?.firstName?.[0] || user?.username?.[0] || 'U').toUpperCase();
  const isPremium = Boolean(user?.isPremium);

  return (
    <Card variant="glass" className={styles.card}>
      <CardContent className={styles.content}>
        <IconButton
          onClick={onShare}
          aria-label={t('profile.shareProfile')}
          size="small"
          className={styles.shareButton}
        >
          <IosShareOutlinedIcon fontSize="small" />
        </IconButton>

        <Avatar src={user?.photoUrl} alt={displayName} className={styles.avatar}>
          {avatarFallback}
        </Avatar>

        <Box className={styles.meta}>
          <Typography variant="h5" className={styles.name}>
            {displayName}
          </Typography>
          {user?.username && (
            <Typography variant="body2" className={styles.username}>
              @{user.username}
            </Typography>
          )}

          <Box className={styles.roleBadge} data-variant={isPremium ? 'premium' : 'user'}>
            {isPremium ? (
              <WorkspacePremiumIcon fontSize="small" />
            ) : (
              <PersonIcon fontSize="small" />
            )}
            <Typography variant="caption" className={styles.roleText}>
              {isPremium ? t('profile.role.premium') : t('profile.role.user')}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
