import { useCallback, useState } from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { BottomSheet } from '@shared/ui';
import type { GenerationType } from '@entities/character';
import styles from './GenerateSettingsDialog.module.scss';

interface GenerateSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  characterName?: string;
  generationType?: GenerationType;
  onSave?: (characterName: string, generationType: GenerationType) => void;
}

/**
 * Форма с внутренним состоянием — монтируется только при открытии BottomSheet'а
 * (keepMounted={false}), поэтому initial-значения можно безопасно подтягивать
 * в useState без useEffect.
 */
const SettingsForm = ({
  initialName,
  initialType,
  onClose,
  onSave,
}: {
  initialName: string;
  initialType: GenerationType;
  onClose: () => void;
  onSave?: (name: string, type: GenerationType) => void;
}) => {
  const [name, setName] = useState(initialName);
  const [type, setType] = useState<GenerationType>(initialType);

  const handleSave = useCallback(() => {
    onSave?.(name, type);
    onClose();
  }, [name, type, onSave, onClose]);

  return (
    <>
      <TextField
        label="Название персонажа"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        variant="outlined"
        size="small"
        className={styles.textField}
      />

      <Box className={styles.typeRow}>
        <FormControlLabel
          control={
            <Switch
              checked={type === 'emoji'}
              onChange={(e) => setType(e.target.checked ? 'emoji' : 'sticker')}
            />
          }
          label={
            <Typography className={styles.switchLabel}>
              {type === 'emoji' ? 'Эмодзи' : 'Стикер'}
            </Typography>
          }
          sx={{ margin: 0 }}
        />
      </Box>

      <Box className={styles.actions}>
        <Button onClick={onClose} variant="glass">
          Отмена
        </Button>
        <Button onClick={handleSave} variant="glassPrimary">
          Создать
        </Button>
      </Box>
    </>
  );
};

export const GenerateSettingsDialog = ({
  open,
  onClose,
  characterName = '',
  generationType = 'sticker',
  onSave,
}: GenerateSettingsDialogProps) => (
  <BottomSheet open={open} onClose={onClose} title="Создать персонажа">
    <SettingsForm
      initialName={characterName}
      initialType={generationType}
      onClose={onClose}
      onSave={onSave}
    />
  </BottomSheet>
);
