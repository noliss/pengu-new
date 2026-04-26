import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Button from '@mui/material/Button';
import { BottomSheet } from '@shared/ui/BottomSheet/BottomSheet';
import styles from './ProfileSettingsDialog.module.scss';

interface ProfileSettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

type LanguageOption = 'ru' | 'en';

export const ProfileSettingsDialog = ({ open, onClose }: ProfileSettingsDialogProps) => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [language, setLanguage] = useState<LanguageOption>('ru');

  return (
    <BottomSheet open={open} onClose={onClose} title={t('profile.settings')}>
      <Box className={styles.group}>
        <Typography variant="caption" className={styles.groupLabel}>
          {t('profile.settingsMock.preferences')}
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
          }
          label={
            <Typography className={styles.switchLabel}>
              {t('profile.settingsMock.notifications')}
            </Typography>
          }
          labelPlacement="start"
          className={styles.switchRow}
        />

        <FormControlLabel
          control={
            <Switch
              checked={sounds}
              onChange={(e) => setSounds(e.target.checked)}
            />
          }
          label={
            <Typography className={styles.switchLabel}>
              {t('profile.settingsMock.sounds')}
            </Typography>
          }
          labelPlacement="start"
          className={styles.switchRow}
        />

      </Box>

      <Box className={styles.group}>
        <Typography variant="caption" className={styles.groupLabel}>
          {t('profile.settingsMock.language')}
        </Typography>
        <ToggleButtonGroup
          value={language}
          exclusive
          fullWidth
          onChange={(_, next: LanguageOption | null) => next && setLanguage(next)}
          className={styles.toggleGroup}
        >
          <ToggleButton value="ru" className={styles.toggle}>
            RU
          </ToggleButton>
          <ToggleButton value="en" className={styles.toggle}>
            EN
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box className={styles.actions}>
        <Button onClick={onClose} variant="glass">
          {t('common.cancel')}
        </Button>
        <Button onClick={onClose} variant="glassPrimary">
          {t('common.save')}
        </Button>
      </Box>
    </BottomSheet>
  );
};
