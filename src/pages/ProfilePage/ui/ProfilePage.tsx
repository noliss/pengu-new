import { useTranslation } from 'react-i18next';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { Page, PageHeader } from '@shared/ui';
import { ConnectWalletButton } from '@features/connect-wallet';
import { useAppSelector } from '@shared/store';
import { selectUser } from '@entities/user';
import { selectShortWalletAddress, selectIsWalletConnected } from '@entities/wallet';
import styles from './ProfilePage.module.scss';

export const ProfilePage = () => {
  const { t } = useTranslation();
  const user = useAppSelector(selectUser);
  const shortAddress = useAppSelector(selectShortWalletAddress);
  const isWalletConnected = useAppSelector(selectIsWalletConnected);

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName || user?.username || 'Anonymous';

  return (
    <Page>
      <Container maxWidth="sm" sx={{ padding: '15px 15px' }}>
        <PageHeader title={t('profile.title')} rightSlot={<ConnectWalletButton />} />

        <Grid container spacing={2}>
          <Grid size={12}>
            <Card variant="glass">
              <CardContent>
                <Box className={styles.avatarRow}>
                  <Avatar src={user?.photoUrl} alt={user?.firstName || 'User'} className={styles.avatar}>
                    {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                  </Avatar>
                  <Box className={styles.nameBlock}>
                    <Typography variant="h5" className={styles.displayName}>
                      {displayName}
                    </Typography>
                    {user?.username && (
                      <Typography variant="body2" className={styles.username}>
                        @{user.username}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={12}>
            <Card variant="glass">
              <CardContent>
                <Typography variant="h6" className={styles.infoTitle}>
                  {t('profile.userInfo')}
                </Typography>
                <Grid container spacing={2}>
                  {user?.id !== undefined && (
                    <Grid size={12}>
                      <Typography variant="body2" className={styles.infoLabel}>
                        {t('profile.userId')}
                      </Typography>
                      <Typography variant="body1" className={styles.infoValue}>
                        {user.id}
                      </Typography>
                    </Grid>
                  )}
                  {user?.languageCode && (
                    <Grid size={12}>
                      <Typography variant="body2" className={styles.infoLabel}>
                        {t('profile.language')}
                      </Typography>
                      <Typography variant="body1" className={styles.infoValue}>
                        {user.languageCode.toUpperCase()}
                      </Typography>
                    </Grid>
                  )}
                  <Grid size={12}>
                    <Typography variant="body2" className={styles.infoLabel}>
                      {t('profile.wallet')}
                    </Typography>
                    <Typography variant="body1" className={styles.infoValue}>
                      {isWalletConnected ? shortAddress : t('profile.notConnected')}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};
