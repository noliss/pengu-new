import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import { Page, PageHeader } from '@shared/ui';
import { ConnectWalletButton } from '@features/connect-wallet';
import { useAppSelector } from '@shared/store';
import { selectUser } from '@entities/user';
import { UserInfoCard } from './UserInfoCard';
import { ReferralCard } from './ReferralCard';
import { NavRow } from './NavRow';
import { ProfileSettingsDialog } from './ProfileSettingsDialog';
import styles from './ProfilePage.module.scss';

// Моки: в проекте ещё нет referral-модели, показываем правдоподобные значения.
const MOCK_REFERRAL = {
  friends: 12,
  earned: '8.5k PGU',
} as const;

export const ProfilePage = () => {
  const { t } = useTranslation();
  const user = useAppSelector(selectUser);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleShare = useCallback(() => {
    // TODO: интеграция с Telegram WebApp share (shareURL / inline query).
  }, []);

  const handleReferralDetails = useCallback(() => {
    // TODO: переход на страницу реферальной программы, когда появится роут.
  }, []);

  const handleInventory = useCallback(() => {
    // TODO: переход в инвентарь, когда появится роут/страница.
  }, []);

  const handleCharacters = useCallback(() => {
    // TODO: переход к сгенерированным персонажам (история).
  }, []);

  return (
    <Page>
      <Container maxWidth="sm">
        <PageHeader title={t('profile.title')} rightSlot={<ConnectWalletButton />} />

        <Box className={styles.stack}>
          <UserInfoCard user={user} onShare={handleShare} />

          <ReferralCard
            friends={MOCK_REFERRAL.friends}
            earned={MOCK_REFERRAL.earned}
            onDetails={handleReferralDetails}
          />

          <Box className={styles.rowGroup}>
            <NavRow
              icon={<Inventory2OutlinedIcon />}
              title={t('profile.inventory')}
              hint={t('profile.inventoryHint')}
              onClick={handleInventory}
            />
            <NavRow
              icon={<AutoAwesomeOutlinedIcon />}
              title={t('profile.myCharacters')}
              hint={t('profile.myCharactersHint')}
              onClick={handleCharacters}
            />
            <NavRow
              icon={<TuneOutlinedIcon />}
              title={t('profile.settings')}
              onClick={() => setSettingsOpen(true)}
            />
          </Box>
        </Box>
      </Container>

      <ProfileSettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </Page>
  );
};
